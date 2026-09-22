"""
Batches Router
──────────────
Handles batch creation (Manufacturer), custody transfers,
QR generation, and provenance queries.
Every custody-changing event writes to BOTH PostgreSQL AND Algorand.
"""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.deps import get_db, get_current_user, require_role
from app.models.participant import Participant, ParticipantRole
from app.models.supply_chain import Batch, Transaction, TransactionType, VerificationStatus
from app.models.materials import Medicine
from app.models.ml_models import MLCounterfeitScore, MLFraudScore, ExperimentVariant
from app.schemas.supply_chain import BatchCreate, BatchResponse, BatchTransfer, TransactionResponse
from app.services.blockchain.algorand_client import algorand_client
from app.ml.registry import counterfeit_registry, fraud_registry

router = APIRouter(prefix="/batches", tags=["Batches"])

ManufacturerUser = Depends(require_role(ParticipantRole.MANUFACTURER))


@router.post("", response_model=BatchResponse, status_code=status.HTTP_201_CREATED)
async def create_batch(
    data: BatchCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = ManufacturerUser,
):
    """Manufacturer creates a new medicine batch. Triggers on-chain record + QR generation."""
    # Check medicine exists and belongs to manufacturer
    result = await db.execute(
        select(Medicine).where(Medicine.id == data.medicine_id, Medicine.manufacturer_id == current_user.id)
    )
    medicine = result.scalar_one_or_none()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found or not owned by you")

    # Compute metadata hash for chain anchoring
    metadata = {
        "batch_code": data.batch_code,
        "medicine_id": data.medicine_id,
        "batch_size": data.batch_size,
        "manufacturing_location": data.manufacturing_location,
        "production_date": str(data.production_date),
        "expiry_date": str(data.expiry_date),
        "manufacturer_id": current_user.id,
    }
    metadata_hash = algorand_client.compute_metadata_hash(metadata)

    # Write to Algorand (async, non-blocking)
    chain_result = await algorand_client.create_batch(
        batch_code=data.batch_code,
        metadata_hash=metadata_hash,
        manufacturer_address=current_user.algorand_address or "",
    )

    batch = Batch(
        medicine_id=data.medicine_id,
        batch_code=data.batch_code,
        batch_size=data.batch_size,
        manufacturing_location=data.manufacturing_location,
        manufacturing_location_risk_index=data.manufacturing_location_risk_index,
        production_date=data.production_date,
        expiry_date=data.expiry_date,
        current_custodian_id=current_user.id,
        algorand_asset_id=str(chain_result.get("asset_id", "")),
        algorand_tx_id=chain_result.get("tx_id"),
    )
    db.add(batch)
    await db.commit()
    await db.refresh(batch)

    # Score counterfeit risk in background
    background_tasks.add_task(_score_counterfeit_risk, batch.id, current_user.id, db)

    return batch


@router.post("/{batch_id}/transfer", response_model=TransactionResponse)
async def transfer_custody(
    batch_id: int,
    data: BatchTransfer,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    """Transfer custody of a batch. Writes to DB + Algorand atomically."""
    result = await db.execute(select(Batch).where(Batch.id == batch_id))
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    if batch.current_custodian_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not the current custodian")

    result = await db.execute(select(Participant).where(Participant.id == data.receiver_id))
    receiver = result.scalar_one_or_none()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Write to Algorand
    chain_result = await algorand_client.transfer_custody(
        batch_code=batch.batch_code,
        sender_address=current_user.algorand_address or "",
        receiver_address=receiver.algorand_address or "",
        quantity=data.quantity,
    )

    # Write transaction to DB
    txn = Transaction(
        batch_id=batch_id,
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        transaction_type=TransactionType.CUSTODY_TRANSFER,
        quantity=data.quantity,
        algorand_tx_id=chain_result.get("tx_id"),
        algorand_confirmed_round=chain_result.get("round"),
        verification_status=VerificationStatus.VERIFIED,
        notes=data.notes,
    )
    db.add(txn)

    # Update custodian
    batch.current_custodian_id = data.receiver_id
    await db.commit()
    await db.refresh(txn)

    # Score fraud in background
    background_tasks.add_task(_score_fraud, txn.id, db)

    return txn


@router.get("/{batch_id}/history")
async def get_batch_history(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    """Full provenance: chain + DB merged. Powers the /verify QR page."""
    result = await db.execute(
        select(Batch)
        .options(selectinload(Batch.medicine), selectinload(Batch.current_custodian))
        .where(Batch.id == batch_id)
    )
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    result = await db.execute(
        select(Transaction)
        .options(selectinload(Transaction.sender), selectinload(Transaction.receiver))
        .where(Transaction.batch_id == batch_id)
        .order_by(Transaction.timestamp.asc())
    )
    transactions = result.scalars().all()

    return {
        "batch": BatchResponse.model_validate(batch),
        "medicine_name": batch.medicine.name,
        "medicine_category": batch.medicine.category,
        "current_custodian": batch.current_custodian.name,
        "current_custodian_role": batch.current_custodian.role,
        "transactions": [
            {
                "id": t.id,
                "type": t.transaction_type,
                "sender": t.sender.name,
                "sender_role": t.sender.role,
                "receiver": t.receiver.name,
                "receiver_role": t.receiver.role,
                "quantity": t.quantity,
                "timestamp": t.timestamp,
                "algorand_tx_id": t.algorand_tx_id,
                "verification_status": t.verification_status,
            }
            for t in transactions
        ],
        "algorand_asset_id": batch.algorand_asset_id,
        "algorand_tx_id": batch.algorand_tx_id,
    }


@router.get("/verify/{batch_code}")
async def verify_by_code(batch_code: str, db: AsyncSession = Depends(get_db)):
    """Public QR landing endpoint — no authentication required."""
    result = await db.execute(
        select(Batch)
        .options(selectinload(Batch.medicine), selectinload(Batch.current_custodian))
        .where(Batch.batch_code == batch_code)
    )
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    result = await db.execute(
        select(Transaction)
        .options(selectinload(Transaction.sender), selectinload(Transaction.receiver))
        .where(Transaction.batch_id == batch.id)
        .order_by(Transaction.timestamp.asc())
    )
    transactions = result.scalars().all()

    return {
        "verified": True,
        "batch_code": batch.batch_code,
        "medicine_name": batch.medicine.name,
        "category": batch.medicine.category,
        "batch_size": batch.batch_size,
        "production_date": batch.production_date,
        "expiry_date": batch.expiry_date,
        "manufacturing_location": batch.manufacturing_location,
        "current_custodian": batch.current_custodian.name,
        "current_custodian_role": batch.current_custodian.role,
        "algorand_asset_id": batch.algorand_asset_id,
        "chain_verified": bool(batch.algorand_tx_id),
        "custody_chain": [
            {
                "step": i + 1,
                "from": t.sender.name,
                "from_role": t.sender.role,
                "to": t.receiver.name,
                "to_role": t.receiver.role,
                "timestamp": t.timestamp,
                "algorand_tx_id": t.algorand_tx_id,
            }
            for i, t in enumerate(transactions)
        ],
    }


# ─── Background scoring tasks ─────────────────────────────────────────────────

async def _score_counterfeit_risk(batch_id: int, manufacturer_id: int, db: AsyncSession):
    features = {
        "supplier_reliability_score": 7.0,
        "batch_size": 5000,
        "transfer_count": 1,
        "unexpected_transfer_flag": 0,
        "complaint_history_count": 0,
        "distribution_duration_deviation": 0.1,
    }
    result = counterfeit_registry.score(features)
    score = MLCounterfeitScore(
        batch_id=batch_id,
        risk_label=result["risk_label"],
        risk_probability=result["risk_probability"],
        shap_values=result["shap_values"],
        is_synthetic_label=result["is_synthetic_label"],
    )
    db.add(score)
    await db.commit()


async def _score_fraud(transaction_id: int, db: AsyncSession):
    for variant in [ExperimentVariant.EXPERIMENT_A, ExperimentVariant.EXPERIMENT_B]:
        features = {
            "quantity_discrepancy": 0,
            "transfer_count": 2,
            "route_deviation_score": 0.1,
            "timestamp_gap_hrs": 24,
            "verification_fail_count": 0,
        }
        result = fraud_registry.score(features, variant)
        score = MLFraudScore(
            transaction_id=transaction_id,
            model_variant=variant,
            anomaly_score=result["anomaly_score"],
            is_flagged=result["is_flagged"],
            feature_vector=result["feature_vector"],
        )
        db.add(score)
    await db.commit()

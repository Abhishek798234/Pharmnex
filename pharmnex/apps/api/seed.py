"""
PharmnEx Database Seeder
Seeds initial demo users and sample data for all portals:
- Admin (admin@pharmnex.io / admin123)
- Supplier (supplier@pharmnex.io / supplier123)
- Manufacturer (manufacturer@pharmnex.io / manufacturer123)
- Wholesaler (wholesaler@pharmnex.io / wholesaler123)
- Distributor (distributor@pharmnex.io / distributor123)
- Customer (customer@pharmnex.io / customer123)
"""
import asyncio
from datetime import date, datetime, timedelta
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models.participant import Participant, ParticipantRole
from app.models.materials import RawMaterial, Medicine
from app.models.supply_chain import Batch

DEMO_USERS = [
    {
        "name": "Dr. Sarah Mitchell",
        "email": "admin@pharmnex.io",
        "password": "admin123",
        "role": ParticipantRole.ADMIN,
        "organization": "PharmnEx Regulatory Governance",
        "phone": "+1-555-0100",
    },
    {
        "name": "BioSynthesis Labs (Supplier)",
        "email": "supplier@pharmnex.io",
        "password": "supplier123",
        "role": ParticipantRole.SUPPLIER,
        "organization": "BioSynthesis Chemical Supply Co.",
        "phone": "+1-555-0101",
    },
    {
        "name": "Apex Pharma Manufacturing",
        "email": "manufacturer@pharmnex.io",
        "password": "manufacturer123",
        "role": ParticipantRole.MANUFACTURER,
        "organization": "Apex Pharmaceuticals Global Ltd.",
        "phone": "+1-555-0102",
    },
    {
        "name": "MedDistro Alliance",
        "email": "wholesaler@pharmnex.io",
        "password": "wholesaler123",
        "role": ParticipantRole.WHOLESALER,
        "organization": "National Wholesaler Alliance",
        "phone": "+1-555-0103",
    },
    {
        "name": "SwiftCold Logistics (Distributor)",
        "email": "distributor@pharmnex.io",
        "password": "distributor123",
        "role": ParticipantRole.DISTRIBUTOR,
        "organization": "SwiftCold Chain Distribution",
        "phone": "+1-555-0104",
    },
    {
        "name": "Metro Health Pharmacy (Customer)",
        "email": "customer@pharmnex.io",
        "password": "customer123",
        "role": ParticipantRole.CUSTOMER,
        "organization": "Metro General Hospital & Pharmacy",
        "phone": "+1-555-0105",
    },
]

async def seed():
    print("[INFO] Initializing database schema...")
    await init_db()

    async with AsyncSessionLocal() as session:
        created_users = {}
        for user_data in DEMO_USERS:
            res = await session.execute(
                select(Participant).where(Participant.email == user_data["email"])
            )
            existing = res.scalar_one_or_none()
            if not existing:
                p = Participant(
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    organization=user_data["organization"],
                    phone=user_data["phone"],
                    is_active=True,
                )
                session.add(p)
                await session.flush()
                created_users[user_data["role"]] = p
                print(f"[CREATED] User: {user_data['email']} ({user_data['role'].value})")
            else:
                created_users[user_data["role"]] = existing
                print(f"[EXISTS] User: {user_data['email']}")

        # Seed sample raw material if none
        res = await session.execute(select(RawMaterial))
        if not res.scalars().first() and ParticipantRole.SUPPLIER in created_users:
            rm1 = RawMaterial(
                supplier_id=created_users[ParticipantRole.SUPPLIER].id,
                name="Paracetamol Active Pharmaceutical Ingredient (API 99.8%)",
                quantity=5000.0,
                unit="kg",
                expiry_date=date.today() + timedelta(days=730),
                price_per_unit=12.50,
            )
            rm2 = RawMaterial(
                supplier_id=created_users[ParticipantRole.SUPPLIER].id,
                name="Amoxicillin Trihydrate Powder",
                quantity=2500.0,
                unit="kg",
                expiry_date=date.today() + timedelta(days=500),
                price_per_unit=24.80,
            )
            session.add_all([rm1, rm2])
            print("[CREATED] Demo raw materials")

        # Seed sample medicine & batch if none
        res = await session.execute(select(Medicine))
        if not res.scalars().first() and ParticipantRole.MANUFACTURER in created_users:
            m1 = Medicine(
                manufacturer_id=created_users[ParticipantRole.MANUFACTURER].id,
                name="PharmnCure Paracetamol 500mg",
                category="Analgesic / Antipyretic",
                description="High-purity paracetamol formulation for pain relief and fever reduction.",
                price=4.99,
            )
            m2 = Medicine(
                manufacturer_id=created_users[ParticipantRole.MANUFACTURER].id,
                name="AmoxiCare 250mg Suspension",
                category="Antibiotic",
                description="Broad-spectrum beta-lactam antibiotic formulation.",
                price=9.50,
            )
            session.add_all([m1, m2])
            await session.flush()

            # Create sample batch
            batch = Batch(
                medicine_id=m1.id,
                batch_code="BATCH-2026-0921-A",
                batch_size=50000,
                manufacturing_location="Plant Alpha - Cleanroom 4, Boston MA",
                manufacturing_location_risk_index=0.04,
                production_date=date.today() - timedelta(days=10),
                expiry_date=date.today() + timedelta(days=720),
                current_custodian_id=created_users[ParticipantRole.DISTRIBUTOR].id,
                algorand_tx_id="MOCK_ALGO_TX_79328491823901",
                algorand_asset_id="ASA-923841",
            )
            session.add(batch)
            print("[CREATED] Demo medicines & batch")

        await session.commit()
        print("[SUCCESS] Seeding complete! All demo roles are ready to login.")

if __name__ == "__main__":
    asyncio.run(seed())

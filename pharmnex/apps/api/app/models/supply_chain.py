from __future__ import annotations
import enum
from datetime import datetime, date
from sqlalchemy import (
    String, Integer, Float, Boolean, DateTime, Date, ForeignKey,
    Enum as SAEnum, Text, JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Batch(Base):
    __tablename__ = "batches"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id"), nullable=False)
    batch_code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    batch_size: Mapped[int] = mapped_column(Integer, nullable=False)
    manufacturing_location: Mapped[str] = mapped_column(String(255), nullable=False)
    manufacturing_location_risk_index: Mapped[float] = mapped_column(Float, default=0.0)
    production_date: Mapped[date] = mapped_column(Date, nullable=False)
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    current_custodian_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    algorand_asset_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    algorand_tx_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    qr_code_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    medicine: Mapped["Medicine"] = relationship(back_populates="batches")
    current_custodian: Mapped["Participant"] = relationship(back_populates="custodian_batches")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="batch")
    orders: Mapped[list["Order"]] = relationship(back_populates="batch")
    counterfeit_scores: Mapped[list["MLCounterfeitScore"]] = relationship(back_populates="batch")


class TransactionType(str, enum.Enum):
    RAW_MATERIAL_TRANSFER = "raw_material_transfer"
    CUSTODY_TRANSFER = "custody_transfer"
    ORDER_FULFILLMENT = "order_fulfillment"
    DELIVERY = "delivery"


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    FAILED = "failed"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(ForeignKey("batches.id"), nullable=False)
    sender_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    transaction_type: Mapped[TransactionType] = mapped_column(
        SAEnum(TransactionType), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    algorand_tx_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    algorand_confirmed_round: Mapped[int | None] = mapped_column(Integer, nullable=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SAEnum(VerificationStatus), default=VerificationStatus.PENDING
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    batch: Mapped["Batch"] = relationship(back_populates="transactions")
    sender: Mapped["Participant"] = relationship(
        back_populates="sent_transactions", foreign_keys=[sender_id]
    )
    receiver: Mapped["Participant"] = relationship(
        back_populates="received_transactions", foreign_keys=[receiver_id]
    )
    fraud_scores: Mapped[list["MLFraudScore"]] = relationship(back_populates="transaction")


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    DISPUTED = "disputed"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    buyer_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    seller_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    batch_id: Mapped[int] = mapped_column(ForeignKey("batches.id"), nullable=False)
    quantity_ordered: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_received: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[OrderStatus] = mapped_column(
        SAEnum(OrderStatus), default=OrderStatus.PENDING
    )
    order_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    delivery_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    buyer: Mapped["Participant"] = relationship(
        back_populates="bought_orders", foreign_keys=[buyer_id]
    )
    seller: Mapped["Participant"] = relationship(
        back_populates="sold_orders", foreign_keys=[seller_id]
    )
    batch: Mapped["Batch"] = relationship(back_populates="orders")

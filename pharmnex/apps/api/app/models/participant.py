from __future__ import annotations
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class ParticipantRole(str, enum.Enum):
    ADMIN = "admin"
    SUPPLIER = "supplier"
    MANUFACTURER = "manufacturer"
    WHOLESALER = "wholesaler"
    DISTRIBUTOR = "distributor"
    CUSTOMER = "customer"


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    role: Mapped[ParticipantRole] = mapped_column(SAEnum(ParticipantRole), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    algorand_address: Mapped[str | None] = mapped_column(String(58), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    raw_materials: Mapped[list["RawMaterial"]] = relationship(back_populates="supplier")
    manufactured_medicines: Mapped[list["Medicine"]] = relationship(back_populates="manufacturer")
    custodian_batches: Mapped[list["Batch"]] = relationship(back_populates="current_custodian")
    sent_transactions: Mapped[list["Transaction"]] = relationship(
        back_populates="sender", foreign_keys="Transaction.sender_id"
    )
    received_transactions: Mapped[list["Transaction"]] = relationship(
        back_populates="receiver", foreign_keys="Transaction.receiver_id"
    )
    bought_orders: Mapped[list["Order"]] = relationship(
        back_populates="buyer", foreign_keys="Order.buyer_id"
    )
    sold_orders: Mapped[list["Order"]] = relationship(
        back_populates="seller", foreign_keys="Order.seller_id"
    )
    resolved_alerts: Mapped[list["AuditAlert"]] = relationship(back_populates="resolved_by_user")

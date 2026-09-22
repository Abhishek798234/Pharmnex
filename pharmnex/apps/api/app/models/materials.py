from __future__ import annotations
import enum
from datetime import date, datetime
from sqlalchemy import String, Integer, Float, Date, DateTime, ForeignKey, Enum as SAEnum, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class RawMaterial(Base):
    __tablename__ = "raw_materials"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    supplier_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), default="kg")
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    price_per_unit: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    supplier: Mapped["Participant"] = relationship(back_populates="raw_materials")


class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    manufacturer_id: Mapped[int] = mapped_column(ForeignKey("participants.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    manufacturer: Mapped["Participant"] = relationship(back_populates="manufactured_medicines")
    batches: Mapped[list["Batch"]] = relationship(back_populates="medicine")
    demand_forecasts: Mapped[list["MLDemandForecast"]] = relationship(back_populates="medicine")

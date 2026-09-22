from __future__ import annotations
import enum
from datetime import datetime, date
from sqlalchemy import (
    String, Integer, Float, Boolean, DateTime, Date, ForeignKey,
    Enum as SAEnum, Text, JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class ExperimentVariant(str, enum.Enum):
    EXPERIMENT_A = "experiment_a"
    EXPERIMENT_B = "experiment_b"


class RiskLabel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class AlertSeverity(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    HIGH = "high"
    CRITICAL = "critical"


class AlertStatus(str, enum.Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


class MLFraudScore(Base):
    __tablename__ = "ml_fraud_scores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    transaction_id: Mapped[int] = mapped_column(ForeignKey("transactions.id"), nullable=False)
    model_variant: Mapped[ExperimentVariant] = mapped_column(
        SAEnum(ExperimentVariant), nullable=False
    )
    anomaly_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0-1
    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)
    feature_vector: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_synthetic: Mapped[bool] = mapped_column(Boolean, default=False)  # HARD CONSTRAINT: label synthetic data
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    transaction: Mapped["Transaction"] = relationship(back_populates="fraud_scores")


class MLCounterfeitScore(Base):
    __tablename__ = "ml_counterfeit_scores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(ForeignKey("batches.id"), nullable=False)
    risk_label: Mapped[RiskLabel] = mapped_column(SAEnum(RiskLabel), nullable=False)
    risk_probability: Mapped[float] = mapped_column(Float, nullable=False)
    shap_values: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_synthetic_label: Mapped[bool] = mapped_column(Boolean, default=False)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    batch: Mapped["Batch"] = relationship(back_populates="counterfeit_scores")


class MLDemandForecast(Base):
    __tablename__ = "ml_demand_forecasts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id"), nullable=False)
    region: Mapped[str] = mapped_column(String(100), nullable=False)
    forecast_date: Mapped[date] = mapped_column(Date, nullable=False)
    horizon_days: Mapped[int] = mapped_column(Integer, default=30)
    predicted_demand: Mapped[float] = mapped_column(Float, nullable=False)
    model_used: Mapped[str] = mapped_column(String(50), nullable=False)  # lstm | xgboost_regression
    mae_at_eval: Mapped[float | None] = mapped_column(Float, nullable=True)
    rmse_at_eval: Mapped[float | None] = mapped_column(Float, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    medicine: Mapped["Medicine"] = relationship(back_populates="demand_forecasts")


class AuditAlert(Base):
    __tablename__ = "audit_alerts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    related_type: Mapped[str] = mapped_column(String(50), nullable=False)  # transaction | batch
    related_id: Mapped[int] = mapped_column(Integer, nullable=False)
    severity: Mapped[AlertSeverity] = mapped_column(SAEnum(AlertSeverity), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    anomaly_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[AlertStatus] = mapped_column(
        SAEnum(AlertStatus), default=AlertStatus.OPEN
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    resolved_by: Mapped[int | None] = mapped_column(ForeignKey("participants.id"), nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    resolved_by_user: Mapped["Participant | None"] = relationship(back_populates="resolved_alerts")

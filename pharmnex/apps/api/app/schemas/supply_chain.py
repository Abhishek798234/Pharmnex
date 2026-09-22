from datetime import datetime, date
from pydantic import BaseModel
from app.models.supply_chain import TransactionType, VerificationStatus, OrderStatus
from app.models.ml_models import RiskLabel, AlertSeverity, AlertStatus, ExperimentVariant


# ─── Batch Schemas ───────────────────────────────────────────────────────────

class BatchCreate(BaseModel):
    medicine_id: int
    batch_code: str
    batch_size: int
    manufacturing_location: str
    manufacturing_location_risk_index: float = 0.0
    production_date: date
    expiry_date: date


class BatchResponse(BaseModel):
    id: int
    medicine_id: int
    batch_code: str
    batch_size: int
    manufacturing_location: str
    manufacturing_location_risk_index: float
    production_date: date
    expiry_date: date
    current_custodian_id: int
    algorand_asset_id: str | None
    algorand_tx_id: str | None
    qr_code_path: str | None
    created_at: datetime
    model_config = {"from_attributes": True}


class BatchTransfer(BaseModel):
    receiver_id: int
    quantity: int
    notes: str | None = None


# ─── Transaction Schemas ─────────────────────────────────────────────────────

class TransactionResponse(BaseModel):
    id: int
    batch_id: int
    sender_id: int
    receiver_id: int
    transaction_type: TransactionType
    quantity: int
    timestamp: datetime
    algorand_tx_id: str | None
    verification_status: VerificationStatus
    model_config = {"from_attributes": True}


# ─── Order Schemas ────────────────────────────────────────────────────────────

class OrderCreate(BaseModel):
    seller_id: int
    batch_id: int
    quantity_ordered: int
    notes: str | None = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    quantity_received: int | None = None
    notes: str | None = None


class OrderResponse(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    batch_id: int
    quantity_ordered: int
    quantity_received: int | None
    status: OrderStatus
    order_date: datetime
    delivery_date: datetime | None
    model_config = {"from_attributes": True}


# ─── ML Schemas ───────────────────────────────────────────────────────────────

class FraudScoreResponse(BaseModel):
    id: int
    transaction_id: int
    model_variant: ExperimentVariant
    anomaly_score: float
    is_flagged: bool
    feature_vector: dict | None
    is_synthetic: bool
    generated_at: datetime
    model_config = {"from_attributes": True, "protected_namespaces": ()}


class CounterfeitScoreResponse(BaseModel):
    id: int
    batch_id: int
    risk_label: RiskLabel
    risk_probability: float
    shap_values: dict | None
    is_synthetic_label: bool
    generated_at: datetime
    model_config = {"from_attributes": True}


class DemandForecastResponse(BaseModel):
    id: int
    medicine_id: int
    region: str
    forecast_date: date
    horizon_days: int
    predicted_demand: float
    model_used: str
    mae_at_eval: float | None
    rmse_at_eval: float | None
    generated_at: datetime
    model_config = {"from_attributes": True, "protected_namespaces": ()}


# ─── Alert Schemas ────────────────────────────────────────────────────────────

class AlertResponse(BaseModel):
    id: int
    related_type: str
    related_id: int
    severity: AlertSeverity
    reason: str
    anomaly_score: float | None
    status: AlertStatus
    created_at: datetime
    resolved_at: datetime | None
    model_config = {"from_attributes": True}


class AlertResolve(BaseModel):
    status: AlertStatus
    notes: str | None = None


# ─── Raw Material Schemas ────────────────────────────────────────────────────

class RawMaterialCreate(BaseModel):
    name: str
    quantity: float
    unit: str = "kg"
    expiry_date: date | None = None
    price_per_unit: float = 0.0


class RawMaterialResponse(BaseModel):
    id: int
    supplier_id: int
    name: str
    quantity: float
    unit: str
    expiry_date: date | None
    price_per_unit: float
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── Medicine Schemas ─────────────────────────────────────────────────────────

class MedicineCreate(BaseModel):
    name: str
    category: str
    description: str | None = None
    price: float


class MedicineResponse(BaseModel):
    id: int
    manufacturer_id: int
    name: str
    category: str
    description: str | None
    price: float
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── Dashboard Schemas ────────────────────────────────────────────────────────

class DashboardKPIs(BaseModel):
    total_transactions: int
    active_batches: int
    high_risk_batches: int
    open_alerts: int
    avg_fraud_score: float
    forecast_accuracy_mae: float


class ExperimentResults(BaseModel):
    variant: ExperimentVariant
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    sample_count: int


class ABTestResult(BaseModel):
    experiment_a: ExperimentResults
    experiment_b: ExperimentResults
    mcnemar_p_value: float
    is_significant: bool
    verdict: str

"""
ML Model Registry
─────────────────
Loads trained model artifacts at startup.
Falls back to realistic mock predictions if models are not yet trained.
This allows the full UI to be functional before ML training is complete.
"""
import random
import math
from pathlib import Path
from app.models.ml_models import RiskLabel, ExperimentVariant

MODELS_DIR = Path(__file__).parent / "artifacts"
MODELS_DIR.mkdir(exist_ok=True)


class FraudDetectionRegistry:
    """Wraps Isolation Forest + XGBoost for fraud/anomaly scoring."""

    def __init__(self):
        self.isolation_forest = None
        self.xgboost_model = None
        self._loaded = False

    def load(self):
        try:
            import joblib
            iso_path = MODELS_DIR / "isolation_forest.joblib"
            xgb_path = MODELS_DIR / "xgboost_fraud.joblib"
            if iso_path.exists() and xgb_path.exists():
                self.isolation_forest = joblib.load(iso_path)
                self.xgboost_model = joblib.load(xgb_path)
                self._loaded = True
                print("✓ Fraud detection models loaded")
        except Exception as e:
            print(f"⚠ Fraud models not found, using mock: {e}")

    def score(self, features: dict, variant: ExperimentVariant) -> dict:
        """Returns anomaly score 0-1 and feature contributions."""
        if self._loaded:
            # Real inference would go here
            pass

        # MOCK: realistic simulation with some randomness based on features
        base = random.uniform(0.1, 0.4)
        # Inject realistic patterns
        if features.get("quantity_discrepancy", 0) > 100:
            base += 0.3
        if features.get("transfer_count", 0) > 5:
            base += 0.2
        if features.get("route_deviation_score", 0) > 0.7:
            base += 0.25
        if features.get("timestamp_gap_hrs", 48) < 2:
            base += 0.2

        score = min(base + random.gauss(0, 0.05), 1.0)
        score = max(score, 0.0)

        return {
            "anomaly_score": round(score, 4),
            "is_flagged": score > 0.80,
            "feature_vector": features,
            "model_variant": variant.value,
        }


class CounterfeitRiskRegistry:
    """Wraps Random Forest + SHAP for counterfeit risk scoring."""

    def __init__(self):
        self.model = None
        self._loaded = False

    def load(self):
        try:
            import joblib
            model_path = MODELS_DIR / "random_forest_counterfeit.joblib"
            if model_path.exists():
                self.model = joblib.load(model_path)
                self._loaded = True
                print("✓ Counterfeit risk model loaded")
        except Exception as e:
            print(f"⚠ Counterfeit model not found, using mock: {e}")

    def score(self, features: dict) -> dict:
        """Returns risk label (low/medium/high) + probability + SHAP values."""
        if self._loaded:
            pass

        # MOCK: realistic simulation
        risk_score = random.uniform(0.05, 0.95)
        if features.get("supplier_reliability_score", 5) < 3:
            risk_score += 0.2
        if features.get("unexpected_transfer_flag", 0):
            risk_score += 0.25
        if features.get("complaint_history_count", 0) > 3:
            risk_score += 0.15
        risk_score = min(risk_score, 0.99)

        if risk_score < 0.35:
            label = RiskLabel.LOW
        elif risk_score < 0.70:
            label = RiskLabel.MEDIUM
        else:
            label = RiskLabel.HIGH

        # Mock SHAP values (NOTE: simulated — replace with real SHAP after training)
        shap_values = {
            "supplier_reliability_score": round(-0.15 * (1 - features.get("supplier_reliability_score", 5) / 10), 3),
            "transfer_count": round(0.08 * features.get("transfer_count", 2), 3),
            "unexpected_transfer_flag": round(0.22 * features.get("unexpected_transfer_flag", 0), 3),
            "complaint_history_count": round(0.05 * features.get("complaint_history_count", 0), 3),
            "batch_size": round(-0.03 * math.log1p(features.get("batch_size", 1000)), 3),
        }

        return {
            "risk_label": label,
            "risk_probability": round(risk_score, 4),
            "shap_values": shap_values,
            "is_synthetic_label": True,  # IMPORTANT: labels are simulated ground truth
        }


class DemandForecastRegistry:
    """Wraps LSTM / XGBoost Regression for demand forecasting."""

    def __init__(self):
        self.model = None
        self.model_name = "mock"
        self._loaded = False

    def load(self):
        try:
            import joblib
            xgb_path = MODELS_DIR / "xgboost_demand.joblib"
            if xgb_path.exists():
                self.model = joblib.load(xgb_path)
                self.model_name = "xgboost_regression"
                self._loaded = True
                print("✓ Demand forecast model loaded")
        except Exception as e:
            print(f"⚠ Demand model not found, using mock: {e}")

    def forecast(self, medicine_id: int, region: str, horizon_days: int = 30) -> dict:
        """Returns predicted demand for the next horizon_days."""
        if self._loaded:
            pass

        # MOCK: realistic demand simulation
        base_demand = random.uniform(800, 2500)
        seasonal_factor = 1.0 + 0.2 * math.sin(2 * math.pi * random.random())
        predicted = base_demand * seasonal_factor * (horizon_days / 30)

        return {
            "predicted_demand": round(predicted, 1),
            "model_used": "mock_xgboost_regression",
            "mae_at_eval": round(random.uniform(45, 120), 2),
            "rmse_at_eval": round(random.uniform(60, 180), 2),
        }


# ─── Singleton Registry ───────────────────────────────────────────────────────

fraud_registry = FraudDetectionRegistry()
counterfeit_registry = CounterfeitRiskRegistry()
demand_registry = DemandForecastRegistry()


def load_all_models():
    """Called at FastAPI startup to warm all model artifacts."""
    fraud_registry.load()
    counterfeit_registry.load()
    demand_registry.load()

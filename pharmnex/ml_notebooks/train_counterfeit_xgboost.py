"""
PharmnEx ML Module — Counterfeit Risk Scoring (XGBoost)
────────────────────────────────────────────────────
Predicts probability of a batch being counterfeit or illegitimate based on scan velocity,
geofence jumps, manufacturer reputation index, and raw material purity metrics.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score
import joblib

def generate_counterfeit_dataset(n_samples=3000):
    np.random.seed(101)
    
    scan_velocity = np.random.exponential(scale=5.0, size=n_samples) # scans/hour
    geo_jumps = np.random.poisson(lam=0.3, size=n_samples) # impossible physical location changes
    mfg_reputation = np.random.uniform(0.7, 1.0, size=n_samples) # 0 to 1
    raw_purity = np.random.uniform(0.85, 1.0, size=n_samples) # purity score
    custody_gaps_hrs = np.random.exponential(scale=12.0, size=n_samples) # hours unmonitored

    # Synthetic target label logic: 1 = counterfeit, 0 = authentic
    risk_factor = (
        (scan_velocity > 25) * 0.35 +
        (geo_jumps > 1) * 0.40 +
        (1 - mfg_reputation) * 0.25 +
        (1 - raw_purity) * 0.20 +
        (custody_gaps_hrs > 48) * 0.30
    )
    
    is_counterfeit = (risk_factor + np.random.normal(0, 0.1, n_samples) > 0.45).astype(int)

    return pd.DataFrame({
        "scan_velocity": scan_velocity,
        "geo_jumps": geo_jumps,
        "mfg_reputation": mfg_reputation,
        "raw_purity": raw_purity,
        "custody_gaps_hrs": custody_gaps_hrs,
        "is_counterfeit": is_counterfeit
    })

def train_xgboost():
    print("Generating counterfeit risk dataset...")
    df = generate_counterfeit_dataset()

    X = df.drop(columns=["is_counterfeit"])
    y = df["is_counterfeit"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    try:
        from xgboost import XGBClassifier
        model = XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42)
    except ImportError:
        from sklearn.ensemble import GradientBoostingClassifier
        model = GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42)

    model.fit(X_train, y_train)

    preds = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, preds)
    acc = accuracy_score(y_test, (preds > 0.5).astype(int))

    print(f"Model Training Complete. Test ROC-AUC: {auc:.4f} | Accuracy: {acc:.4f}")
    joblib.dump(model, "counterfeit_risk_xgboost.joblib")
    print("Saved model to 'counterfeit_risk_xgboost.joblib'.")

if __name__ == "__main__":
    train_xgboost()

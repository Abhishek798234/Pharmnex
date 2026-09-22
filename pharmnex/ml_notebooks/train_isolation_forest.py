"""
PharmnEx ML Module — Cold-Chain Telemetry Anomaly Detection
──────────────────────────────────────────────────────────
Trains an Isolation Forest model on temperature, humidity, vibration, and GPS location delta streams
to flag cold-chain breaches and anomalous transport conditions.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def generate_synthetic_telemetry(n_samples=5000):
    np.random.seed(42)
    # Normal temperature range: 2.0°C - 8.0°C, mean ~4.5°C
    temp = np.random.normal(loc=4.5, scale=1.2, size=n_samples)
    # Normal humidity range: 40% - 60%
    humidity = np.random.normal(loc=50.0, scale=5.0, size=n_samples)
    # Transit speed (km/h)
    speed = np.random.normal(loc=65.0, scale=15.0, size=n_samples)
    # Shock / Vibration (g-force)
    vibration = np.random.normal(loc=0.2, scale=0.1, size=n_samples)

    df = pd.DataFrame({
        "temperature": temp,
        "humidity": humidity,
        "speed": speed,
        "vibration": vibration
    })

    # Inject 5% synthetic anomalies (temperature spikes, humidity drops, severe drops)
    n_anomalies = int(n_samples * 0.05)
    anomaly_indices = np.random.choice(n_samples, size=n_anomalies, replace=False)
    
    df.loc[anomaly_indices, "temperature"] += np.random.uniform(5.0, 12.0, size=n_anomalies)
    df.loc[anomaly_indices, "humidity"] += np.random.uniform(25.0, 40.0, size=n_anomalies)
    df.loc[anomaly_indices, "vibration"] += np.random.uniform(1.5, 3.5, size=n_anomalies)

    return df

def train_and_save_model():
    print("Generating telemetry dataset...")
    df = generate_synthetic_telemetry()

    print("Fitting Isolation Forest model...")
    clf = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    clf.fit(df)

    scores = -clf.decision_function(df)
    # Normalize anomaly score to [0, 1]
    norm_scores = (scores - scores.min()) / (scores.max() - scores.min())
    df["anomaly_score"] = norm_scores
    df["is_anomaly"] = clf.predict(df[['temperature', 'humidity', 'speed', 'vibration']]) == -1

    print(f"Model trained. Detected {df['is_anomaly'].sum()} anomalous telemetry frames out of {len(df)}.")
    
    joblib.dump(clf, "isolation_forest_coldchain.joblib")
    print("Saved model to 'isolation_forest_coldchain.joblib'.")

if __name__ == "__main__":
    train_and_save_model()

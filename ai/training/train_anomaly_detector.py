import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score, precision_score, recall_score, f1_score


ANOMALY_FEATURES = [
    "temperature_c",
    "soil_moisture_pct",
    "humidity_pct",
    "rainfall_mm",
    "consecutive_dry_days",
    "canopy_green_index",
    "foliage_wilting_index",
    "loss_percentage"
]


def train():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "datasets", "synthetic_features.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Benchmark dataset not found at {data_path}")
        
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records for anomaly detector training.")
    
    X = df[ANOMALY_FEATURES]
    y_true = df["is_inconsistent_claim"]
    
    # Train Isolation Forest with expected contamination matching anomaly prevalence (~8-10%)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    iso_forest = IsolationForest(
        n_estimators=150,
        contamination=0.10,
        random_state=42,
        n_jobs=-1
    )
    
    print("Training Agronomic Isolation Forest for Inconsistency & Fraud Screening...")
    iso_forest.fit(X_scaled)
    
    # Isolation forest outputs -1 for anomaly, 1 for normal
    raw_preds = iso_forest.predict(X_scaled)
    # Convert to 1 for anomaly, 0 for normal
    y_pred_anomaly = np.where(raw_preds == -1, 1, 0)
    
    # Decision function: lower values mean more anomalous
    scores = -iso_forest.decision_function(X_scaled)
    # Min-max scale score to [0, 1]
    score_min = np.min(scores)
    score_max = np.max(scores)
    norm_scores = (scores - score_min) / (score_max - score_min + 1e-8)
    
    auc = roc_auc_score(y_true, norm_scores)
    prec = precision_score(y_true, y_pred_anomaly, zero_division=0)
    rec = recall_score(y_true, y_pred_anomaly, zero_division=0)
    f1 = f1_score(y_true, y_pred_anomaly, zero_division=0)
    
    print(f"Anomaly Detection ROC-AUC: {auc:.4f}")
    print(f"Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f}")
    
    # Package into bundle
    bundle = {
        "scaler": scaler,
        "model": iso_forest,
        "score_min": float(score_min),
        "score_max": float(score_max),
        "features": ANOMALY_FEATURES
    }
    
    out_path = os.path.join(models_dir, "anomaly_detector.joblib")
    joblib.dump(bundle, out_path)
    print(f"Saved anomaly detector bundle to {out_path}")
    
    return {
        "roc_auc": auc,
        "precision": prec,
        "recall": rec,
        "f1": f1
    }


if __name__ == "__main__":
    train()

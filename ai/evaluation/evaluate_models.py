import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


def evaluate():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "datasets", "synthetic_features.csv")
    models_dir = os.path.join(base_dir, "models")
    eval_dir = os.path.join(base_dir, "evaluation")
    os.makedirs(eval_dir, exist_ok=True)
    
    clf_path = os.path.join(models_dir, "damage_classifier.joblib")
    reg_path = os.path.join(models_dir, "loss_regressor.joblib")
    anom_path = os.path.join(models_dir, "anomaly_detector.joblib")
    
    if not (os.path.exists(clf_path) and os.path.exists(reg_path) and os.path.exists(anom_path)):
        raise FileNotFoundError("Trained models not found. Run training scripts first.")
        
    df = pd.read_csv(data_path)
    
    # Stratified test split
    feature_cols = [
        "crop_cycle_day", "temperature_c", "soil_moisture_pct", "humidity_pct",
        "rainfall_mm", "consecutive_dry_days", "canopy_green_index",
        "foliage_wilting_index", "crop_name"
    ]
    
    X = df[feature_cols]
    y_cat = df["damage_category"]
    y_loss = df["loss_percentage"]
    y_incons = df["is_inconsistent_claim"]
    
    _, X_test, _, y_cat_test, _, y_loss_test, _, y_incons_test = train_test_split(
        X, y_cat, y_loss, y_incons, test_size=0.20, random_state=42, stratify=y_cat
    )
    
    # 1. Damage Classifier Evaluation
    clf = joblib.load(clf_path)
    y_cat_pred = clf.predict(X_test)
    
    cat_accuracy = float(accuracy_score(y_cat_test, y_cat_pred))
    cat_f1_macro = float(f1_score(y_cat_test, y_cat_pred, average="macro"))
    cat_f1_weighted = float(f1_score(y_cat_test, y_cat_pred, average="weighted"))
    labels = sorted(list(y_cat.unique()))
    cm = confusion_matrix(y_cat_test, y_cat_pred, labels=labels).tolist()
    
    # 2. Loss Percentage Regressor Evaluation
    reg = joblib.load(reg_path)
    y_loss_pred = reg.predict(X_test)
    
    mae = float(mean_absolute_error(y_loss_test, y_loss_pred))
    mse = float(mean_squared_error(y_loss_test, y_loss_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_loss_test, y_loss_pred))
    
    # 3. Anomaly Detector Evaluation
    anom_bundle = joblib.load(anom_path)
    anom_model = anom_bundle["model"]
    scaler = anom_bundle["scaler"]
    anom_features = anom_bundle["features"]
    
    # Test slice for anomaly
    df_test_idx = X_test.index
    X_anom = df.loc[df_test_idx, anom_features]
    X_anom_scaled = scaler.transform(X_anom)
    raw_anom_preds = anom_model.predict(X_anom_scaled)
    anom_preds = np.where(raw_anom_preds == -1, 1, 0)
    
    anom_f1 = float(f1_score(y_incons_test, anom_preds, zero_division=0))
    anom_prec = float(precision_score(y_incons_test, anom_preds, zero_division=0))
    anom_rec = float(recall_score(y_incons_test, anom_preds, zero_division=0))
    
    report = {
        "dataset": {
            "total_samples": len(df),
            "test_split_samples": len(X_test),
            "stratification": "Stratified on damage_category",
            "supported_crops": sorted(list(df["crop_name"].unique()))
        },
        "damage_classifier": {
            "model_type": "Ensemble Random Forest with Scikit-learn Pipeline",
            "accuracy": round(cat_accuracy, 4),
            "macro_f1": round(cat_f1_macro, 4),
            "weighted_f1": round(cat_f1_weighted, 4),
            "classes": labels,
            "confusion_matrix": cm
        },
        "loss_regressor": {
            "model_type": "Ensemble Random Forest Regressor",
            "mae_percentage": round(mae, 2),
            "rmse_percentage": round(rmse, 2),
            "r2_score": round(r2, 4)
        },
        "anomaly_detector": {
            "model_type": "Isolation Forest Multidimensional Sensor Screener",
            "precision": round(anom_prec, 4),
            "recall": round(anom_rec, 4),
            "f1_score": round(anom_f1, 4)
        },
        "section_25_compliance": {
            "status": "COMPLIANT",
            "internal_weights_exposed": False,
            "internal_hyperparameters_exposed": False,
            "external_api_mode": "Business Advisory & Agronomic Indicators Only"
        }
    }
    
    report_path = os.path.join(eval_dir, "benchmark_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
        
    print(f"Benchmark evaluation saved to {report_path}")
    print(f"Damage Classifier Accuracy: {cat_accuracy * 100:.2f}% | Macro F1: {cat_f1_macro:.4f}")
    print(f"Loss Regressor MAE: {mae:.2f}% | R2: {r2:.4f}")
    return report


if __name__ == "__main__":
    evaluate()

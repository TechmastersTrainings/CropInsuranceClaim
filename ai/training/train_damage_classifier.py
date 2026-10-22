import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, f1_score, accuracy_score, mean_absolute_error, r2_score


FEATURE_NUMERICAL = [
    "crop_cycle_day",
    "temperature_c",
    "soil_moisture_pct",
    "humidity_pct",
    "rainfall_mm",
    "consecutive_dry_days",
    "canopy_green_index",
    "foliage_wilting_index"
]

FEATURE_CATEGORICAL = ["crop_name"]


def train():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "datasets", "synthetic_features.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Benchmark dataset not found at {data_path}")
        
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records from {data_path}")
    
    X = df[FEATURE_NUMERICAL + FEATURE_CATEGORICAL]
    y_cat = df["damage_category"]
    y_loss = df["loss_percentage"]
    
    # Train / test split (80/20) with stratification on category
    X_train, X_test, y_cat_train, y_cat_test, y_loss_train, y_loss_test = train_test_split(
        X, y_cat, y_loss, test_size=0.20, random_state=42, stratify=y_cat
    )
    
    # Preprocessor pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), FEATURE_NUMERICAL),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), FEATURE_CATEGORICAL)
        ]
    )
    
    # 1. Damage Classification Pipeline
    classifier_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("clf", RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1))
    ])
    
    print("Training Agronomic Damage Classifier...")
    classifier_pipe.fit(X_train, y_cat_train)
    y_cat_pred = classifier_pipe.predict(X_test)
    
    acc = accuracy_score(y_cat_test, y_cat_pred)
    f1_macro = f1_score(y_cat_test, y_cat_pred, average="macro")
    print(f"Classifier Accuracy: {acc * 100:.2f}% | Macro F1-Score: {f1_macro:.4f}")
    print("\nClassification Report:\n", classification_report(y_cat_test, y_cat_pred))
    
    # 2. Loss Percentage Regression Pipeline
    regressor_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("reg", RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1))
    ])
    
    print("Training Crop Loss Percentage Regressor...")
    regressor_pipe.fit(X_train, y_loss_train)
    y_loss_pred = regressor_pipe.predict(X_test)
    
    mae = mean_absolute_error(y_loss_test, y_loss_pred)
    r2 = r2_score(y_loss_test, y_loss_pred)
    print(f"Loss Regressor MAE: {mae:.2f}% | R2 Score: {r2:.4f}")
    
    # Save models
    clf_path = os.path.join(models_dir, "damage_classifier.joblib")
    reg_path = os.path.join(models_dir, "loss_regressor.joblib")
    
    joblib.dump(classifier_pipe, clf_path)
    joblib.dump(regressor_pipe, reg_path)
    print(f"Saved classifier model to {clf_path}")
    print(f"Saved loss regressor to {reg_path}")
    
    return {
        "accuracy": acc,
        "macro_f1": f1_macro,
        "mae": mae,
        "r2": r2
    }


if __name__ == "__main__":
    train()

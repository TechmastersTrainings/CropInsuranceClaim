import os
import pytest
from ai.inference.predictor import CropDamagePredictor


def test_models_exist():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, "models")
    assert os.path.exists(os.path.join(models_dir, "damage_classifier.joblib"))
    assert os.path.exists(os.path.join(models_dir, "loss_regressor.joblib"))
    assert os.path.exists(os.path.join(models_dir, "anomaly_detector.joblib"))


def test_all_supported_crops():
    crops = [
        "Cotton", "Paddy (Rice)", "Maize", "Soybean", "Wheat",
        "Pulses", "Sugarcane", "Vegetables", "Fruits"
    ]
    predictor = CropDamagePredictor()
    
    for crop in crops:
        res = predictor.assess_claim(
            crop_name=crop,
            crop_cycle_day=45,
            sensor_features={
                "temperature_c": 27.0,
                "soil_moisture_pct": 28.0,
                "humidity_pct": 65.0,
                "rainfall_mm": 15.0,
                "consecutive_dry_days": 1
            },
            canopy_features={
                "canopy_green_index": 0.75,
                "foliage_wilting_index": 0.10
            }
        )
        assert res["damage_category"] is not None
        assert 0.0 <= res["estimated_loss_percentage"] <= 100.0
        assert res["severity_level"] in ["Low", "Moderate", "High", "Critical"]

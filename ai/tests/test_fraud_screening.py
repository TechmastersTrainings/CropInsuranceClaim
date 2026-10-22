from ai.inference.predictor import CropDamagePredictor


def test_fraud_screening_contradiction():
    predictor = CropDamagePredictor()
    
    # Farmer claims flood, but weather station recorded zero rain and desiccated soil
    result = predictor.assess_claim(
        crop_name="Paddy (Rice)",
        crop_cycle_day=50,
        sensor_features={
            "temperature_c": 36.0,
            "soil_moisture_pct": 11.0,
            "humidity_pct": 32.0,
            "rainfall_mm": 0.0,
            "consecutive_dry_days": 20
        },
        claimed_cause="Flash Flood & Submersion",
        claimed_loss_percentage=85.0
    )
    
    assert result["anomaly_detected"] is True
    assert len(result["inconsistency_reasons"]) > 0
    assert "Discrepancy" in result["advisory_rationale"] or "contradicted" in str(result["inconsistency_reasons"]).lower()


def test_genuine_claim_consistency():
    predictor = CropDamagePredictor()
    
    # Genuine drought event matching physical sensor readings
    result = predictor.assess_claim(
        crop_name="Cotton",
        crop_cycle_day=80,
        sensor_features={
            "temperature_c": 38.0,
            "soil_moisture_pct": 10.0,
            "humidity_pct": 34.0,
            "rainfall_mm": 0.0,
            "consecutive_dry_days": 26
        },
        canopy_features={
            "canopy_green_index": 0.25,
            "foliage_wilting_index": 0.88
        },
        claimed_cause="Severe Drought Desiccation",
        claimed_loss_percentage=65.0
    )
    
    assert result["anomaly_detected"] is False
    assert result["weather_correlation_score"] >= 0.80
    assert result["estimated_loss_percentage"] >= 40.0

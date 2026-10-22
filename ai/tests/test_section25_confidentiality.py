from ai.inference.predictor import CropDamagePredictor


FORBIDDEN_IP_KEYS = [
    "weights",
    "internal_weights",
    "model_architecture",
    "prompt",
    "hyperparameters",
    "gradient",
    "layer_activations",
    "backpropagation",
    "tensor"
]


def test_section_25_inference_confidentiality():
    """Validates that inference output strictly obeys Section 25 IP confidentiality rules.
    
    No internal weights, proprietary architectures, or training parameters must be revealed.
    Only business advisory, agronomic indices, and correlation metrics may be returned.
    """
    predictor = CropDamagePredictor()
    result = predictor.assess_claim(
        crop_name="Cotton",
        crop_cycle_day=75,
        sensor_features={
            "temperature_c": 38.0,
            "soil_moisture_pct": 12.0,
            "humidity_pct": 35.0,
            "rainfall_mm": 0.0,
            "consecutive_dry_days": 24
        },
        canopy_features={
            "canopy_green_index": 0.28,
            "foliage_wilting_index": 0.85
        },
        claimed_cause="Severe Drought Desiccation"
    )
    
    # 1. Verify absence of forbidden IP keys
    for forbidden in FORBIDDEN_IP_KEYS:
        assert forbidden not in result, f"Section 25 Violation: '{forbidden}' found in AI inference output"
        for k, v in result.items():
            assert forbidden not in str(k).lower(), f"Section 25 Violation in key '{k}'"
            if isinstance(v, dict):
                for sub_k in v:
                    assert forbidden not in str(sub_k).lower(), f"Section 25 Violation in subkey '{sub_k}'"

    # 2. Verify presence of required public business and agronomic indicators
    assert "damage_category" in result
    assert "estimated_loss_percentage" in result
    assert "severity_level" in result
    assert "weather_correlation_score" in result
    assert "advisory_rationale" in result
    assert "anomaly_detected" in result
    
    # 3. Verify plausible values
    assert 0.0 <= result["estimated_loss_percentage"] <= 100.0
    assert 0.0 <= result["weather_correlation_score"] <= 1.0
    assert result["severity_level"] in ["Low", "Moderate", "High", "Critical"]

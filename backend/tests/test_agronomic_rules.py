import pytest
from backend.app.core.agronomic_rules import (
    AGRONOMIC_CROP_REGISTRY,
    get_crop_profile,
    evaluate_parametric_payout
)


def test_crop_registry_completeness():
    required_crops = [
        "Cotton", "Paddy (Rice)", "Maize", "Soybean", "Wheat",
        "Pulses", "Sugarcane", "Vegetables", "Fruits"
    ]
    for crop in required_crops:
        assert crop in AGRONOMIC_CROP_REGISTRY
        profile = AGRONOMIC_CROP_REGISTRY[crop]
        assert "scientific_name" in profile
        assert "stages" in profile
        assert len(profile["stages"]) >= 3
        assert "parametric_triggers" in profile
        assert profile["parametric_triggers"]["drought_min_soil_moisture_pct"] > 0
        assert profile["parametric_triggers"]["excess_rain_24h_mm"] > 0


def test_crop_profile_lookup():
    cotton = get_crop_profile("Cotton")
    assert cotton["scientific_name"] == "Gossypium hirsutum"

    paddy = get_crop_profile("Paddy (Rice)")
    assert paddy["scientific_name"] == "Oryza sativa"


def test_parametric_payout_deductible_deduction():
    # 65% loss on 100,000 sum insured with 10% deductible
    res = evaluate_parametric_payout(sum_insured=100000.0, loss_percentage=65.0, deductible_pct=10.0)
    assert res["loss_percentage"] == 65.0
    # Effective payout factor = (65 - 10) / 90 = 55 / 90 = 61.1%
    assert 60.0 <= res["payout_percentage"] <= 62.0
    assert 60000.0 <= res["payout_amount"] <= 62000.0


def test_parametric_payout_sub_deductible():
    # Loss below deductible -> 0 payout
    res = evaluate_parametric_payout(sum_insured=100000.0, loss_percentage=8.0, deductible_pct=10.0)
    assert res["payout_percentage"] == 0.0
    assert res["payout_amount"] == 0.0
    assert "below policy deductible" in res["status_note"]

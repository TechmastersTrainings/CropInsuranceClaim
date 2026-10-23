from typing import Dict, Any, Optional, List


AGRONOMIC_CROP_REGISTRY: Dict[str, Dict[str, Any]] = {
    "Cotton": {
        "scientific_name": "Gossypium hirsutum",
        "crop_category": "Fiber / Cash Crop",
        "standard_cycle_days": 160,
        "base_sum_insured_per_acre": 45000.0,
        "stages": [
            {"name": "Sowing & Germination", "day_start": 0, "day_end": 20, "vulnerability": 0.4},
            {"name": "Vegetative Growth", "day_start": 21, "day_end": 50, "vulnerability": 0.6},
            {"name": "Squaring & Flowering", "day_start": 51, "day_end": 90, "vulnerability": 1.0},
            {"name": "Boll Formation & Maturation", "day_start": 91, "day_end": 135, "vulnerability": 0.9},
            {"name": "Harvest & Picking", "day_start": 136, "day_end": 160, "vulnerability": 0.7}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 14.0,
            "drought_max_dry_days": 18,
            "excess_rain_24h_mm": 120.0,
            "heatwave_continuous_temp_c": 40.0
        }
    },
    "Paddy (Rice)": {
        "scientific_name": "Oryza sativa",
        "crop_category": "Cereal / Staple Grain",
        "standard_cycle_days": 130,
        "base_sum_insured_per_acre": 40000.0,
        "stages": [
            {"name": "Nursery & Transplanting", "day_start": 0, "day_end": 25, "vulnerability": 0.5},
            {"name": "Tillering", "day_start": 26, "day_end": 55, "vulnerability": 0.7},
            {"name": "Panicle Initiation & Flowering", "day_start": 56, "day_end": 85, "vulnerability": 1.0},
            {"name": "Grain Filling & Milk Stage", "day_start": 86, "day_end": 110, "vulnerability": 0.85},
            {"name": "Maturity & Ripening", "day_start": 111, "day_end": 130, "vulnerability": 0.5}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 20.0,
            "drought_max_dry_days": 12,
            "excess_rain_24h_mm": 180.0,
            "heatwave_continuous_temp_c": 38.0
        }
    },
    "Maize": {
        "scientific_name": "Zea mays",
        "crop_category": "Coarse Cereal / Fodder",
        "standard_cycle_days": 110,
        "base_sum_insured_per_acre": 32000.0,
        "stages": [
            {"name": "Germination & Emergence", "day_start": 0, "day_end": 15, "vulnerability": 0.4},
            {"name": "Knee-High Vegetative", "day_start": 16, "day_end": 45, "vulnerability": 0.7},
            {"name": "Tasseling & Silking", "day_start": 46, "day_end": 75, "vulnerability": 1.0},
            {"name": "Dough & Denting", "day_start": 76, "day_end": 95, "vulnerability": 0.75},
            {"name": "Physiological Maturity", "day_start": 96, "day_end": 110, "vulnerability": 0.3}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 16.0,
            "drought_max_dry_days": 15,
            "excess_rain_24h_mm": 110.0,
            "heatwave_continuous_temp_c": 39.0
        }
    },
    "Soybean": {
        "scientific_name": "Glycine max",
        "crop_category": "Oilseed / Legume",
        "standard_cycle_days": 105,
        "base_sum_insured_per_acre": 35000.0,
        "stages": [
            {"name": "Emergence & Unifoliate", "day_start": 0, "day_end": 15, "vulnerability": 0.4},
            {"name": "Trifoliate Vegetative", "day_start": 16, "day_end": 40, "vulnerability": 0.6},
            {"name": "Flowering & Pod Initiation", "day_start": 41, "day_end": 70, "vulnerability": 1.0},
            {"name": "Pod Filling & Seed Enlargement", "day_start": 71, "day_end": 90, "vulnerability": 0.85},
            {"name": "Maturity & Leaf Senescence", "day_start": 91, "day_end": 105, "vulnerability": 0.4}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 15.0,
            "drought_max_dry_days": 14,
            "excess_rain_24h_mm": 100.0,
            "heatwave_continuous_temp_c": 38.5
        }
    },
    "Wheat": {
        "scientific_name": "Triticum aestivum",
        "crop_category": "Rabi Cereal",
        "standard_cycle_days": 125,
        "base_sum_insured_per_acre": 38000.0,
        "stages": [
            {"name": "Crown Root Initiation (CRI)", "day_start": 0, "day_end": 25, "vulnerability": 0.8},
            {"name": "Jointing & Stem Extension", "day_start": 26, "day_end": 55, "vulnerability": 0.6},
            {"name": "Heading & Anthesis (Flowering)", "day_start": 56, "day_end": 80, "vulnerability": 1.0},
            {"name": "Grain Milking & Dough", "day_start": 81, "day_end": 105, "vulnerability": 0.8},
            {"name": "Ripening & Harvesting", "day_start": 106, "day_end": 125, "vulnerability": 0.3}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 16.0,
            "drought_max_dry_days": 20,
            "excess_rain_24h_mm": 80.0,
            "heatwave_continuous_temp_c": 34.0  # Terminal heat sensitivity
        }
    },
    "Pulses": {
        "scientific_name": "Cajanus cajan / Cicer arietinum",
        "crop_category": "Legume / Protein",
        "standard_cycle_days": 120,
        "base_sum_insured_per_acre": 28000.0,
        "stages": [
            {"name": "Seedling & Vegetative", "day_start": 0, "day_end": 35, "vulnerability": 0.5},
            {"name": "Branching & Budding", "day_start": 36, "day_end": 60, "vulnerability": 0.7},
            {"name": "Flowering & Pod Setting", "day_start": 61, "day_end": 90, "vulnerability": 1.0},
            {"name": "Pod Development", "day_start": 91, "day_end": 110, "vulnerability": 0.8},
            {"name": "Harvesting", "day_start": 111, "day_end": 120, "vulnerability": 0.4}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 12.0,
            "drought_max_dry_days": 22,
            "excess_rain_24h_mm": 75.0,  # Highly prone to root rot in waterlogging
            "heatwave_continuous_temp_c": 39.0
        }
    },
    "Sugarcane": {
        "scientific_name": "Saccharum officinarum",
        "crop_category": "Perennial / Commercial",
        "standard_cycle_days": 360,
        "base_sum_insured_per_acre": 75000.0,
        "stages": [
            {"name": "Germination", "day_start": 0, "day_end": 45, "vulnerability": 0.5},
            {"name": "Tillering & Formative", "day_start": 46, "day_end": 120, "vulnerability": 0.7},
            {"name": "Grand Growth & Elongation", "day_start": 121, "day_end": 270, "vulnerability": 0.9},
            {"name": "Ripening & Sucrose Accumulation", "day_start": 271, "day_end": 360, "vulnerability": 0.6}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 18.0,
            "drought_max_dry_days": 25,
            "excess_rain_24h_mm": 250.0,
            "heatwave_continuous_temp_c": 44.0
        }
    },
    "Vegetables": {
        "scientific_name": "Solanum lycopersicum et al.",
        "crop_category": "Horticultural / Perishable",
        "standard_cycle_days": 90,
        "base_sum_insured_per_acre": 55000.0,
        "stages": [
            {"name": "Transplanting", "day_start": 0, "day_end": 15, "vulnerability": 0.6},
            {"name": "Vegetative & Foliage Growth", "day_start": 16, "day_end": 40, "vulnerability": 0.8},
            {"name": "Flowering & Fruit Setting", "day_start": 41, "day_end": 65, "vulnerability": 1.0},
            {"name": "Fruit Ripening & Multiple Pickings", "day_start": 66, "day_end": 90, "vulnerability": 0.9}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 22.0,
            "drought_max_dry_days": 8,
            "excess_rain_24h_mm": 90.0,
            "heatwave_continuous_temp_c": 37.0
        }
    },
    "Fruits": {
        "scientific_name": "Mangifera indica / Punica granatum",
        "crop_category": "Orchard / Perennial",
        "standard_cycle_days": 240,
        "base_sum_insured_per_acre": 90000.0,
        "stages": [
            {"name": "Dormancy & Flush", "day_start": 0, "day_end": 40, "vulnerability": 0.3},
            {"name": "Blossoming & Pollination", "day_start": 41, "day_end": 80, "vulnerability": 1.0},
            {"name": "Fruit Set & Marble Stage", "day_start": 81, "day_end": 140, "vulnerability": 0.9},
            {"name": "Fruit Enlargement", "day_start": 141, "day_end": 200, "vulnerability": 0.7},
            {"name": "Maturity & Harvest", "day_start": 201, "day_end": 240, "vulnerability": 0.5}
        ],
        "parametric_triggers": {
            "drought_min_soil_moisture_pct": 18.0,
            "drought_max_dry_days": 20,
            "excess_rain_24h_mm": 130.0,
            "heatwave_continuous_temp_c": 42.0
        }
    }
}


def get_crop_profile(crop_name: str) -> Dict[str, Any]:
    """Retrieves agronomic profile by crop name with fallback."""
    for key, profile in AGRONOMIC_CROP_REGISTRY.items():
        if key.lower() in crop_name.lower() or crop_name.lower() in key.lower():
            return profile
    return AGRONOMIC_CROP_REGISTRY["Cotton"]


def evaluate_parametric_payout(
    sum_insured: float,
    loss_percentage: float,
    deductible_pct: float = 10.0
) -> Dict[str, Any]:
    """Computes legal parametric payout entitlement in accordance with PMFBY standards.
    
    Formula:
    Payout = Sum_Insured * min(1.0, max(0.0, (Loss% - Deductible%) / (100% - Deductible%)))
    """
    if loss_percentage <= deductible_pct:
        payout_pct = 0.0
        payout_amount = 0.0
        status_note = f"Observed loss ({loss_percentage}%) below policy deductible threshold ({deductible_pct}%)."
    else:
        effective_factor = (loss_percentage - deductible_pct) / (100.0 - deductible_pct)
        payout_pct = min(100.0, max(0.0, round(effective_factor * 100.0, 1)))
        payout_amount = round(sum_insured * (payout_pct / 100.0), 2)
        status_note = f"Parametric claim entitled to {payout_pct}% payout (₹{payout_amount:,.2f}) after {deductible_pct}% deductible deduction."

    return {
        "sum_insured": sum_insured,
        "loss_percentage": loss_percentage,
        "deductible_pct": deductible_pct,
        "payout_percentage": payout_pct,
        "payout_amount": payout_amount,
        "status_note": status_note
    }

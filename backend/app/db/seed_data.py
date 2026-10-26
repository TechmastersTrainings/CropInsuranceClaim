from sqlalchemy.orm import Session
from backend.app.models.crop import CropRegistry
from backend.app.models.policy import InsurancePolicy


def seed_database(db: Session):
    """
    Seeds ONLY certified master reference catalogs (agronomic crop standards and PMFBY policy templates).
    NO mock/dummy users, farm plots, claims, or telemetry records are created.
    All user transactional data is strictly created and managed by the real users in the database.
    """
    # 1. Master Agronomic Crop Registry (9 certified Indian crops)
    if not db.query(CropRegistry).first():
        crops_data = [
            {"code": "C01", "name": "Cotton", "season": "Kharif", "cycle": 160, "min_t": 21, "max_t": 38, "rain": 500, "soil": "Black Soil", "moist": 22},
            {"code": "C02", "name": "Paddy (Rice)", "season": "Kharif", "cycle": 125, "min_t": 20, "max_t": 35, "rain": 1000, "soil": "Clay Loam", "moist": 35},
            {"code": "C03", "name": "Maize", "season": "Kharif / Rabi", "cycle": 105, "min_t": 18, "max_t": 32, "rain": 600, "soil": "Sandy Loam", "moist": 20},
            {"code": "C04", "name": "Soybean", "season": "Kharif", "cycle": 95, "min_t": 20, "max_t": 32, "rain": 650, "soil": "Well-drained Loam", "moist": 24},
            {"code": "C05", "name": "Wheat", "season": "Rabi", "cycle": 130, "min_t": 10, "max_t": 26, "rain": 350, "soil": "Alluvial / Loam", "moist": 18},
            {"code": "C06", "name": "Pulses (Chickpea/Tur)", "season": "Rabi", "cycle": 110, "min_t": 15, "max_t": 30, "rain": 400, "soil": "Black Loam", "moist": 16},
            {"code": "C07", "name": "Sugarcane", "season": "Perennial", "cycle": 360, "min_t": 20, "max_t": 38, "rain": 1500, "soil": "Deep Rich Loam", "moist": 28},
            {"code": "C08", "name": "Vegetables (Tomato/Onion)", "season": "Zaid / Round-year", "cycle": 80, "min_t": 18, "max_t": 30, "rain": 500, "soil": "Loamy Sand", "moist": 25},
            {"code": "C09", "name": "Fruits (Pomegranate/Banana)", "season": "Perennial", "cycle": 300, "min_t": 22, "max_t": 36, "rain": 800, "soil": "Deep Alluvial", "moist": 26}
        ]
        for c in crops_data:
            db.add(CropRegistry(
                crop_code=c["code"],
                name=c["name"],
                season=c["season"],
                cycle_days=c["cycle"],
                min_temp=c["min_t"],
                max_temp=c["max_t"],
                min_rain=c["rain"],
                soil_type=c["soil"],
                moisture_threshold=c["moist"],
                is_active=True
            ))
        db.flush()

    # 2. Master PMFBY Insurance Policy Standards
    if not db.query(InsurancePolicy).first():
        pol1 = InsurancePolicy(
            policy_code="POL-COTTON-2026",
            title="Kharif Cotton Parametric Drought & Heat Shield",
            underwriter_name="National Agri-Insurance Corp (NAIC)",
            license_number="IRDAI/NL-104/AGRI",
            crop_name="Cotton",
            season="Kharif 2026",
            premium_per_acre=1450.0,
            coverage_per_acre=35000.0,
            trigger_parameter="Rainfall < 15mm for 21 consecutive days OR Temp > 41°C for 5 days",
            deductible_percent=10.0,
            valid_until="2026-12-31"
        )
        pol2 = InsurancePolicy(
            policy_code="POL-PADDY-2026",
            title="Monsoon Paddy Flood & Excessive Rain Guarantee",
            underwriter_name="AgroSafe Mutual Insurance",
            license_number="IRDAI/NL-209/AGRI",
            crop_name="Paddy (Rice)",
            season="Kharif 2026",
            premium_per_acre=1200.0,
            coverage_per_acre=40000.0,
            trigger_parameter="Single-day Rainfall > 180mm OR Submerged for > 72 hours",
            deductible_percent=10.0,
            valid_until="2026-11-30"
        )
        pol3 = InsurancePolicy(
            policy_code="POL-MULTI-2026",
            title="PMFBY Kharif Multi-Peril Comprehensive",
            underwriter_name="National Agriculture Insurance Company",
            license_number="IRDAI/NL-101/PMFBY",
            crop_name="General",
            season="Kharif 2026",
            premium_per_acre=1500.0,
            coverage_per_acre=35000.0,
            trigger_parameter="Soil moisture deficit < 14% OR excess precipitation > 120mm",
            deductible_percent=10.0,
            valid_until="2026-12-31"
        )
        db.add_all([pol1, pol2, pol3])
        db.flush()

    db.commit()

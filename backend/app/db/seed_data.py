from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.app.core.security import get_password_hash
from backend.app.models.user import User, UserRole
from backend.app.models.crop import CropRegistry
from backend.app.models.farm import FarmPlot
from backend.app.models.policy import InsurancePolicy, PolicyEnrollment
from backend.app.models.claim import Claim, ClaimStatus, ClaimStateTransition
from backend.app.models.telemetry import SensorDevice, SensorReading
from backend.app.models.audit import AuditLog, Notification, BlockchainBlockRecord


def seed_database(db: Session):
    """Safely seeds initial demonstration records if database is empty."""
    if db.query(User).first():
        return  # Already seeded
        
    # 1. Users
    farmer = User(
        email="patil.farmer@agrishield.org",
        full_name="Basavaraj Patil",
        hashed_password=get_password_hash("farmer123"),
        role=UserRole.FARMER,
        phone="+91 98450 12345",
        aadhaar_masked="XXXX-XXXX-4819",
        district="Dharwad",
        state="Karnataka"
    )
    insurer = User(
        email="rajesh.kumar@naic.in",
        full_name="Rajesh Kumar (NAIC Underwriter)",
        hashed_password=get_password_hash("insurer123"),
        role=UserRole.INSURER,
        phone="+91 94480 23456",
        district="Bengaluru Zonal HQ",
        state="Karnataka"
    )
    admin = User(
        email="admin.sunita@agrishield.org",
        full_name="Dr. Sunita Rao (System Admin)",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN,
        phone="+91 98800 34567",
        district="Central Directorate",
        state="New Delhi"
    )
    auditor = User(
        email="v.sharma@agri.gov.in",
        full_name="V. Sharma (Govt Auditor)",
        hashed_password=get_password_hash("auditor123"),
        role=UserRole.AUDITOR,
        phone="+91 94490 45678",
        district="Audit Cell",
        state="National Oversight"
    )
    db.add_all([farmer, insurer, admin, auditor])
    db.flush()

    # 2. Multi-Crop Registry (Section 5)
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

    # 3. Farm Plots
    plot1 = FarmPlot(
        farmer_id=farmer.id,
        name="Green Valley North Plot",
        survey_number="SY-442/1B",
        area_acres=4.5,
        village="Navalgund",
        taluk="Navalgund",
        district="Dharwad",
        state="Karnataka",
        latitude=15.3647,
        longitude=75.1240,
        soil_type="Black Cotton Soil",
        irrigation_type="Borewell + Drip Irrigation",
        active_crop_name="Cotton"
    )
    plot2 = FarmPlot(
        farmer_id=farmer.id,
        name="Cauvery Basin South Plot",
        survey_number="SY-108/4A",
        area_acres=3.2,
        village="Srirangapatna",
        taluk="Srirangapatna",
        district="Mandya",
        state="Karnataka",
        latitude=12.3118,
        longitude=76.6529,
        soil_type="Clay Loam",
        irrigation_type="Canal Fed",
        active_crop_name="Paddy (Rice)"
    )
    db.add_all([plot1, plot2])
    db.flush()

    # 4. Policies
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
        deductible_percent=5.0,
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
        deductible_percent=0.0,
        valid_until="2026-11-30"
    )
    db.add_all([pol1, pol2])
    db.flush()

    # 5. Enrollments
    db.add(PolicyEnrollment(
        farmer_id=farmer.id,
        farm_plot_id=plot1.id,
        policy_id=pol1.id,
        premium_paid=6525.0,
        coverage_amount=157500.0,
        blockchain_tx_hash="0x7f9a882c31e9014b2d398f6190a618e3881471329a174092bbf8924083aef110",
        status="ACTIVE"
    ))
    db.flush()

    # 6. Sample Claims
    clm1 = Claim(
        claim_number="CLM-2026-881",
        farmer_id=farmer.id,
        farm_plot_id=plot1.id,
        policy_id=pol1.id,
        claimed_amount=140000.0,
        approved_amount=140000.0,
        damage_reason="Severe Prolonged Dry Spell & Thermal Desiccation",
        damage_event_date="2026-09-18",
        status=ClaimStatus.APPROVED,
        blockchain_tx_hash="0x7f9a882c31e9014b2d398f6190a618e3881471329a174092bbf8924083aef110",
        ai_condition_indicator="Severe Vegetative Stress (Foliage Wilting)",
        ai_loss_percentage=68.5,
        weather_correlation_score=0.94,
        officer_remarks="Verified via IMD rainfall data and ground sensor probe ESP-001. Payout authorized."
    )
    clm2 = Claim(
        claim_number="CLM-2026-882",
        farmer_id=farmer.id,
        farm_plot_id=plot2.id,
        policy_id=pol2.id,
        claimed_amount=110000.0,
        approved_amount=0.0,
        damage_reason="Flash Flood Waterlogging after Cloudburst",
        damage_event_date="2026-10-02",
        status=ClaimStatus.UNDER_REVIEW,
        blockchain_tx_hash="0x3b1154c9a87d00f912e61a4982701bf4984210d7a6e19034bc4051a8823f0019",
        ai_condition_indicator="Submersion Canopy Discoloration",
        ai_loss_percentage=42.0,
        weather_correlation_score=0.88,
        officer_remarks="Rainfall station recorded 162mm; farm node offline. Physical verification scheduled."
    )
    db.add_all([clm1, clm2])
    db.flush()

    # 7. Devices & Telemetry
    dev1 = SensorDevice(
        device_identifier="ESP-DEV-001",
        farm_plot_id=plot1.id,
        device_type="ESP32 Solar Multi-Probe",
        battery_level="94%",
        signal_strength="Strong (4G)",
        status="Online"
    )
    dev2 = SensorDevice(
        device_identifier="ESP-DEV-002",
        farm_plot_id=plot2.id,
        device_type="Soil & Rain Node",
        battery_level="81%",
        signal_strength="Moderate (WiFi)",
        status="Online"
    )
    db.add_all([dev1, dev2])
    db.flush()

    # 8. Blockchain Blocks
    b1 = BlockchainBlockRecord(
        block_number=10428,
        tx_hash="0x7f9a882c31e9014b2d398f6190a618e3881471329a174092bbf8924083aef110",
        channel_name="cropinsurancechannel",
        event_name="CLAIM_APPROVED",
        claim_number="CLM-2026-881",
        endorser_msp="Org1MSP, Org2MSP",
        status="VALID",
        timestamp="2026-09-23 14:05:22 UTC"
    )
    b2 = BlockchainBlockRecord(
        block_number=10427,
        tx_hash="0x3b1154c9a87d00f912e61a4982701bf4984210d7a6e19034bc4051a8823f0019",
        channel_name="cropinsurancechannel",
        event_name="CLAIM_SUBMITTED",
        claim_number="CLM-2026-882",
        endorser_msp="Org1MSP",
        status="VALID",
        timestamp="2026-10-04 09:30:45 UTC"
    )
    db.add_all([b1, b2])

    # 9. Audit Logs
    audit1 = AuditLog(
        actor_email="officer_rajesh@naic.in",
        actor_role="INSURER",
        action="Approved Claim Settlement",
        target_entity="CLM-2026-881",
        ip_address="103.21.144.12"
    )
    db.add(audit1)

    db.commit()

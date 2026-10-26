import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.db.base import Base
from backend.app.db.session import get_db
from backend.app.main import app
from backend.app.core.security import get_password_hash, create_access_token
from backend.app.models.user import User, UserRole
from backend.app.db.seed_data import seed_database

# Use a test SQLite database
TEST_DB_PATH = "./backend/test_app.db"
if os.path.exists(TEST_DB_PATH):
    try:
        os.remove(TEST_DB_PATH)
    except Exception:
        pass

engine_test = create_engine(
    f"sqlite:///{TEST_DB_PATH}",
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


from backend.app.models.crop import CropRegistry
from backend.app.models.farm import FarmPlot
from backend.app.models.policy import InsurancePolicy, PolicyEnrollment
from backend.app.models.claim import Claim, ClaimStatus
from backend.app.models.telemetry import SensorDevice, SensorReading
from backend.app.models.audit import AuditLog, BlockchainBlockRecord


def seed_test_fixtures(db):
    """Seeds test fixtures specifically into the isolated test database."""
    if db.query(User).filter(User.email == "patil.farmer@agrishield.org").first():
        return
    # Master crops & policies
    seed_database(db)

    # Test Users
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

    # Test Farm Plots
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

    pol1 = db.query(InsurancePolicy).first()

    # Test Claims
    clm1 = Claim(
        claim_number="CLM-2026-881",
        farmer_id=farmer.id,
        farm_plot_id=plot1.id,
        policy_id=pol1.id if pol1 else 1,
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
        policy_id=pol1.id if pol1 else 1,
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

    # Test Devices
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

    # Test Blocks
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

    # Test Audit
    audit1 = AuditLog(
        actor_email="officer_rajesh@naic.in",
        actor_role="INSURER",
        action="Approved Claim Settlement",
        target_entity="CLM-2026-881",
        ip_address="103.21.144.12"
    )
    db.add(audit1)
    db.commit()


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine_test)
    db = TestingSessionLocal()
    seed_test_fixtures(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine_test)
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except Exception:
            pass


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def farmer_token(db_session):
    farmer = db_session.query(User).filter(User.role == UserRole.FARMER).first()
    return create_access_token(subject=farmer.id, role=farmer.role.value)


@pytest.fixture
def insurer_token(db_session):
    insurer = db_session.query(User).filter(User.role == UserRole.INSURER).first()
    return create_access_token(subject=insurer.id, role=insurer.role.value)


@pytest.fixture
def admin_token(db_session):
    admin = db_session.query(User).filter(User.role == UserRole.ADMIN).first()
    return create_access_token(subject=admin.id, role=admin.role.value)


@pytest.fixture
def auditor_token(db_session):
    auditor = db_session.query(User).filter(User.role == UserRole.AUDITOR).first()
    return create_access_token(subject=auditor.id, role=auditor.role.value)

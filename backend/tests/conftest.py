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


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine_test)
    db = TestingSessionLocal()
    seed_database(db)
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

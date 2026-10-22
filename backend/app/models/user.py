from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from backend.app.db.base import Base


class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    INSURER = "INSURER"
    ADMIN = "ADMIN"
    AUDITOR = "AUDITOR"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.FARMER, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    aadhaar_masked = Column(String(20), nullable=True)
    district = Column(String(100), default="Dharwad")
    state = Column(String(100), default="Karnataka")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    farms = relationship("FarmPlot", back_populates="farmer", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="farmer")
    enrollments = relationship("PolicyEnrollment", back_populates="farmer")

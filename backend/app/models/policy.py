from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.base import Base


class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_code = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    underwriter_name = Column(String(200), nullable=False)
    license_number = Column(String(100), nullable=False)
    crop_name = Column(String(100), nullable=False, index=True)
    season = Column(String(100), nullable=False)
    premium_per_acre = Column(Float, nullable=False)
    coverage_per_acre = Column(Float, nullable=False)
    trigger_parameter = Column(Text, nullable=False)
    deductible_percent = Column(Float, default=5.0)
    is_active = Column(Boolean, default=True)
    valid_until = Column(String(50), default="2026-12-31")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    claims = relationship("Claim", back_populates="policy")
    enrollments = relationship("PolicyEnrollment", back_populates="policy")


class PolicyEnrollment(Base):
    __tablename__ = "policy_enrollments"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    farm_plot_id = Column(Integer, ForeignKey("farm_plots.id"), nullable=False, index=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False, index=True)
    premium_paid = Column(Float, nullable=False)
    coverage_amount = Column(Float, nullable=False)
    blockchain_tx_hash = Column(String(255), nullable=True)
    status = Column(String(50), default="ACTIVE")
    enrolled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    farmer = relationship("User", back_populates="enrollments")
    farm_plot = relationship("FarmPlot", back_populates="enrollments")
    policy = relationship("InsurancePolicy", back_populates="enrollments")

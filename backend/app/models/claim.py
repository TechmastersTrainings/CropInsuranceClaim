from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from backend.app.db.base import Base


class ClaimStatus(str, enum.Enum):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    EVIDENCE_VALIDATION = "Evidence Validation"
    ASSESSMENT_PENDING = "Assessment Pending"
    UNDER_REVIEW = "Under Review"
    ADDITIONAL_EVIDENCE_REQUESTED = "Additional Evidence Requested"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    SETTLEMENT_PENDING = "Settlement Pending"
    SETTLED = "Settled"
    CLOSED = "Closed"


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String(100), unique=True, index=True, nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    farm_plot_id = Column(Integer, ForeignKey("farm_plots.id"), nullable=False, index=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False, index=True)
    
    claimed_amount = Column(Float, nullable=False)
    approved_amount = Column(Float, default=0.0)
    damage_reason = Column(Text, nullable=False)
    damage_event_date = Column(String(50), nullable=False)
    status = Column(Enum(ClaimStatus), default=ClaimStatus.SUBMITTED, nullable=False, index=True)
    
    # Blockchain Reference
    blockchain_tx_hash = Column(String(255), nullable=True, index=True)
    
    # AI Assessment Indicators (Section 25 Compliant: Business-level outcomes only)
    ai_condition_indicator = Column(String(255), default="Queued for automated assessment")
    ai_loss_percentage = Column(Float, default=0.0)
    weather_correlation_score = Column(Float, default=0.0)
    officer_remarks = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    farmer = relationship("User", back_populates="claims")
    farm_plot = relationship("FarmPlot", back_populates="claims")
    policy = relationship("InsurancePolicy", back_populates="claims")
    evidence_items = relationship("ClaimEvidence", back_populates="claim", cascade="all, delete-orphan")
    transitions = relationship("ClaimStateTransition", back_populates="claim", cascade="all, delete-orphan")


class ClaimEvidence(Base):
    __tablename__ = "claim_evidence"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    evidence_type = Column(String(100), default="Geotagged Photo")
    gps_coordinates = Column(String(100), nullable=True)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    claim = relationship("Claim", back_populates="evidence_items")


class ClaimStateTransition(Base):
    __tablename__ = "claim_state_transitions"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    from_state = Column(String(50), nullable=False)
    to_state = Column(String(50), nullable=False)
    actor_name = Column(String(150), nullable=False)
    actor_role = Column(String(50), nullable=False)
    remarks = Column(Text, nullable=True)
    blockchain_block = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    claim = relationship("Claim", back_populates="transitions")

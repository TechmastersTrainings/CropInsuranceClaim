from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from backend.app.models.claim import ClaimStatus


class ClaimCreate(BaseModel):
    farm_plot_id: int
    policy_id: int
    claimed_amount: float
    damage_reason: str
    damage_event_date: str


class ClaimTransitionRequest(BaseModel):
    new_status: ClaimStatus
    remarks: Optional[str] = "Status transition processed by authorized actor."


class EvidenceResponse(BaseModel):
    id: int
    filename: str
    sha256_hash: str
    evidence_type: str
    gps_coordinates: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


class TransitionResponse(BaseModel):
    id: int
    from_state: str
    to_state: str
    actor_name: str
    actor_role: str
    remarks: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ClaimResponse(BaseModel):
    id: int
    claim_number: str
    farmer_id: int
    farm_plot_id: int
    policy_id: int
    claimed_amount: float
    approved_amount: float
    damage_reason: str
    damage_event_date: str
    status: ClaimStatus
    blockchain_tx_hash: Optional[str] = None
    ai_condition_indicator: Optional[str] = None
    ai_loss_percentage: Optional[float] = None
    weather_correlation_score: Optional[float] = None
    officer_remarks: Optional[str] = None
    created_at: datetime
    evidence_items: List[EvidenceResponse] = []
    transitions: List[TransitionResponse] = []

    class Config:
        from_attributes = True

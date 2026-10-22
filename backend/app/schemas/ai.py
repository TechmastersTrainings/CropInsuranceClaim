from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class AIAssessClaimRequest(BaseModel):
    claimed_cause: Optional[str] = None
    crop_cycle_day: Optional[int] = 60
    canopy_green_index: Optional[float] = None
    foliage_wilting_index: Optional[float] = None


class AIAssessmentResponse(BaseModel):
    claim_id: int
    claim_number: str
    crop_name: str
    damage_category: str
    severity_level: str
    estimated_loss_percentage: float
    recommended_payout_percentage: float
    confidence_score: float
    weather_correlation_score: float
    anomaly_detected: bool
    anomaly_score: float
    inconsistency_reasons: List[str] = []
    advisory_rationale: str
    canopy_indicators: Dict[str, float]
    environmental_telemetry_summary: Dict[str, float]

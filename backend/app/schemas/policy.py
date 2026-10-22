from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class PolicyCreate(BaseModel):
    policy_code: str
    title: str
    underwriter_name: str
    license_number: str
    crop_name: str
    season: str
    premium_per_acre: float
    coverage_per_acre: float
    trigger_parameter: str
    deductible_percent: float = 5.0
    valid_until: Optional[str] = "2026-12-31"


class PolicyResponse(PolicyCreate):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class EnrollmentCreate(BaseModel):
    farm_plot_id: int
    policy_id: int


class EnrollmentResponse(BaseModel):
    id: int
    farmer_id: int
    farm_plot_id: int
    policy_id: int
    premium_paid: float
    coverage_amount: float
    blockchain_tx_hash: Optional[str] = None
    status: str
    enrolled_at: datetime

    class Config:
        from_attributes = True

import secrets
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.user import User, UserRole
from backend.app.models.farm import FarmPlot
from backend.app.models.policy import InsurancePolicy, PolicyEnrollment
from backend.app.schemas.policy import PolicyResponse, EnrollmentCreate, EnrollmentResponse
from backend.app.api.deps import get_current_user

router = APIRouter(tags=["Insurance Policies"])


@router.get("/policies", response_model=List[PolicyResponse])
def get_policies(db: Session = Depends(get_db)):
    """Retrieves all active parametric insurance policy templates."""
    return db.query(InsurancePolicy).filter(InsurancePolicy.is_active == True).order_by(InsurancePolicy.id.desc()).all()


@router.get("/policies/{policy_id}", response_model=PolicyResponse)
def get_policy(policy_id: int, db: Session = Depends(get_db)):
    """Retrieves specific parametric policy terms and trigger parameters."""
    policy = db.query(InsurancePolicy).filter(InsurancePolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return policy


@router.post("/enrollments", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
def enroll_policy(
    enroll_in: EnrollmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enrolls an eligible farm plot in a parametric insurance policy."""
    farm = db.query(FarmPlot).filter(FarmPlot.id == enroll_in.farm_plot_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm plot not found")
    if current_user.role == UserRole.FARMER and farm.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot enroll plot belonging to another farmer")
        
    policy = db.query(InsurancePolicy).filter(InsurancePolicy.id == enroll_in.policy_id).first()
    if not policy or not policy.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected policy is inactive or unavailable")
        
    premium = farm.area_acres * policy.premium_per_acre
    coverage = farm.area_acres * policy.coverage_per_acre
    tx_hash = f"0x{secrets.token_hex(32)}"
    
    enrollment = PolicyEnrollment(
        farmer_id=current_user.id,
        farm_plot_id=farm.id,
        policy_id=policy.id,
        premium_paid=premium,
        coverage_amount=coverage,
        blockchain_tx_hash=tx_hash,
        status="ACTIVE"
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/enrollments", response_model=List[EnrollmentResponse])
def get_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves enrolled farm policies for the current user or institutional reviewer."""
    if current_user.role in [UserRole.INSURER, UserRole.ADMIN, UserRole.AUDITOR]:
        return db.query(PolicyEnrollment).order_by(PolicyEnrollment.id.desc()).all()
    return db.query(PolicyEnrollment).filter(PolicyEnrollment.farmer_id == current_user.id).order_by(PolicyEnrollment.id.desc()).all()

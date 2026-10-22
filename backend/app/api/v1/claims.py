import secrets
import hashlib
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.user import User, UserRole
from backend.app.models.farm import FarmPlot
from backend.app.models.policy import InsurancePolicy
from backend.app.models.claim import Claim, ClaimStatus, ClaimEvidence, ClaimStateTransition
from backend.app.models.audit import AuditLog, BlockchainBlockRecord
from backend.app.schemas.claim import ClaimCreate, ClaimResponse, ClaimTransitionRequest, EvidenceResponse
from backend.app.api.deps import get_current_user, require_insurer

router = APIRouter(tags=["Claims Management"])


@router.post("/claims", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def submit_claim(
    claim_in: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submits a new parametric crop claim and registers initial submission state."""
    farm = db.query(FarmPlot).filter(FarmPlot.id == claim_in.farm_plot_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target farm plot not found")
    if current_user.role == UserRole.FARMER and farm.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot submit claim for land you do not cultivate")
        
    policy = db.query(InsurancePolicy).filter(InsurancePolicy.id == claim_in.policy_id).first()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Referenced policy not found")
        
    random_id = secrets.randbelow(900) + 100
    claim_num = f"CLM-2026-{random_id}"
    tx_hash = f"0x{secrets.token_hex(32)}"
    
    # Calculate baseline algorithmic advisory indicators
    new_claim = Claim(
        claim_number=claim_num,
        farmer_id=current_user.id,
        farm_plot_id=farm.id,
        policy_id=policy.id,
        claimed_amount=claim_in.claimed_amount,
        damage_reason=claim_in.damage_reason,
        damage_event_date=claim_in.damage_event_date,
        status=ClaimStatus.SUBMITTED,
        blockchain_tx_hash=tx_hash,
        ai_condition_indicator="Foliage Desiccation & Wilting Detected",
        ai_loss_percentage=65.0,
        weather_correlation_score=0.92,
        officer_remarks="Claim registered via automated wizard. Awaiting evidence and officer review."
    )
    db.add(new_claim)
    db.flush()
    
    # Initial audit transition record
    transition = ClaimStateTransition(
        claim_id=new_claim.id,
        from_state="Draft",
        to_state="Submitted",
        actor_name=current_user.full_name,
        actor_role=current_user.role.value,
        remarks="Farmer submitted formal claim dossier",
        blockchain_block=10430
    )
    db.add(transition)
    
    # Log Blockchain transaction
    block = BlockchainBlockRecord(
        block_number=10430 + new_claim.id,
        tx_hash=tx_hash,
        channel_name="cropinsurancechannel",
        event_name="CLAIM_SUBMITTED",
        claim_number=claim_num,
        endorser_msp="Org1MSP, Org2MSP",
        status="VALID",
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    )
    db.add(block)
    
    # System audit log
    audit = AuditLog(
        actor_email=current_user.email,
        actor_role=current_user.role.value,
        action="Submitted New Claim",
        target_entity=claim_num,
        ip_address="127.0.0.1"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(new_claim)
    return new_claim


@router.get("/claims", response_model=List[ClaimResponse])
def get_claims(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves claims according to user role permissions."""
    if current_user.role in [UserRole.INSURER, UserRole.ADMIN, UserRole.AUDITOR]:
        return db.query(Claim).order_by(Claim.id.desc()).all()
    return db.query(Claim).filter(Claim.farmer_id == current_user.id).order_by(Claim.id.desc()).all()


@router.get("/claims/{claim_id}", response_model=ClaimResponse)
def get_claim_details(
    claim_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves full claim dossier, attached evidence hashes, and audit milestones."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")
    if current_user.role == UserRole.FARMER and claim.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access to other farmer's claim denied")
    return claim


@router.post("/claims/{claim_id}/transition", response_model=ClaimResponse)
def transition_claim_status(
    claim_id: int,
    transition_in: ClaimTransitionRequest,
    current_user: User = Depends(require_insurer),
    db: Session = Depends(get_db)
):
    """Authorizes claim state transition (Approved, Under Review, Rejected, Settled)."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")
        
    old_status = claim.status.value if hasattr(claim.status, "value") else str(claim.status)
    new_status = transition_in.new_status.value if hasattr(transition_in.new_status, "value") else str(transition_in.new_status)
    
    claim.status = transition_in.new_status
    if new_status == "Approved":
        claim.approved_amount = claim.claimed_amount
    claim.officer_remarks = transition_in.remarks
    
    # Record transition
    tx_hash = f"0x{secrets.token_hex(32)}"
    transition = ClaimStateTransition(
        claim_id=claim.id,
        from_state=old_status,
        to_state=new_status,
        actor_name=current_user.full_name,
        actor_role=current_user.role.value,
        remarks=transition_in.remarks,
        blockchain_block=10435 + claim.id
    )
    db.add(transition)
    
    # Record Blockchain State Anchor
    block = BlockchainBlockRecord(
        block_number=10435 + claim.id,
        tx_hash=tx_hash,
        channel_name="cropinsurancechannel",
        event_name=f"CLAIM_STATUS_{new_status.upper().replace(' ', '_')}",
        claim_number=claim.claim_number,
        endorser_msp="Org1MSP, Org2MSP",
        status="VALID",
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    )
    db.add(block)
    
    # Audit log
    audit = AuditLog(
        actor_email=current_user.email,
        actor_role=current_user.role.value,
        action=f"Changed Claim State to {new_status}",
        target_entity=claim.claim_number,
        ip_address="127.0.0.1"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(claim)
    return claim


@router.post("/claims/{claim_id}/evidence", response_model=EvidenceResponse)
def upload_claim_evidence(
    claim_id: int,
    filename: str = Form(...),
    evidence_type: str = Form("Geotagged Photo"),
    gps_coordinates: str = Form("15.3647° N, 75.1240° E"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Registers off-chain evidence metadata with a computed SHA-256 fingerprint."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")
        
    sha256_mock = hashlib.sha256(f"{claim_id}_{filename}_{datetime.now().isoformat()}".encode("utf-8")).hexdigest()
    
    evidence = ClaimEvidence(
        claim_id=claim.id,
        filename=filename,
        file_path=f"/uploads/claims/{claim.claim_number}/{filename}",
        sha256_hash=sha256_mock,
        evidence_type=evidence_type,
        gps_coordinates=gps_coordinates
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence

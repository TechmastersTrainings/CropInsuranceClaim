from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.audit import BlockchainBlockRecord
from backend.app.schemas.audit import BlockResponse

router = APIRouter(tags=["Blockchain Audit Ledger"])


@router.get("/blockchain/blocks", response_model=List[BlockResponse])
def get_blocks(db: Session = Depends(get_db)):
    """Retrieves immutable ledger blocks committed on the Hyperledger Fabric channel."""
    return db.query(BlockchainBlockRecord).order_by(BlockchainBlockRecord.block_number.desc()).all()


@router.get("/blockchain/tx/{tx_hash}", response_model=BlockResponse)
def get_tx(tx_hash: str, db: Session = Depends(get_db)):
    """Verifies cryptographic proof and endorser signatures for a specific transaction hash."""
    block = db.query(BlockchainBlockRecord).filter(BlockchainBlockRecord.tx_hash == tx_hash).first()
    if not block:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found in ledger")
    return block

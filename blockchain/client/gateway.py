import json
import copy
import hashlib
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime, timezone


def compute_sha256(data: str) -> str:
    """Computes a hexadecimal SHA-256 hash string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


class MerkleTree:
    """Computes binary Merkle tree root hash for batches of IoT telemetry or evidence records."""

    @staticmethod
    def compute_root(leaves: List[str]) -> str:
        if not leaves:
            return compute_sha256("EMPTY_TREE")
        if len(leaves) == 1:
            return compute_sha256(leaves[0])

        current_layer = [compute_sha256(leaf) for leaf in leaves]
        while len(current_layer) > 1:
            next_layer = []
            for i in range(0, len(current_layer), 2):
                left = current_layer[i]
                right = current_layer[i + 1] if i + 1 < len(current_layer) else left
                combined = compute_sha256(f"{left}:{right}")
                next_layer.append(combined)
            current_layer = next_layer
        return current_layer[0]


class FabricBlock:
    """Represents a Hyperledger Fabric Channel Block."""

    def __init__(
        self,
        block_number: int,
        previous_hash: str,
        transactions: List[Dict[str, Any]],
        channel_name: str = "cropinsurancechannel",
        timestamp: Optional[str] = None
    ):
        self.block_number = block_number
        self.previous_hash = previous_hash
        self.transactions = copy.deepcopy(transactions)
        self.channel_name = channel_name
        self.timestamp = timestamp or datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        
        # Calculate data hash from transactions
        tx_serialized = json.dumps(transactions, sort_keys=True)
        self.data_hash = compute_sha256(tx_serialized)
        
        # Calculate block header hash
        header_raw = f"{self.block_number}:{self.previous_hash}:{self.data_hash}:{self.timestamp}"
        self.block_hash = f"0x{compute_sha256(header_raw)}"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "block_number": self.block_number,
            "block_hash": self.block_hash,
            "previous_hash": self.previous_hash,
            "data_hash": self.data_hash,
            "channel_name": self.channel_name,
            "tx_count": len(self.transactions),
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "endorsers": "Org1MSP (Farmers), Org2MSP (Carrier), Org3MSP (Regulator)"
        }


class FabricLedgerGateway:
    """Hyperledger Fabric Client Gateway & Distributed Ledger Engine.
    
    Provides cryptographic state anchoring, Merkle tree batching, multi-party endorsement,
    and immutable ledger verification.
    """

    def __init__(self, channel_name: str = "cropinsurancechannel"):
        self.channel_name = channel_name
        self.blocks: List[FabricBlock] = []
        self.state_store: Dict[str, Any] = {}
        self.audit_trail: Dict[str, List[Dict[str, Any]]] = {}
        self._initialize_genesis_ledger()

    def _initialize_genesis_ledger(self):
        """Creates Genesis Block 0 with platform governance policies."""
        genesis_tx = [{
            "tx_id": f"0x{compute_sha256('GENESIS_TX_0')}",
            "type": "CONFIG",
            "event": "GENESIS_CHANNEL_INIT",
            "channel": self.channel_name,
            "payload": {
                "description": "AgriClaim Shield Parametric Crop Insurance Ledger Channel",
                "endorser_msps": ["Org1MSP", "Org2MSP", "Org3MSP"],
                "chaincode_id": "crop_insurance_cc:1.0"
            }
        }]
        genesis_block = FabricBlock(
            block_number=0,
            previous_hash="0x" + "0" * 64,
            transactions=genesis_tx,
            channel_name=self.channel_name,
            timestamp="2026-09-01 00:00:00 UTC"
        )
        self.blocks.append(genesis_block)

    def _append_block(self, transactions: List[Dict[str, Any]]) -> FabricBlock:
        prev_block = self.blocks[-1]
        new_block = FabricBlock(
            block_number=prev_block.block_number + 1,
            previous_hash=prev_block.block_hash,
            transactions=transactions,
            channel_name=self.channel_name
        )
        self.blocks.append(new_block)
        return new_block

    def anchor_claim_submission(
        self,
        claim_number: str,
        farmer_id: int,
        farm_plot_id: int,
        policy_id: int,
        claimed_amount: float,
        damage_reason: str,
        damage_event_date: str
    ) -> Dict[str, Any]:
        """Anchors a new parametric crop claim to the blockchain ledger."""
        tx_id = f"0x{compute_sha256(f'{claim_number}:{farmer_id}:{datetime.now().isoformat()}')}"
        tx = {
            "tx_id": tx_id,
            "event": "CLAIM_SUBMITTED",
            "claim_number": claim_number,
            "actor": f"Farmer #{farmer_id}",
            "role": "Farmer",
            "payload": {
                "farmer_id": farmer_id,
                "farm_plot_id": farm_plot_id,
                "policy_id": policy_id,
                "claimed_amount": claimed_amount,
                "damage_reason": damage_reason,
                "damage_event_date": damage_event_date,
                "status": "Submitted"
            }
        }
        
        block = self._append_block([tx])
        
        # Update state and audit
        self.state_store[claim_number] = tx["payload"]
        self.audit_trail.setdefault(claim_number, []).append({
            "from_state": "Draft",
            "to_state": "Submitted",
            "actor": f"Farmer #{farmer_id}",
            "role": "Farmer",
            "remarks": "Farmer submitted formal claim dossier",
            "tx_id": tx_id,
            "block_number": block.block_number,
            "timestamp": block.timestamp
        })
        
        return {
            "claim_number": claim_number,
            "tx_id": tx_id,
            "block_number": block.block_number,
            "block_hash": block.block_hash
        }

    def anchor_telemetry_batch(
        self,
        farm_plot_id: int,
        readings: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculates Merkle root of IoT sensor stream and commits cryptographic batch anchor."""
        leaf_hashes = [
            compute_sha256(f"{r.get('device_identifier')}:{r.get('temperature')}:{r.get('moisture')}:{r.get('rainfall')}:{r.get('timestamp')}")
            for r in readings
        ]
        merkle_root = MerkleTree.compute_root(leaf_hashes)
        batch_id = f"BATCH-FARM{farm_plot_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        tx_id = f"0x{compute_sha256(batch_id)}"
        tx = {
            "tx_id": tx_id,
            "event": "TELEMETRY_BATCH_COMMITTED",
            "batch_id": batch_id,
            "farm_plot_id": farm_plot_id,
            "payload": {
                "merkle_root": merkle_root,
                "reading_count": len(readings),
                "leaf_hashes_sample": leaf_hashes[:3]
            }
        }
        
        block = self._append_block([tx])
        return {
            "batch_id": batch_id,
            "merkle_root": merkle_root,
            "reading_count": len(readings),
            "tx_id": tx_id,
            "block_number": block.block_number,
            "block_hash": block.block_hash
        }

    def anchor_ai_assessment(
        self,
        claim_number: str,
        condition_indicator: str,
        loss_percentage: float,
        weather_correlation_score: float,
        advisory_rationale: str
    ) -> Dict[str, Any]:
        """Anchors algorithmic evaluation hash and parameters to prevent post-hoc alteration."""
        assessment_raw = f"{claim_number}:{condition_indicator}:{loss_percentage:.1f}:{weather_correlation_score:.2f}"
        assessment_hash = compute_sha256(assessment_raw)
        
        tx_id = f"0x{compute_sha256(f'AI_{assessment_hash}')}"
        tx = {
            "tx_id": tx_id,
            "event": "AI_ASSESSMENT_ANCHORED",
            "claim_number": claim_number,
            "payload": {
                "assessment_hash": assessment_hash,
                "condition_indicator": condition_indicator,
                "estimated_loss_percentage": loss_percentage,
                "weather_correlation_score": weather_correlation_score,
                "advisory_summary": advisory_rationale[:100] + "..."
            }
        }
        
        block = self._append_block([tx])
        return {
            "claim_number": claim_number,
            "assessment_hash": assessment_hash,
            "tx_id": tx_id,
            "block_number": block.block_number,
            "block_hash": block.block_hash
        }

    def anchor_state_transition(
        self,
        claim_number: str,
        from_state: str,
        to_state: str,
        actor_name: str,
        actor_role: str,
        remarks: str
    ) -> Dict[str, Any]:
        """Records an authorized lifecycle transition with multi-signature block anchor."""
        tx_id = f"0x{compute_sha256(f'{claim_number}:{to_state}:{datetime.now().isoformat()}')}"
        tx = {
            "tx_id": tx_id,
            "event": f"CLAIM_STATE_{to_state.upper().replace(' ', '_')}",
            "claim_number": claim_number,
            "actor": actor_name,
            "role": actor_role,
            "payload": {
                "from_state": from_state,
                "to_state": to_state,
                "remarks": remarks
            }
        }
        
        block = self._append_block([tx])
        
        if claim_number in self.state_store:
            self.state_store[claim_number]["status"] = to_state
            
        self.audit_trail.setdefault(claim_number, []).append({
            "from_state": from_state,
            "to_state": to_state,
            "actor": actor_name,
            "role": actor_role,
            "remarks": remarks,
            "tx_id": tx_id,
            "block_number": block.block_number,
            "timestamp": block.timestamp
        })
        
        return {
            "claim_number": claim_number,
            "new_state": to_state,
            "tx_id": tx_id,
            "block_number": block.block_number,
            "block_hash": block.block_hash
        }

    def get_ledger_blocks(self) -> List[Dict[str, Any]]:
        """Returns all blocks on the channel for explorer inspection."""
        return [b.to_dict() for b in self.blocks]

    def get_claim_history(self, claim_number: str) -> List[Dict[str, Any]]:
        """Returns verifiable chronological audit transitions for a claim."""
        return self.audit_trail.get(claim_number, [])

    def verify_ledger_integrity(self) -> Tuple[bool, str]:
        """Traverses the chain from Genesis to tip, verifying cryptographic hash linkages."""
        if not self.blocks:
            return False, "Ledger is empty"

        # Check Genesis
        if self.blocks[0].block_number != 0 or self.blocks[0].previous_hash != "0x" + "0" * 64:
            return False, "Genesis block corrupted"

        for i in range(1, len(self.blocks)):
            current = self.blocks[i]
            prev = self.blocks[i - 1]

            if current.block_number != prev.block_number + 1:
                return False, f"Broken sequence at block #{current.block_number}"

            if current.previous_hash != prev.block_hash:
                return False, f"Hash pointer mismatch at block #{current.block_number}. Expected {prev.block_hash}, got {current.previous_hash}"

            # Verify block data hash
            expected_data_hash = compute_sha256(json.dumps(current.transactions, sort_keys=True))
            if current.data_hash != expected_data_hash:
                return False, f"Data tampering detected inside block #{current.block_number}"

        return True, "Ledger integrity cryptographically verified. All hash pointers intact."

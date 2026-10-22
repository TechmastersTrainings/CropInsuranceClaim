package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract defines the Hyperledger Fabric chaincode for Crop Insurance
type SmartContract struct {
	contractapi.Contract
}

// PolicyAsset represents an insurance policy on the distributed ledger
type PolicyAsset struct {
	ID                string  `json:"id"`
	FarmerID          string  `json:"farmer_id"`
	CropType          string  `json:"crop_type"`
	SumInsured        float64 `json:"sum_insured"`
	PremiumAmount     float64 `json:"premium_amount"`
	TriggerConditions string  `json:"trigger_conditions"`
	Status            string  `json:"status"` // Active, Lapsed, Claimed
	CreatedAt         string  `json:"created_at"`
}

// ClaimAsset represents a parametric crop claim state on ledger
type ClaimAsset struct {
	ID                  string   `json:"id"`
	ClaimNumber         string   `json:"claim_number"`
	PolicyID            string   `json:"policy_id"`
	FarmerID            string   `json:"farmer_id"`
	ClaimedAmount       float64  `json:"claimed_amount"`
	ApprovedAmount      float64  `json:"approved_amount"`
	DamageReason        string   `json:"damage_reason"`
	DamageEventDate     string   `json:"damage_event_date"`
	Status              string   `json:"status"` // Submitted, Under Review, Approved, Settled, Rejected
	EvidenceHashes      []string `json:"evidence_hashes"`
	AIAssessmentHash    string   `json:"ai_assessment_hash"`
	TelemetryRootHash   string   `json:"telemetry_root_hash"`
	LastTransitionBlock uint64   `json:"last_transition_block"`
	UpdatedAt           string   `json:"updated_at"`
}

// StateTransitionRecord captures an immutable state transition
type StateTransitionRecord struct {
	ClaimID     string `json:"claim_id"`
	FromState   string `json:"from_state"`
	ToState     string `json:"to_state"`
	ActorName   string `json:"actor_name"`
	ActorRole   string `json:"actor_role"`
	Remarks     string `json:"remarks"`
	TxID        string `json:"tx_id"`
	Timestamp   string `json:"timestamp"`
	BlockNumber uint64 `json:"block_number"`
}

// TelemetryBatchAnchor records a Merkle root hash of IoT readings
type TelemetryBatchAnchor struct {
	BatchID        string `json:"batch_id"`
	FarmPlotID     int    `json:"farm_plot_id"`
	MerkleRootHash string `json:"merkle_root_hash"`
	ReadingCount   int    `json:"reading_count"`
	Timestamp      string `json:"timestamp"`
	TxID           string `json:"tx_id"`
}

// InitLedger initializes the ledger with genesis state
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	policies := []PolicyAsset{
		{
			ID:                "POL-2026-KA-001",
			FarmerID:          "FARMER-101",
			CropType:          "Cotton",
			SumInsured:        150000.0,
			PremiumAmount:     4500.0,
			TriggerConditions: "Drought: <15mm rain in 21 days OR Soil Moisture <12%",
			Status:            "Active",
			CreatedAt:         time.Now().UTC().Format(time.RFC3339),
		},
		{
			ID:                "POL-2026-KA-002",
			FarmerID:          "FARMER-102",
			CropType:          "Paddy (Rice)",
			SumInsured:        120000.0,
			PremiumAmount:     3600.0,
			TriggerConditions: "Flood: >150mm rain in 24 hours OR Submersion >48 hours",
			Status:            "Active",
			CreatedAt:         time.Now().UTC().Format(time.RFC3339),
		},
	}

	for _, policy := range policies {
		policyJSON, err := json.Marshal(policy)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState("POLICY_"+policy.ID, policyJSON)
		if err != nil {
			return fmt.Errorf("failed to put policy state: %v", err)
		}
	}

	return nil
}

// SubmitClaim creates a new claim on ledger
func (s *SmartContract) SubmitClaim(
	ctx contractapi.TransactionContextInterface,
	claimID string,
	claimNumber string,
	policyID string,
	farmerID string,
	claimedAmount float64,
	damageReason string,
	damageDate string,
) error {
	exists, err := s.ClaimExists(ctx, claimID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the claim %s already exists", claimID)
	}

	txID := ctx.GetStub().GetTxID()
	timestamp, err := ctx.GetStub().GetTxTimestamp()
	tsStr := time.Now().UTC().Format(time.RFC3339)
	if err == nil && timestamp != nil {
		tsStr = time.Unix(timestamp.Seconds, int64(timestamp.Nanos)).UTC().Format(time.RFC3339)
	}

	claim := ClaimAsset{
		ID:                  claimID,
		ClaimNumber:         claimNumber,
		PolicyID:            policyID,
		FarmerID:            farmerID,
		ClaimedAmount:       claimedAmount,
		ApprovedAmount:      0.0,
		DamageReason:        damageReason,
		DamageEventDate:     damageDate,
		Status:              "Submitted",
		EvidenceHashes:      []string{},
		AIAssessmentHash:    "",
		TelemetryRootHash:   "",
		LastTransitionBlock: 10430,
		UpdatedAt:           tsStr,
	}

	claimJSON, err := json.Marshal(claim)
	if err != nil {
		return err
	}

	// Record state transition
	transition := StateTransitionRecord{
		ClaimID:     claimID,
		FromState:   "Draft",
		ToState:     "Submitted",
		ActorName:   farmerID,
		ActorRole:   "Farmer",
		Remarks:     "Parametric claim submitted via mobile application",
		TxID:        txID,
		Timestamp:   tsStr,
		BlockNumber: 10430,
	}
	transJSON, _ := json.Marshal(transition)
	_ = ctx.GetStub().PutState("TRANS_"+claimID+"_"+txID, transJSON)

	return ctx.GetStub().PutState("CLAIM_"+claimID, claimJSON)
}

// AnchorAIAssessment binds algorithmic advisory indicators to the claim
func (s *SmartContract) AnchorAIAssessment(
	ctx contractapi.TransactionContextInterface,
	claimID string,
	assessmentHash string,
	lossPercentage float64,
) error {
	claim, err := s.QueryClaim(ctx, claimID)
	if err != nil {
		return err
	}

	claim.AIAssessmentHash = assessmentHash
	claim.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	claimJSON, err := json.Marshal(claim)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("CLAIM_"+claimID, claimJSON)
}

// TransitionClaimState advances claim through lifecycle states
func (s *SmartContract) TransitionClaimState(
	ctx contractapi.TransactionContextInterface,
	claimID string,
	newState string,
	actorName string,
	actorRole string,
	remarks string,
) error {
	claim, err := s.QueryClaim(ctx, claimID)
	if err != nil {
		return err
	}

	oldState := claim.Status
	claim.Status = newState
	claim.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	txID := ctx.GetStub().GetTxID()
	transition := StateTransitionRecord{
		ClaimID:     claimID,
		FromState:   oldState,
		ToState:     newState,
		ActorName:   actorName,
		ActorRole:   actorRole,
		Remarks:     remarks,
		TxID:        txID,
		Timestamp:   claim.UpdatedAt,
		BlockNumber: 10435,
	}

	transJSON, err := json.Marshal(transition)
	if err != nil {
		return err
	}
	_ = ctx.GetStub().PutState("TRANS_"+claimID+"_"+txID, transJSON)

	claimJSON, err := json.Marshal(claim)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("CLAIM_"+claimID, claimJSON)
}

// ApproveClaim authorizes insurance payout
func (s *SmartContract) ApproveClaim(
	ctx contractapi.TransactionContextInterface,
	claimID string,
	approvedAmount float64,
	remarks string,
) error {
	claim, err := s.QueryClaim(ctx, claimID)
	if err != nil {
		return err
	}

	claim.ApprovedAmount = approvedAmount
	claim.Status = "Approved"
	claim.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	claimJSON, err := json.Marshal(claim)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("CLAIM_"+claimID, claimJSON)
}

// AnchorTelemetryMerkleRoot anchors a batch of sensor readings
func (s *SmartContract) AnchorTelemetryMerkleRoot(
	ctx contractapi.TransactionContextInterface,
	batchID string,
	farmPlotID int,
	merkleRootHash string,
	readingCount int,
) error {
	txID := ctx.GetStub().GetTxID()
	record := TelemetryBatchAnchor{
		BatchID:        batchID,
		FarmPlotID:     farmPlotID,
		MerkleRootHash: merkleRootHash,
		ReadingCount:   readingCount,
		Timestamp:      time.Now().UTC().Format(time.RFC3339),
		TxID:           txID,
	}

	recordJSON, err := json.Marshal(record)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("TELEMETRY_"+batchID, recordJSON)
}

// QueryClaim returns the claim stored in the world state
func (s *SmartContract) QueryClaim(ctx contractapi.TransactionContextInterface, claimID string) (*ClaimAsset, error) {
	claimJSON, err := ctx.GetStub().GetState("CLAIM_" + claimID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if claimJSON == nil {
		return nil, fmt.Errorf("the claim %s does not exist", claimID)
	}

	var claim ClaimAsset
	err = json.Unmarshal(claimJSON, &claim)
	if err != nil {
		return nil, err
	}

	return &claim, nil
}

// ClaimExists returns true when claim with given ID exists in world state
func (s *SmartContract) ClaimExists(ctx contractapi.TransactionContextInterface, claimID string) (bool, error) {
	claimJSON, err := ctx.GetStub().GetState("CLAIM_" + claimID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return claimJSON != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating crop insurance chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting crop insurance chaincode: %s", err.Error())
	}
}

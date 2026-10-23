import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus2, CheckCircle2, ArrowRight, ArrowLeft, Upload, Shield, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ClaimSubmissionWizard() {
  const { farms, policies, addClaim, user } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || "");
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || "");
  const [damageReason, setDamageReason] = useState("Severe Prolonged Dry Spell & Thermal Desiccation");
  const [eventDate, setEventDate] = useState("2026-09-20");
  const [claimedAmount, setClaimedAmount] = useState(120000);
  const [evidenceFiles, setEvidenceFiles] = useState([
    { name: "Field_Canopy_North_Sector.jpg", size: "2.4 MB", type: "Geotagged Photo" },
    { name: "Soil_Cracking_CloseUp.jpg", size: "1.8 MB", type: "Foliage Evidence" }
  ]);

  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0];
  const selectedPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const newClaimId = addClaim({
      farmerName: user?.name || "Registered Farmer",
      farmerId: user?.id || "USR-FARMER",
      farmId: selectedFarm.id,
      farmName: selectedFarm.name,
      crop: selectedFarm.activeCrop,
      policyId: selectedPolicy.id,
      claimedAmount: parseFloat(claimedAmount),
      damageReason,
      eventDate
    });
    navigate(`/claims/${newClaimId}`);
  };

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FilePlus2 size={28} />
            <span>Parametric Claim Submission Wizard</span>
          </h1>
          <p className="page-subtitle">
            Step-by-step verifiable claim filing integrated with on-farm IoT sensors and satellite data.
          </p>
        </div>
      </div>

      {/* Wizard Steps Indicator */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 28,
        position: "relative"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 600,
          color: step >= 1 ? "var(--color-primary)" : "var(--text-muted)"
        }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: step >= 1 ? "var(--color-primary)" : "var(--bg-subtle)",
            color: step >= 1 ? "#fff" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem"
          }}>1</span>
          <span>Select Plot & Policy</span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 600,
          color: step >= 2 ? "var(--color-primary)" : "var(--text-muted)"
        }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: step >= 2 ? "var(--color-primary)" : "var(--bg-subtle)",
            color: step >= 2 ? "#fff" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem"
          }}>2</span>
          <span>Damage Event Data</span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 600,
          color: step >= 3 ? "var(--color-primary)" : "var(--text-muted)"
        }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: step >= 3 ? "var(--color-primary)" : "var(--bg-subtle)",
            color: step >= 3 ? "#fff" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem"
          }}>3</span>
          <span>Evidence & Review</span>
        </div>
      </div>

      <div className="card">
        {step === 1 && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Step 1: Choose Affected Plot & Active Policy</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Select Registered Farm Plot</label>
              <select
                className="form-control"
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — Survey: {f.surveyNo} ({f.area} Acres, Crop: {f.activeCrop})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Enrolled Parametric Policy</label>
              <select
                className="form-control"
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
              >
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.provider} (Max: ₹{p.coveragePerAcre}/Acre)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", marginTop: 16 }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Selected Plot Area: <strong>{selectedFarm.area} Acres</strong> | Insured Crop: <strong>{selectedFarm.activeCrop}</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                Next: Damage Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Step 2: Enter Damage Event Details</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Climate Anomaly / Damage Event</label>
              <input
                type="date"
                className="form-control"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Weather Anomaly / Damage Category</label>
              <select
                className="form-control"
                value={damageReason}
                onChange={(e) => setDamageReason(e.target.value)}
              >
                <option value="Severe Prolonged Dry Spell & Thermal Desiccation">Severe Prolonged Dry Spell & Thermal Desiccation (Drought)</option>
                <option value="Flash Flood Waterlogging after Cloudburst">Flash Flood Waterlogging after Cloudburst</option>
                <option value="Unseasonal Hailstorm & High Velocity Winds">Unseasonal Hailstorm & High Velocity Winds</option>
                <option value="Pod Rot & Extreme Continuous Humidity">Pod Rot & Extreme Continuous Humidity</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Loss / Claim Amount (₹)</label>
              <input
                type="number"
                step="5000"
                className="form-control"
                value={claimedAmount}
                onChange={(e) => setClaimedAmount(e.target.value)}
                required
              />
              <span className="form-hint">
                Max allowable coverage for {selectedFarm.area} Acres is ₹{(selectedFarm.area * selectedPolicy.coveragePerAcre).toLocaleString()}.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Next: Upload Evidence <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Step 3: Verification & Submission to Smart Contract</h3>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Attached Photo / Field Evidence</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {evidenceFiles.map((f, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "var(--bg-subtle)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem"
                  }}>
                    <span>{f.name} ({f.size})</span>
                    <span className="badge badge-evidence">{f.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Summary Card */}
            <div style={{ padding: 16, background: "var(--color-primary-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>
                Claim Summary Confirmation:
              </div>
              <div className="grid-2" style={{ fontSize: "0.85rem" }}>
                <div><strong>Farm:</strong> {selectedFarm.name} ({selectedFarm.surveyNo})</div>
                <div><strong>Crop:</strong> {selectedFarm.activeCrop}</div>
                <div><strong>Event Date:</strong> {eventDate}</div>
                <div><strong>Claim Amount:</strong> ₹{claimedAmount.toLocaleString()}</div>
              </div>
            </div>

            <div className="alert-banner alert-info" style={{ marginBottom: 20 }}>
              <Shield size={18} />
              <span>
                Upon submission, a state transition transaction will be cryptographically broadcasted to the Hyperledger Fabric channel.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={handleFinalSubmit}>
                Confirm & Submit Claim <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

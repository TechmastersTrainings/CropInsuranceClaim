import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FilePlus2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Lock,
  UserCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function ClaimSubmissionWizard() {
  const { farms, policies, addClaim, user } = useApp();
  const navigate = useNavigate();

  // Hooks must be called unconditionally at top of component
  const [step, setStep] = useState(1);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || "");
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || "");
  const [damageReason, setDamageReason] = useState("Severe Prolonged Dry Spell & Thermal Desiccation");
  const [eventDate, setEventDate] = useState("2026-09-20");
  const [claimedAmount, setClaimedAmount] = useState(120000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceFiles] = useState([
    { name: "Field_Canopy_North_Sector.jpg", size: "2.4 MB", type: "Geotagged Photo" },
    { name: "Soil_Cracking_CloseUp.jpg", size: "1.8 MB", type: "Foliage Evidence" }
  ]);

  // 1. Authentication Guard: Must be signed in
  if (!user) {
    return (
      <div className="page-container" style={{ maxWidth: 640, marginTop: 40, textAlign: "center" }}>
        <div className="card" style={{ padding: "40px 28px", border: "1px solid var(--border-light)" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--color-danger-soft)",
            color: "var(--color-danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px"
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 10 }}>
            Farmer Authentication Required
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.93rem", lineHeight: 1.6, marginBottom: 24 }}>
            Under Section 44 of the Pradhan Mantri Fasal Bima Yojana (PMFBY) guidelines and IRDAI regulations, 
            crop insurance claims can <strong>only</strong> be initiated by authenticated, registered cultivators 
            with verified Land Survey (Khata) and Aadhaar identification.
          </p>

          <div style={{
            background: "var(--bg-subtle)",
            padding: "14px 18px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            color: "var(--text-main)",
            marginBottom: 26,
            textAlign: "left"
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--color-primary)" }}>
              Mandatory Regulatory Requirement:
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <li>Direct verification against State Land Records (Bhoomi / RoR / Patta)</li>
              <li>Aadhaar-seeded Direct Benefit Transfer (DBT) bank verification</li>
              <li>Cryptographic timestamping of crop loss event on distributed ledger</li>
            </ul>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/auth/farmer" className="btn btn-primary">
              <UserCheck size={16} /> Sign In as Farmer
            </Link>
            <Link to="/auth/farmer" className="btn btn-secondary">
              Register New Farmer Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role Clearance Guard: Only Farmers and Admins can submit claims
  const userRole = (user.role || "").toUpperCase();
  if (userRole !== "FARMER" && userRole !== "ADMIN") {
    return (
      <div className="page-container" style={{ maxWidth: 640, marginTop: 40, textAlign: "center" }}>
        <div className="card" style={{ padding: "40px 28px", border: "1px solid var(--border-light)" }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "var(--color-amber-soft)",
            color: "#bf360c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <AlertTriangle size={30} />
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 10 }}>
            Farmer Role Clearance Required
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 20 }}>
            You are currently signed in as <strong>{user.name}</strong> with the <strong>{user.role}</strong> role. 
            Under insurance law, underwriters and regulatory auditors cannot initiate claims on behalf of beneficiaries. 
            Please use your respective adjudication workspace to review existing filings.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link to="/claim-reviews" className="btn btn-primary">
              Go to Claim Adjudication Workspace
            </Link>
            <Link to="/auth/farmer" className="btn btn-secondary">
              Switch to Farmer Session
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Registered Plot Guard: Farmer must have registered at least one plot in database
  if (farms.length === 0) {
    return (
      <div className="page-container" style={{ maxWidth: 640, marginTop: 40, textAlign: "center" }}>
        <div className="card" style={{ padding: "40px 28px", border: "1px solid var(--border-light)" }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "var(--color-primary-soft)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <FilePlus2 size={30} />
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 10 }}>
            Registered Land Parcel Required
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 20 }}>
            Under Section 44 PMFBY regulations, claims must be linked to a registered cadastral survey parcel. 
            You have not registered any land plots in your database yet.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link to="/farms" className="btn btn-primary">
              Register Land Plot Now &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0];

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0] || {
    id: 1,
    title: "PMFBY Kharif Multi-Peril Comprehensive",
    provider: "National Agriculture Insurance Company",
    coveragePerAcre: 35000
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newClaimId = await addClaim({
        farmerName: user.name,
        farmerId: user.id || 1,
        farmerMobile: user.phone || "+91 98451 00000",
        farmerAadhaar: user.aadhaarMasked || "XXXX-XXXX-4819",
        farmId: selectedFarm.id,
        farmName: selectedFarm.name,
        crop: selectedFarm.activeCrop,
        policyId: selectedPolicy.id,
        claimedAmount: parseFloat(claimedAmount),
        damageReason,
        eventDate
      });
      navigate(`/claims/${newClaimId}`);
    } catch (err) {
      alert("Submission error: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 880 }}>
      {/* Authenticated Farmer Session Badge */}
      <div style={{
        background: "var(--color-primary-soft)",
        border: "1px solid var(--color-primary)",
        borderRadius: "var(--radius-md)",
        padding: "14px 18px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--color-primary)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-primary)" }}>
                Verified Beneficiary: {user.name}
              </span>
              <span className="badge badge-success" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                Session Authenticated
              </span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
              Khata / Survey No: <strong>{user.survey || selectedFarm.surveyNo}</strong> | 
              Aadhaar: <strong>{user.aadhaarMasked || "XXXX-XXXX-4812"}</strong> | 
              DBT Bank: <strong>State Bank of India (A/C: ****5592)</strong>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600, textAlign: "right" }}>
          PMFBY Beneficiary Registry Active
        </div>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FilePlus2 size={26} />
            <span>Parametric Claim Submission Wizard</span>
          </h1>
          <p className="page-subtitle">
            Authenticated claim filing integrated with on-farm IoT sensors, automated AI assessment, and smart contracts.
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
          <span>Evidence & Digital Signature</span>
        </div>
      </div>

      <div className="card">
        {step === 1 && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Step 1: Choose Affected Plot & Active Enrolled Policy</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Registered Land Parcel (RoR / Khata)</label>
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
              <label className="form-label">Enrolled Parametric Insurance Policy</label>
              <select
                className="form-control"
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
              >
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.provider} (Max: ₹{p.coveragePerAcre.toLocaleString()}/Acre)
                  </option>
                ))}
              </select>
            </div>

            <div style={{
              padding: 14,
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-sm)",
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Insured Crop: <strong style={{ color: "var(--text-main)" }}>{selectedFarm.activeCrop}</strong> | 
                  Plot Area: <strong style={{ color: "var(--text-main)" }}>{selectedFarm.area} Acres</strong>
                </div>
              </div>
              <span className="badge badge-success">Coverage Active</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                Next: Damage Event Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Step 2: Enter Climate Anomaly & Loss Details</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Climate Anomaly / Crop Damage Event</label>
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
                Max allowable statutory coverage for {selectedFarm.area} Acres is ₹{(selectedFarm.area * selectedPolicy.coveragePerAcre).toLocaleString()}.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Next: Verification & Evidence <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Step 3: Verification & Cryptographic Smart Contract Dispatch</h3>
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

            {/* Final Summary Card with Authenticated Beneficiary */}
            <div style={{
              padding: 16,
              background: "var(--color-primary-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
              marginBottom: 20
            }}>
              <div style={{ fontWeight: 700, color: "var(--color-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={16} />
                <span>Parametric Claim Summary Confirmation:</span>
              </div>
              <div className="grid-2" style={{ fontSize: "0.85rem", gap: 8 }}>
                <div><strong>Claimant:</strong> {user.name} ({user.id || "FMR-USR"})</div>
                <div><strong>Survey Plot:</strong> {selectedFarm.name} ({selectedFarm.surveyNo})</div>
                <div><strong>Aadhaar Verification:</strong> {user.aadhaarMasked || "XXXX-XXXX-4812"}</div>
                <div><strong>Insured Crop:</strong> {selectedFarm.activeCrop}</div>
                <div><strong>Anomaly Event Date:</strong> {eventDate}</div>
                <div><strong>Claimed Amount:</strong> ₹{parseFloat(claimedAmount).toLocaleString()}</div>
              </div>
            </div>

            <div className="alert-banner alert-info" style={{ marginBottom: 20 }}>
              <Shield size={18} />
              <span>
                By clicking submit, your claim is authenticated with your session signature and broadcasted to the Hyperledger Fabric channel. Section 420 IPC penalties apply for fraudulent filings.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)} disabled={isSubmitting}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={handleFinalSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Broadcasting to Ledger..." : "Confirm & Sign Claim Submission"} <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

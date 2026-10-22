import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Shield, AlertTriangle, Check, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StatusBadge } from "../components/StatusBadge";

export function ClaimReviewPage() {
  const { claims, updateClaimStatus } = useApp();
  const [selectedClaimId, setSelectedClaimId] = useState(claims[0]?.id || "");
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [actionSuccess, setActionSuccess] = useState(null);

  const claim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const handleAction = (status) => {
    updateClaimStatus(claim.id, status, reviewRemarks || `Processed as ${status}`);
    setActionSuccess(`Claim ${claim.id} status successfully transitioned to "${status}". Blockchain event emitted.`);
    setReviewRemarks("");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CheckCircle2 size={28} />
            <span>Insurance Claim Adjudication Workspace</span>
          </h1>
          <p className="page-subtitle">
            Officer adjudication: Correlate multi-source evidence, evaluate parametric threshold fulfillment, and authorize state changes.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-banner alert-success">
          <Check size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Claim Picker */}
      <div className="card" style={{ padding: "12px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
            Select Claim for Review:
          </label>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={selectedClaimId}
            onChange={(e) => setSelectedClaimId(e.target.value)}
          >
            {claims.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.farmerName} ({c.crop}, Current Status: {c.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Claim Dossier */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 className="card-title">Claim Dossier: {claim.id}</h3>
              <StatusBadge status={claim.status} />
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 16, fontSize: "0.88rem" }}>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Farmer:</span> <strong>{claim.farmerName}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Farm Plot:</span> <strong>{claim.farmName}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Crop:</span> <strong>{claim.crop}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Claim Amount:</span> <strong style={{ color: "var(--color-primary)" }}>₹{claim.claimedAmount.toLocaleString("en-IN")}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Damage Event Date:</span> <span>{claim.eventDate}</span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Submission Date:</span> <span>{claim.submissionDate}</span>
            </div>
          </div>

          <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: 4 }}>
              Farmer's Reported Damage Cause:
            </div>
            <div style={{ fontSize: "0.9rem" }}>{claim.damageReason}</div>
          </div>

          {/* AI Evidence Assessment Indicator */}
          <div style={{ padding: 14, background: "var(--color-primary-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontWeight: 700, color: "var(--color-primary)", marginBottom: 6 }}>
              Algorithmic Assessment Summary (Advisory):
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
              • Condition: <strong>{claim.aiAssessment.conditionIndicator}</strong> (Loss estimate: {claim.aiAssessment.estimatedDamagePct}%)<br />
              • Weather station correlation index: <strong>{(claim.aiAssessment.weatherCorrelationScore * 100).toFixed(0)}%</strong><br />
              • Sensor telemetry note: <em>{claim.aiAssessment.sensorAnomalyNoted}</em>
            </div>
          </div>
        </div>

        {/* Adjudication Decision Card */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <div className="card-header">
            <h3 className="card-title">Authorized Decision</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Review Notes & Justification</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Enter official review remarks before authorizing state change..."
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleAction("Approved")}
            >
              <CheckCircle2 size={16} /> Approve Claim (Authorize Payout)
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleAction("Additional Evidence Requested")}
            >
              <HelpCircle size={16} /> Request Additional Evidence
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleAction("Rejected")}
            >
              <XCircle size={16} /> Reject with Recorded Reasons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

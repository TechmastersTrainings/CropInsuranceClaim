import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Layers, Shield, Clock, FileText, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StatusBadge } from "../components/StatusBadge";

export function ClaimDetailPage() {
  const { claimId } = useParams();
  const { claims } = useApp();

  const claim = claims.find(c => c.id === claimId) || claims[0];

  const lifecycleStages = [
    "Draft",
    "Submitted",
    "Evidence Validation",
    "Assessment Pending",
    "Under Review",
    "Approved",
    "Settlement Pending",
    "Settled",
    "Closed"
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 16 }}>
        <Link to="/claims" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <ArrowLeft size={16} /> Back to Claim Tracking
        </Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 className="page-title">{claim.id}</h1>
            <StatusBadge status={claim.status} />
          </div>
          <p className="page-subtitle">
            Farmer: {claim.farmerName} | Farm Plot: {claim.farmName} | Crop: {claim.crop}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/ai-assessment" className="btn btn-secondary">
            Inspect AI Assessment
          </Link>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Claim Lifecycle Timeline */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} />
              <span>State Transition Milestones & Audit Timeline</span>
            </h3>
          </div>

          <div className="timeline">
            {claim.timeline.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className={`timeline-dot ${item.state === 'Completed' ? 'completed' : 'pending'}`} />
                <div className="timeline-header">
                  <span>{item.step}</span>
                  <span className="timeline-time">{item.timestamp}</span>
                </div>
                <div className="timeline-body">
                  Actor: <strong>{item.actor}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* 10-state progression bar */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
              Formal Lifecycle Pipeline:
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {lifecycleStages.map((stage, i) => {
                const isPassed = claim.status === "Settled" || (claim.status === "Approved" && i <= 5) || (claim.status === "Under Review" && i <= 4) || i <= 1;
                return (
                  <span
                    key={stage}
                    style={{
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      background: isPassed ? "var(--color-primary-soft)" : "var(--bg-subtle)",
                      color: isPassed ? "var(--color-primary)" : "var(--text-muted)",
                      fontWeight: isPassed ? 600 : 400
                    }}
                  >
                    {stage}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Blockchain Cryptographic Receipt */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} color="var(--color-blockchain)" />
              <span>Blockchain Anchor</span>
            </h3>
            <span className="badge badge-blockchain">Fabric Verified</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.85rem" }}>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>CHANNEL NAME</span>
              <strong>cropinsurancechannel</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>CHAINCODE CONTRACT</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>claimlifecycle:v1.0</span>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>TRANSACTION HASH</span>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                wordBreak: "break-all",
                background: "var(--bg-subtle)",
                padding: "8px",
                borderRadius: "var(--radius-sm)",
                marginTop: 2
              }}>
                {claim.blockchainTx}
              </div>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>AUTHORIZED SIGNING MSPS</span>
              <span>Org1MSP (NAIC Insurer), Org2MSP (Govt Regulator)</span>
            </div>

            <div style={{ padding: 10, background: "var(--color-blockchain-soft)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--color-blockchain)" }}>
              <Shield size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              State changes are cryptographically tamper-proof and immutable across endorsing peers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

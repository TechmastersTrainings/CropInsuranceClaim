import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FileText, ArrowLeft, ShieldCheck, CheckCircle2, Calculator, Info } from "lucide-react";
import { useApp } from "../context/AppContext";

export function PolicyDetailsPage() {
  const { policyId } = useParams();
  const { policies, farms } = useApp();

  const policy = policies.find(p => p.id === policyId) || policies[0];
  const [selectedAcres, setSelectedAcres] = useState(farms[0]?.area || 3.5);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  const totalPremium = Math.round(selectedAcres * policy.premiumPerAcre);
  const maxPayout = Math.round(selectedAcres * policy.coveragePerAcre);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 16 }}>
        <Link to="/policies" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <ArrowLeft size={16} /> Back to Policy Catalog
        </Link>
      </div>

      <div className="page-header">
        <div>
          <span className="badge badge-approved" style={{ marginBottom: 8 }}>{policy.crop} Protection</span>
          <h1 className="page-title">{policy.title}</h1>
          <p className="page-subtitle">
            Policy Code: {policy.id} | Underwritten by: {policy.provider} ({policy.licenseNo})
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/claim-wizard" className="btn btn-primary">
            Initiate Claim Under Policy
          </Link>
        </div>
      </div>

      {enrolledSuccess && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>Farm plot enrollment simulated successfully. Smart contract policy token minted.</span>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Core Terms */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <h3 className="card-title">Policy Terms & Underwriting Wording</h3>
            <span className="badge badge-approved">IRDAI Certified</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.9rem" }}>
            <p>
              This parametric policy utilizes verified meteorological data from authorized automated weather stations and on-farm IoT sensors. 
              Payout disbursements are triggered algorithmically upon meeting or exceeding established weather indices.
            </p>

            <div style={{ padding: 14, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--color-primary)" }}>
              <div style={{ fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>
                Primary Parametric Index Trigger:
              </div>
              <div>{policy.triggerParameter}</div>
            </div>

            <div className="grid-2">
              <div>
                <strong>Season Validity:</strong> {policy.season}
              </div>
              <div>
                <strong>Policy Expiry:</strong> {policy.validUntil}
              </div>
              <div>
                <strong>Deductible Rate:</strong> {policy.deductiblePercent}% of total damage assessment
              </div>
              <div>
                <strong>Oracle Feeds:</strong> Automated Weather Station + Ground Probes
              </div>
            </div>

            <div style={{ padding: 12, background: "var(--color-info-soft)", borderRadius: "var(--radius-sm)", fontSize: "0.825rem", color: "var(--color-info)" }}>
              <Info size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
              In accordance with Section 13 & 14, claims are anchored to the Hyperledger Fabric ledger to prevent duplicate settlements.
            </div>
          </div>
        </div>

        {/* Premium & Coverage Estimator */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <div className="card-header">
            <h3 className="card-title">
              <Calculator size={18} />
              <span>Premium Calculator</span>
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Insured Land Area (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                className="form-control"
                value={selectedAcres}
                onChange={(e) => setSelectedAcres(parseFloat(e.target.value) || 1)}
              />
            </div>

            <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Total Season Premium:</span>
                <strong style={{ fontSize: "1.05rem", color: "var(--color-primary)" }}>
                  ₹{totalPremium.toLocaleString("en-IN")}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Maximum Payout Limit:</span>
                <strong style={{ color: "var(--color-primary-light)" }}>
                  ₹{maxPayout.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => {
                setEnrolledSuccess(true);
                setTimeout(() => setEnrolledSuccess(false), 4000);
              }}
            >
              Simulate Plot Enrollment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

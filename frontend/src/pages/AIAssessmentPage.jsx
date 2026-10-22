import React, { useState } from "react";
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Info, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

export function AIAssessmentPage() {
  const { claims } = useApp();
  const [selectedClaimId, setSelectedClaimId] = useState(claims[0]?.id || "");

  const claim = claims.find(c => c.id === selectedClaimId) || claims[0];
  const assessment = claim.aiAssessment;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity size={28} />
            <span>Crop Condition & Anomaly Assessment Workspace</span>
          </h1>
          <p className="page-subtitle">
            Authorized multi-source evidence verification correlating field telemetry, weather indices and satellite observations.
          </p>
        </div>
      </div>

      {/* Mandatory Section 25 Confidentiality Banner */}
      <div className="alert-banner alert-info" style={{ marginBottom: 20 }}>
        <Info size={18} />
        <div>
          <strong>Confidentiality Notice:</strong> In accordance with Platform Security Policy (Section 25), assessment summaries present authorized, business-level crop condition indicators. Proprietary model architectures, internal weights, and server-side algorithms remain strictly confidential and protected behind server boundaries.
        </div>
      </div>

      {/* Claim Selector */}
      <div className="card" style={{ padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
            Select Claim for Assessment Audit:
          </label>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={selectedClaimId}
            onChange={(e) => setSelectedClaimId(e.target.value)}
          >
            {claims.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.farmerName} ({c.crop}, Status: {c.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assessment Indicators Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Crop Condition Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Observed Crop Health Status</h3>
            <span className="badge badge-approved">Completed</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>
            {assessment.conditionIndicator}
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Derived from validated geotagged foliage imagery and multispectral canopy reflections.
          </p>
          <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
            Estimated Loss Index: <strong>{assessment.estimatedDamagePct}% Damage</strong>
          </div>
        </div>

        {/* Environmental & Weather Correlation */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Environmental Telemetry Correlation</h3>
            <span className="badge badge-evidence">Indexed</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-info)", marginBottom: 8 }}>
            {(assessment.weatherCorrelationScore * 100).toFixed(0)}% Consistency Score
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            High alignment between reported claim event date ({claim.eventDate}) and recorded weather station indices.
          </p>
          <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
            On-Farm Sensor Anomaly: <strong>{assessment.sensorAnomalyNoted}</strong>
          </div>
        </div>

        {/* Automated Review Recommendation */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Workflow Decision Indicator</h3>
            <span className="badge badge-review">Advisory Only</span>
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-accent-amber)", marginBottom: 8 }}>
            {assessment.reviewRecommendation}
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            In compliance with Section 10.C, algorithmic indicators are advisory. Legal insurance payout decisions are issued exclusively by authorized Insurance Officers.
          </p>
        </div>
      </div>

      {/* Multi-Evidence Fusion Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Multi-Source Evidence Provenance Trace</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data Source</th>
                <th>Provider / Device</th>
                <th>Timestamp</th>
                <th>Validation Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>On-Farm IoT Probe</td>
                <td>ESP32 Ground Station (Navalgund North)</td>
                <td>2026-09-18 - 2026-09-22</td>
                <td>Volumetric water content below 12% for 18 days</td>
                <td><span className="badge badge-approved">Verified Real Telemetry</span></td>
              </tr>
              <tr>
                <td>Automated Weather Station (AWS)</td>
                <td>India Meteorological Dept (IMD API Gateway)</td>
                <td>2026-09-22 06:00 UTC</td>
                <td>Zero precipitation across Dharwad block for 24 days</td>
                <td><span className="badge badge-approved">Oracle Authenticated</span></td>
              </tr>
              <tr>
                <td>Geotagged Photo Verification</td>
                <td>Field Agent Camera (EXIF Geotag Checked)</td>
                <td>2026-09-21 14:22 IST</td>
                <td>GPS coordinates match cadastral survey SY-442/1B</td>
                <td><span className="badge badge-approved">Geofence Match</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

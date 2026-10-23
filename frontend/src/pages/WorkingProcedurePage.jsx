import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Users,
  Compass,
  Cpu,
  Shield,
  Activity,
  Layers,
  Calculator,
  ArrowRight,
  Sprout,
  HelpCircle,
  FileCheck2,
  Lock,
  Clock
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function WorkingProcedurePage() {
  const { currentRole, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState("farmer");

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={28} />
            <span>Platform Working Procedure & Operating Manual</span>
          </h1>
          <p className="page-subtitle">
            Complete end-to-end operational guide for Farmers, Insurance Officers, System Administrators, and Regulatory Auditors.
          </p>
        </div>
      </div>

      {/* Persona Tab Switcher */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          type="button"
          className={`btn ${activeTab === "farmer" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("farmer")}
        >
          🌾 Farmer Journey
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "insurer" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("insurer")}
        >
          ⚖️ Insurance Officer Adjudication
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "admin" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("admin")}
        >
          ⚙️ System Administrator Operations
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "auditor" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("auditor")}
        >
          🔍 Auditor & Regulatory Oversight
        </button>
      </div>

      {/* Tab 1: Farmer Journey */}
      {activeTab === "farmer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ borderLeft: "4px solid var(--color-primary)" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Compass size={20} />
              <span>Farmer Operational Workflow (Zero-Hassle Claim Lifecycle)</span>
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              The AgriClaim Shield platform eliminates physical paperwork and bureaucratic delays for farmers. The complete operational lifecycle consists of 5 straightforward steps:
            </p>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {/* Step 1 */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>Land Plot & Crop Registration</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                • Navigate to <strong>Farm Registry</strong> and record survey numbers, land acreage, village, taluk, and soil profile.<br />
                • Choose your active crop from the 9 certified agronomic species (*Cotton, Paddy, Maize, Soybean, Wheat, Pulses, Sugarcane, Vegetables, Fruits*).<br />
                • Link your registered plot to an active insurance policy.
              </p>
              <Link to="/farms" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
                Go to Farm Registry &rarr;
              </Link>
            </div>

            {/* Step 2 */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>IoT Sensor Telemetry Pairing</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                • Link the in-situ <strong>ESP32 LoRaWAN field node</strong> installed on your plot.<br />
                • The sensor continuously streams soil moisture %, canopy surface temperature, and ambient humidity.<br />
                • If prolonged dry spells or excessive rain occur, the system automatically flags a parametric breach alert.
              </p>
              <Link to="/iot" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
                View IoT Telemetry &rarr;
              </Link>
            </div>

            {/* Step 3 */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>Submit Instant Digital Claim</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                • When an adverse weather or crop loss event occurs, open the <strong>Claim Wizard</strong>.<br />
                • Select the damaged plot, enter the damage date, and specify the primary loss cause.<br />
                • Upload geotagged crop foliage photographs with EXIF GPS coordinates for validation.
              </p>
              <Link to="/claim-wizard" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                Open Claim Submission Wizard &rarr;
              </Link>
            </div>

            {/* Step 4 */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  4
                </div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>Track 10-State Pipeline & Receive Payout</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                • Track your claim in real time from `Submitted` &rarr; `Evidence Validation` &rarr; `Under Review` &rarr; `Approved` &rarr; `Settled`.<br />
                • Every milestone is anchored to the Hyperledger Fabric blockchain with a tamper-proof cryptographic receipt.<br />
                • Approved parametric settlements are credited directly to your registered bank account.
              </p>
              <Link to="/claims" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
                Track My Claims &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Insurance Officer Adjudication */}
      {activeTab === "insurer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ borderLeft: "4px solid var(--color-accent-amber)" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-accent-amber)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={20} />
              <span>Insurance Officer Adjudication Procedure</span>
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Insurance officers hold statutory authority to verify multi-source evidence, evaluate parametric entitlement in compliance with PMFBY deductible rules, and execute legal state transitions.
            </p>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: 14 }}>Step-by-Step Officer Review Procedure</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <strong>Step 1: Multi-Source Triangulation</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Compare the farmer's claimed loss against IMD gridded meteorological rainfall data, in-situ IoT soil moisture readings, and satellite NDVI vegetation indexes.
                </p>
              </div>

              <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <strong>Step 2: Inspect Algorithmic Evidence (Section 25 Advisory)</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Inspect the AI damage estimate, weather correlation score, and anomaly screening index. Verify that the AI advice aligns with the registered crop's critical growth window.
                </p>
              </div>

              <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <strong>Step 3: PMFBY Parametric Payout Formula Evaluation</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Use the integrated Parametric Calculator. Formula: <code>Payout = Sum_Insured * ((Loss% - Deductible%) / (100% - Deductible%))</code>. Losses below the 10% policy deductible receive zero compensation.
                </p>
              </div>

              <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <strong>Step 4: Execute Authorized State Transition</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Enter mandatory officer justification remarks and click the authorized transition button (e.g. <em>Approve Claim</em>, <em>Request Additional Evidence</em>, or <em>Reject Claim</em>). The backend state machine validates graph invariants and emits an audit event.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Link to="/claim-reviews" className="btn btn-primary">
                Open Officer Adjudication Workspace &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Administrator */}
      {activeTab === "admin" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ borderLeft: "4px solid var(--color-info)" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-info)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Cpu size={20} />
              <span>System Administrator Operational Responsibilities</span>
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Administrators maintain system invariants, configure crop agronomic parameters, manage insurance policy templates, monitor IoT hardware registries, and enforce role-based access control.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            <div className="card">
              <h4 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Sprout size={18} color="var(--color-primary)" />
                <span>Crop Agronomic Configuration</span>
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Configure growth stages, duration cycles, drought soil moisture triggers, excess rainfall thresholds, and terminal heat stress limits for all 9 supported crops.
              </p>
              <Link to="/crop-config" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                Manage Crop Config &rarr;
              </Link>
            </div>

            <div className="card">
              <h4 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Users size={18} color="var(--color-primary)" />
                <span>User & RBAC Governance</span>
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Provision new user accounts, assign roles (Farmer, Insurer, Admin, Auditor), inspect login histories, and revoke unauthorized access.
              </p>
              <Link to="/users" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                Manage Users & Roles &rarr;
              </Link>
            </div>

            <div className="card">
              <h4 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Cpu size={18} color="var(--color-primary)" />
                <span>Sensor Device Inventory</span>
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Monitor ESP32 device health, battery levels, ping frequencies, LoRaWAN gateway connections, and CRC32 ingestion integrity.
              </p>
              <Link to="/devices" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                Manage Sensor Devices &rarr;
              </Link>
            </div>

            <div className="card">
              <h4 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Activity size={18} color="var(--color-primary)" />
                <span>Security & Audit Trails</span>
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Inspect centralized audit logs recording every API action, IP address, state transition, and cryptographic block confirmation.
              </p>
              <Link to="/audit-logs" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                Inspect Audit Logs &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Auditor & Regulatory Oversight */}
      {activeTab === "auditor" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ borderLeft: "4px solid var(--color-blockchain)" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-blockchain)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={20} />
              <span>Auditor & Regulatory Oversight Procedure</span>
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Independent auditors and government regulators (NAIC / PMFBY State Nodal Agencies) inspect cryptographic ledger blocks, verify Merkle tree roots, and audit state transitions without exposing proprietary AI model weights or sensitive farmer PII.
            </p>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: 14 }}>Auditor Verification Checklist</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong>Verify Hyperledger Fabric Block Integrity</strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                    Inspect the block sequence on channel <code>cropinsurancechannel</code>. Verify previous block hash chaining and multi-organization signatures (<code>Org1MSP</code> and <code>Org2MSP</code>).
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong>Execute Cryptographic Tamper Detection Test</strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                    Run the on-chain SHA-256 integrity check. The tool computes hashes across all historical transactions to confirm zero unauthorized block tampering.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong>Audit State Machine Adjacency & Role Authority</strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                    Trace the complete milestone history of any claim. Ensure no claim transitioned without authorized insurer or admin credentials, and verify that payout amounts adhered to PMFBY deductible formulas.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Link to="/blockchain" className="btn btn-primary" style={{ background: "var(--color-blockchain)", borderColor: "var(--color-blockchain)" }}>
                Open Blockchain Ledger Explorer &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

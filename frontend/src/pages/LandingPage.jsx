import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Sprout,
  Activity,
  Radio,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  PhoneCall,
  Clock,
  Compass,
  Cpu,
  Users,
  Calculator,
  Shield,
  Check
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function LandingPage() {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleFarmerAction = () => {
    if (user && (user.role === "FARMER" || user.role === "ADMIN")) {
      navigate("/claim-wizard");
    } else {
      navigate("/auth/farmer");
    }
  };

  const handleInsurerAction = () => {
    if (user && (user.role === "INSURER" || user.role === "ADMIN")) {
      navigate("/claim-reviews");
    } else {
      navigate("/auth/insurer");
    }
  };

  const handleRoleCard = (roleKey, authedPath) => {
    if (user && user.role?.toUpperCase() === roleKey.toUpperCase()) {
      navigate(authedPath);
    } else {
      navigate(`/auth/${roleKey.toLowerCase()}`);
    }
  };

  return (
    <div style={{ background: "var(--bg-app)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(180deg, #eef7ee 0%, var(--bg-app) 100%)",
        padding: "60px 24px 48px",
        borderBottom: "1px solid var(--border-light)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          {/* Trust Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            background: "#ffffff",
            borderRadius: "var(--radius-pill)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border-light)",
            marginBottom: 24,
            fontSize: "0.85rem",
            color: "var(--color-primary)",
            fontWeight: 600
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2e7d32", display: "inline-block" }} />
            <span>AI + In-Situ IoT + Hyperledger Fabric Blockchain | PMFBY Compliant</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            fontWeight: 800,
            color: "var(--color-primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: 950,
            margin: "0 auto 20px"
          }}>
            Real-Time Parametric Crop Insurance Claim Automation & Adjudication
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: 780,
            margin: "0 auto 32px"
          }}>
            Eliminating delayed crop insurance payouts for farmers through continuous in-situ soil & weather telemetry, edge AI damage screening, PMFBY parametric payout formulas, and immutable blockchain smart contract execution.
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "12px 24px", fontSize: "0.95rem" }}
              onClick={handleFarmerAction}
            >
              <span>🌾 {user ? "Submit Crop Claim" : "File Crop Claim (Farmer Login)"}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "12px 24px", fontSize: "0.95rem" }}
              onClick={handleInsurerAction}
            >
              <span>⚖️ {user ? "Claim Adjudication" : "Officer Portal (Insurer Login)"}</span>
            </button>

            <Link
              to="/working-procedure"
              className="btn btn-secondary"
              style={{ padding: "12px 24px", fontSize: "0.95rem" }}
            >
              <span>📖 Operating Guide</span>
            </Link>

            {!user && (
              <Link
                to="/auth"
                className="btn btn-secondary"
                style={{ padding: "12px 24px", fontSize: "0.95rem" }}
              >
                <span>🔐 Sign In / Register</span>
              </Link>
            )}
          </div>

          {/* Metrics Ticker */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            maxWidth: 1000,
            margin: "0 auto"
          }}>
            <div className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)" }}>₹2.8Cr+</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Parametric Payouts Settled</div>
            </div>

            <div className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)" }}>9 Crops</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Agronomic Rules & Thresholds</div>
            </div>

            <div className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)" }}>10-State FSM</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Strict Lifecycle Governance</div>
            </div>

            <div className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-blockchain)" }}>100%</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Fabric Cryptographic Audit</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 User Personas Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 10 }}>
            Unified Platform Tailored for All 4 Personas
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: 650, margin: "0 auto" }}>
            Role-based interfaces designed for the specific business workflows of farmers, insurers, administrators, and regulatory auditors.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {/* Farmer Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", borderTop: "4px solid var(--color-primary)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🌾</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Farmer (Producer)</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", flex: 1, lineHeight: 1.5 }}>
              Register farm plots, link in-situ IoT nodes, enroll in PMFBY policies, and submit geotagged claims with transparent real-time state tracking.
            </p>
            <ul style={{ fontSize: "0.8rem", color: "var(--text-main)", paddingLeft: 18, margin: "12px 0 16px", lineHeight: 1.6 }}>
              <li>Instant Geotagged Photo Upload</li>
              <li>Multi-Crop Season Management</li>
              <li>Live 10-State Lifecycle Tracker</li>
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => handleRoleCard("FARMER", "/farmer-dashboard")}
            >
              {user && user.role?.toUpperCase() === "FARMER" ? "Open Farmer Workspace →" : "Sign In / Register as Farmer →"}
            </button>
          </div>

          {/* Insurer Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", borderTop: "4px solid var(--color-accent-amber)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>⚖️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Insurance Officer</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", flex: 1, lineHeight: 1.5 }}>
              Triangulate claims against sensor telemetry and IMD rainfall, review AI condition assessments, calculate parametric payouts, and authorize state changes.
            </p>
            <ul style={{ fontSize: "0.8rem", color: "var(--text-main)", paddingLeft: 18, margin: "12px 0 16px", lineHeight: 1.6 }}>
              <li>Multi-Source Evidence Triangulation</li>
              <li>PMFBY Parametric Calculator</li>
              <li>FSM State Transition Authority</li>
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", background: "var(--color-primary-light)", borderColor: "var(--color-primary-light)" }}
              onClick={() => handleRoleCard("INSURER", "/claim-reviews")}
            >
              {user && user.role?.toUpperCase() === "INSURER" ? "Open Adjudication Portal →" : "Sign In as Insurance Officer →"}
            </button>
          </div>

          {/* Admin Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", borderTop: "4px solid var(--color-info)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>⚙️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>System Administrator</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", flex: 1, lineHeight: 1.5 }}>
              Maintain system invariants, configure crop agronomic parameters, manage sensor device registries, provision users, and monitor system health.
            </p>
            <ul style={{ fontSize: "0.8rem", color: "var(--text-main)", paddingLeft: 18, margin: "12px 0 16px", lineHeight: 1.6 }}>
              <li>9-Crop Agronomic Rule Tuning</li>
              <li>ESP32 Device Fleet Health</li>
              <li>Centralized RBAC Governance</li>
            </ul>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => handleRoleCard("ADMIN", "/admin-dashboard")}
            >
              {user && user.role?.toUpperCase() === "ADMIN" ? "Open Admin Console →" : "Sign In as Administrator →"}
            </button>
          </div>

          {/* Auditor Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", borderTop: "4px solid var(--color-blockchain)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🔍</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Auditor / Regulator</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", flex: 1, lineHeight: 1.5 }}>
              Audit immutable Hyperledger Fabric blocks, verify sensor telemetry Merkle tree proofs, run tamper detection tests, and trace historical decisions.
            </p>
            <ul style={{ fontSize: "0.8rem", color: "var(--text-main)", paddingLeft: 18, margin: "12px 0 16px", lineHeight: 1.6 }}>
              <li>Hyperledger Fabric Explorer</li>
              <li>Cryptographic Tamper Detection</li>
              <li>Section 25 IP Protected Auditing</li>
            </ul>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center", color: "var(--color-blockchain)", borderColor: "var(--color-blockchain)" }}
              onClick={() => handleRoleCard("AUDITOR", "/blockchain")}
            >
              {user && user.role?.toUpperCase() === "AUDITOR" ? "Open Audit Console →" : "Sign In as Govt. Auditor →"}
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step Working Procedure Section */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: 8 }}>
              <Clock size={16} />
              <span>Operational Blueprint</span>
            </div>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)" }}>
              End-to-End Parametric Claim Working Procedure
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            <div style={{ padding: 24, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: 8 }}>01</div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 8 }}>Plot & Sensor Setup</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Farmer registers land survey number, selects cultivated crop, and pairs the in-situ ESP32 LoRaWAN field node for continuous soil & meteorological tracking.
              </p>
            </div>

            <div style={{ padding: 24, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: 8 }}>02</div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 8 }}>Continuous Telemetry Ingestion</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Field sensors broadcast soil moisture, canopy temperature, and humidity frames verified by hardware CRC32 checksums and anchored as Merkle roots.
              </p>
            </div>

            <div style={{ padding: 24, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: 8 }}>03</div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 8 }}>Claim Filing & AI Screening</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Farmer files an instant claim with EXIF-tagged photos. The server-side AI engine assesses foliage wilting, cross-references IMD weather, and screens for anomalies.
              </p>
            </div>

            <div style={{ padding: 24, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: 8 }}>04</div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 8 }}>Adjudication & Settlement</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Insurance officer applies PMFBY deductible formulas, authorizes the finite state transition, and the blockchain records the tamper-proof settlement block.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/working-procedure" className="btn btn-secondary">
              Read Detailed Persona Operations Guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Technology Pillars */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 10 }}>
            Architectural Pillars of AgriClaim Shield
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: 650, margin: "0 auto" }}>
            Engineered for high resilience, offline rural tolerance, statutory PMFBY compliance, and complete IP protection.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          <div className="card" style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: 12, background: "var(--color-primary-soft)", color: "var(--color-primary)", borderRadius: "var(--radius-md)", height: "fit-content" }}>
              <Activity size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>Edge AI & Section 25 IP Confidentiality</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Computer vision damage screening and time-series anomaly detection operate strictly server-side behind least-privilege endpoints. Model weights and proprietary neural parameters are never leaked to client bundles.
              </p>
            </div>
          </div>

          <div className="card" style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: 12, background: "var(--color-primary-soft)", color: "var(--color-primary)", borderRadius: "var(--radius-md)", height: "fit-content" }}>
              <Radio size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>In-Situ IoT Telemetry with Hardware CRC32</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                ESP32 sensor probes monitor ground soil moisture and temperature with offline flash buffering and IEEE 802.3 CRC32 integrity verification against transmission noise.
              </p>
            </div>
          </div>

          <div className="card" style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: 12, background: "var(--color-blockchain-soft)", color: "var(--color-blockchain)", borderRadius: "var(--radius-md)", height: "fit-content" }}>
              <Layers size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>Hyperledger Fabric Permitted Ledger</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Consortium chaincode executes policy rules and records all state transitions. Endorsements from insurer and regulator MSPs prevent single-party claim repudiation.
              </p>
            </div>
          </div>

          <div className="card" style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: 12, background: "var(--color-amber-soft)", color: "var(--color-accent-amber)", borderRadius: "var(--radius-md)", height: "fit-content" }}>
              <Calculator size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>PMFBY Parametric Deductible Engine</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Accurate mathematical evaluation of loss percentage, policy deductible thresholds, and multi-crop stage vulnerabilities ensuring payouts are legally auditable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section style={{
        background: "var(--color-primary)",
        color: "#ffffff",
        padding: "50px 24px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 12, color: "#ffffff" }}>
            Experience the Future of Agricultural Insurance
          </h2>
          <p style={{ fontSize: "1rem", opacity: 0.9, lineHeight: 1.6, marginBottom: 28 }}>
            Whether you are a farmer cultivating cotton or paddy, an insurer adjudicating claims, or an auditor checking ledger immutability, AgriClaim Shield provides the complete digital workflow.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/auth"
              className="btn btn-secondary"
              style={{ background: "#ffffff", color: "var(--color-primary)", fontWeight: 700, padding: "12px 24px" }}
            >
              Sign In or Register Account
            </Link>
            <Link
              to="/working-procedure"
              className="btn btn-secondary"
              style={{ background: "transparent", color: "#ffffff", borderColor: "#ffffff", padding: "12px 24px" }}
            >
              Read Operating Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

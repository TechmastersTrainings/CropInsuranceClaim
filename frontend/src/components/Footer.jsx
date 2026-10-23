import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  Lock,
  Cpu,
  Layers,
  Sprout,
  Activity,
  Heart
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function Footer() {
  const { currentRole, switchRole, isOnline } = useApp();

  return (
    <footer style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border-light)",
      marginTop: "auto",
      padding: "40px 24px 24px",
      color: "var(--text-main)",
      fontSize: "0.85rem"
    }}>
      <div style={{
        maxWidth: 1300,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 32,
        marginBottom: 36
      }}>
        {/* Brand & Purpose */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              background: "var(--color-primary)",
              color: "#fff",
              padding: 6,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center"
            }}>
              <ShieldCheck size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--color-primary)" }}>
              AgriClaim Shield
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.5, fontSize: "0.825rem" }}>
            Real-time, parametric crop insurance claim automation platform powered by edge AI computer vision, in-situ IoT telemetry, and Hyperledger Fabric blockchain smart contracts.
          </p>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--color-primary-soft)",
            color: "var(--color-primary)",
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            fontSize: "0.75rem",
            fontWeight: 600,
            width: "fit-content"
          }}>
            <Lock size={12} /> Section 25 IP Protected Architecture
          </div>
        </div>

        {/* User Role Portals */}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 12, color: "var(--text-main)" }}>
            User Role Portals
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>
              <button
                type="button"
                onClick={() => switchRole("FARMER")}
                style={{ background: "none", border: "none", padding: 0, color: currentRole === "FARMER" ? "var(--color-primary)" : "var(--text-muted)", cursor: "pointer", fontWeight: currentRole === "FARMER" ? 700 : 400 }}
              >
                🌾 Farmer Dashboard {currentRole === "FARMER" && "(Active)"}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => switchRole("INSURER")}
                style={{ background: "none", border: "none", padding: 0, color: currentRole === "INSURER" ? "var(--color-primary)" : "var(--text-muted)", cursor: "pointer", fontWeight: currentRole === "INSURER" ? 700 : 400 }}
              >
                ⚖️ Insurance Officer Adjudication {currentRole === "INSURER" && "(Active)"}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => switchRole("ADMIN")}
                style={{ background: "none", border: "none", padding: 0, color: currentRole === "ADMIN" ? "var(--color-primary)" : "var(--text-muted)", cursor: "pointer", fontWeight: currentRole === "ADMIN" ? 700 : 400 }}
              >
                ⚙️ Administrator Control Console {currentRole === "ADMIN" && "(Active)"}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => switchRole("AUDITOR")}
                style={{ background: "none", border: "none", padding: 0, color: currentRole === "AUDITOR" ? "var(--color-primary)" : "var(--text-muted)", cursor: "pointer", fontWeight: currentRole === "AUDITOR" ? 700 : 400 }}
              >
                🔍 Auditor / Regulatory Explorer {currentRole === "AUDITOR" && "(Active)"}
              </button>
            </li>
            <li style={{ marginTop: 4 }}>
              <Link to="/auth" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                🔐 Sign In / Register Account &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Modules & Workflows */}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 12, color: "var(--text-main)" }}>
            Platform Modules
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>
              <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                Platform Homepage & Overview
              </Link>
            </li>
            <li>
              <Link to="/working-procedure" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                📖 End-to-End Working Procedure
              </Link>
            </li>
            <li>
              <Link to="/claim-wizard" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                Claim Submission Wizard
              </Link>
            </li>
            <li>
              <Link to="/claim-reviews" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                Claim Review Workspace
              </Link>
            </li>
            <li>
              <Link to="/ai-assessment" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                AI Computer Vision Assessment
              </Link>
            </li>
            <li>
              <Link to="/iot" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                IoT Telemetry Monitoring
              </Link>
            </li>
            <li>
              <Link to="/blockchain" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                Hyperledger Fabric Ledger
              </Link>
            </li>
          </ul>
        </div>

        {/* PMFBY Helpline & Technical Standards */}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 12, color: "var(--text-main)" }}>
            Support & Standards
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              padding: "10px 14px",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                PMFBY Kisan Call Center Helpline
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--color-primary)", marginTop: 2 }}>
                <PhoneCall size={14} />
                <span>1800-180-1551 (Toll-Free)</span>
              </div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              • 10-State Lifecycle FSM<br />
              • 9 Multi-Crop Agronomic Rules<br />
              • ISO 27001 & Section 25 Compliant<br />
              • SHA-256 Merkle Telemetry Proofs
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isOnline ? "var(--color-primary)" : "var(--color-accent-amber)"
              }} />
              <span style={{ color: "var(--text-muted)" }}>
                Fabric Node Status: <strong>{isOnline ? "Healthy & Synced" : "Offline Buffer Active"}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: 1300,
        margin: "0 auto",
        paddingTop: 18,
        borderTop: "1px solid var(--border-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        color: "var(--text-muted)",
        fontSize: "0.78rem"
      }}>
        <div>
          © 2026 <strong>AgriClaim Shield</strong> — Real-Time Crop Insurance Claim Automation Platform. Built with PMFBY standards.
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/working-procedure" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Operating Guide</Link>
          <Link to="/auth" style={{ color: "var(--text-muted)", textDecoration: "none" }}>User Authentication</Link>
          <Link to="/blockchain" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Blockchain Explorer</Link>
          <Link to="/settings" style={{ color: "var(--text-muted)", textDecoration: "none" }}>System Settings</Link>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import { ShieldCheck, User, Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const { switchRole } = useApp();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState("FARMER");
  const [email, setEmail] = useState("patil.farmer@agrishield.org");
  const [password, setPassword] = useState("••••••••••••");

  const handleRolePreset = (role, demoEmail) => {
    setSelectedRole(role);
    setEmail(demoEmail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    if (selectedRole === "FARMER") navigate("/farmer-dashboard");
    else if (selectedRole === "INSURER") navigate("/insurer-dashboard");
    else if (selectedRole === "ADMIN") navigate("/admin-dashboard");
    else navigate("/blockchain");
  };

  return (
    <div style={{
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div className="card" style={{ maxWidth: 480, width: "100%", padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-flex",
            padding: 12,
            background: "var(--color-primary-soft)",
            color: "var(--color-primary)",
            borderRadius: "var(--radius-md)",
            marginBottom: 12
          }}>
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", fontWeight: 700 }}>
            {isRegister ? "Register for AgriClaim Shield" : "Sign In to Platform"}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
            Parametric Crop Insurance Claim Automation Engine
          </p>
        </div>

        {/* Demo Fast Login Presets */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", marginBottom: 8 }}>
            Quick Demo Role Selection:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              className={`btn btn-sm ${selectedRole === "FARMER" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleRolePreset("FARMER", "patil.farmer@agrishield.org")}
            >
              Farmer Demo
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedRole === "INSURER" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleRolePreset("INSURER", "rajesh.kumar@naic.in")}
            >
              Insurer Officer
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedRole === "ADMIN" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleRolePreset("ADMIN", "admin.sunita@agrishield.org")}
            >
              System Admin
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedRole === "AUDITOR" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleRolePreset("AUDITOR", "v.sharma@agri.gov.in")}
            >
              Auditor / Govt
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Designated Role</label>
            <select
              className="form-control"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="FARMER">Farmer (Producer)</option>
              <option value="INSURER">Insurance Officer (Claims Reviewer)</option>
              <option value="ADMIN">System Administrator</option>
              <option value="AUDITOR">Auditor / Regulatory Authority</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
            <span>{isRegister ? "Complete Registration" : "Authenticate & Proceed"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-muted)" }}>
            {isRegister ? "Already have an account?" : "Need a new farmer or insurer account?"}{" "}
          </span>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-primary)",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0
            }}
          >
            {isRegister ? "Sign In" : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

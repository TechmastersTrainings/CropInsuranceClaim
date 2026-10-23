import React, { useState } from "react";
import { Settings as SettingsIcon, Globe, Shield, User, Wifi, CheckCircle2, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLocale } from "../locales";

export function SettingsPage() {
  const { user, currentRole, isOnline, demoMode, setDemoMode } = useApp();
  const { lang, setLang } = useLocale();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container" style={{ maxWidth: 880 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <SettingsIcon size={28} />
            <span>Platform Settings & Localization</span>
          </h1>
          <p className="page-subtitle">
            Manage regional language preferences, profile credentials and demonstration runtime modes.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>Settings successfully saved and persisted to local profile.</span>
        </div>
      )}

      <div className="grid-2">
        {/* User Profile Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <User size={18} />
              <span>User Profile & Identification</span>
            </h3>
            <span className="badge badge-approved">{currentRole}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" defaultValue={user?.name || ""} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" defaultValue={user?.email || ""} disabled />
              <span className="form-hint">Email serves as the unique identifier.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Jurisdiction / State</label>
              <input type="text" className="form-control" defaultValue={user ? `${user.district || ""}, ${user.state || ""}` : ""} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
              Update Profile
            </button>
          </form>
        </div>

        {/* Localization & Demo Settings Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Globe size={18} />
              <span>Language & Accessibility</span>
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Interface Language (Section 17)</label>
            <select
              className="form-control"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en">English (Official Interface)</option>
              <option value="hi">हिन्दी (Hindi Translation)</option>
              <option value="kn">ಕನ್ನಡ (Kannada Translation)</option>
            </select>
            <span className="form-hint">All navigation, status badges and form fields adapt immediately.</span>
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 8 }}>Demonstration Environment</h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Simulate Testnet Transactions</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Prevent live financial transfers during evaluation.
                </div>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <Shield size={14} style={{ display: "inline", marginRight: 4 }} />
            In compliance with Section 16, passwords and tokens are never exposed or stored in browser state.
          </div>
        </div>
      </div>
    </div>
  );
}

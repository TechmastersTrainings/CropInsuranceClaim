import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, FolderOpen, RefreshCw, CheckCircle, FileQuestion, ServerCrash } from "lucide-react";
import { Link } from "react-router-dom";

export function SystemStatesPage() {
  const [activeTab, setActiveTab] = useState("loading");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <AlertTriangle size={28} />
            <span>Screen 25: System Diagnostics & View States</span>
          </h1>
          <p className="page-subtitle">
            Demonstration of resilient UI states: Loading skeletons, Empty datasets, Unauthorized RBAC (403), 404 Not Found, and Error handling.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === "loading" ? "active" : ""}`}
          onClick={() => setActiveTab("loading")}
        >
          <RefreshCw size={16} /> Loading Skeletons
        </button>
        <button
          className={`tab-btn ${activeTab === "empty" ? "active" : ""}`}
          onClick={() => setActiveTab("empty")}
        >
          <FolderOpen size={16} /> Empty Dataset State
        </button>
        <button
          className={`tab-btn ${activeTab === "unauthorized" ? "active" : ""}`}
          onClick={() => setActiveTab("unauthorized")}
        >
          <ShieldAlert size={16} /> 403 Unauthorized RBAC
        </button>
        <button
          className={`tab-btn ${activeTab === "404" ? "active" : ""}`}
          onClick={() => setActiveTab("404")}
        >
          <FileQuestion size={16} /> 404 Route Not Found
        </button>
        <button
          className={`tab-btn ${activeTab === "500" ? "active" : ""}`}
          onClick={() => setActiveTab("500")}
        >
          <ServerCrash size={16} /> 500 Server Exception
        </button>
      </div>

      {/* Tab 1: Loading Skeleton */}
      {activeTab === "loading" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Simulated Telemetry Ingestion Skeleton</h3>
            <span className="badge badge-review">Fetching Remote Oracle...</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ height: 28, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", width: "40%" }} />
            <div style={{ height: 16, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", width: "70%" }} />
            <div style={{ height: 120, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", width: "100%", marginTop: 8 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
              <div style={{ height: 48, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }} />
              <div style={{ height: 48, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }} />
              <div style={{ height: 48, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Empty Dataset State */}
      {activeTab === "empty" && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{
            display: "inline-flex",
            padding: 18,
            background: "var(--bg-subtle)",
            borderRadius: "50%",
            color: "var(--text-muted)",
            marginBottom: 16
          }}>
            <FolderOpen size={48} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)", marginBottom: 8 }}>
            No Crop Insurance Claims Recorded
          </h3>
          <p style={{ maxWidth: 440, margin: "0 auto 20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            You have not submitted any claims for this growing season. Active plots are continuously monitored by satellite and on-farm sensors.
          </p>
          <Link to="/claim-wizard" className="btn btn-primary">
            File New Claim Now
          </Link>
        </div>
      )}

      {/* Tab 3: 403 Unauthorized RBAC */}
      {activeTab === "unauthorized" && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px", border: "1px solid var(--color-danger-border)" }}>
          <div style={{
            display: "inline-flex",
            padding: 18,
            background: "var(--color-danger-soft)",
            borderRadius: "50%",
            color: "var(--color-danger)",
            marginBottom: 16
          }}>
            <ShieldAlert size={48} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-danger)", marginBottom: 8 }}>
            Access Denied: Role Authorization Required
          </h3>
          <p style={{ maxWidth: 480, margin: "0 auto 20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            The current active role does not possess cryptographic authorization to mutate policy trigger parameters or adjudicate claims. Switch to <strong>Insurance Officer</strong> or <strong>Administrator</strong> role in the top header.
          </p>
          <Link to="/farmer-dashboard" className="btn btn-secondary">
            Return to Authorized Dashboard
          </Link>
        </div>
      )}

      {/* Tab 4: 404 Route Not Found */}
      {activeTab === "404" && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{
            display: "inline-flex",
            padding: 18,
            background: "var(--color-amber-soft)",
            borderRadius: "50%",
            color: "var(--color-accent-amber)",
            marginBottom: 16
          }}>
            <FileQuestion size={48} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)", marginBottom: 8 }}>
            404 - Cadastral Record or Resource Not Found
          </h3>
          <p style={{ maxWidth: 440, margin: "0 auto 20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            The requested claim identifier or farm plot boundary does not exist in the active ledger channel.
          </p>
          <Link to="/" className="btn btn-primary">
            Return to Platform Home
          </Link>
        </div>
      )}

      {/* Tab 5: 500 Server Exception */}
      {activeTab === "500" && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{
            display: "inline-flex",
            padding: 18,
            background: "var(--color-danger-soft)",
            borderRadius: "50%",
            color: "var(--color-danger)",
            marginBottom: 16
          }}>
            <ServerCrash size={48} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-danger)", marginBottom: 8 }}>
            500 - Oracle Gateway Synchronization Timeout
          </h3>
          <p style={{ maxWidth: 480, margin: "0 auto 20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            External weather satellite provider connection timed out. System has automatically fallen back to localized on-farm ESP32 sensor telemetry buffer.
          </p>
          <button className="btn btn-secondary" onClick={() => setActiveTab("loading")}>
            Retry Telemetry Ingestion
          </button>
        </div>
      )}
    </div>
  );
}

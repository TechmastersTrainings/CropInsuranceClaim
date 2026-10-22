import React from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Sprout, Sliders, Cpu, Layers, Activity, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StatCard } from "../components/StatCard";

export function AdminDashboard() {
  const { crops, policies, devices, ledger, claims } = useApp();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Shield size={28} />
            <span>Platform Governance & System Administration</span>
          </h1>
          <p className="page-subtitle">
            System health, multi-crop agronomic rules, policy parameter definitions and security audit trails.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          icon={Sprout}
          label="Registered Crop Species"
          value={crops.length}
          trend="Multi-Crop Architecture"
          trendType="positive"
        />
        <StatCard
          icon={Sliders}
          label="Parametric Policy Rules"
          value={policies.length}
          trend="Underwritten Templates"
          trendType="positive"
        />
        <StatCard
          icon={Cpu}
          label="Active Sensor Hardware"
          value={devices.length}
          trend="ESP32 & LoRaWAN"
          trendType="neutral"
        />
        <StatCard
          icon={Layers}
          label="Ledger Blocks Committed"
          value={`#${ledger[0]?.blockNumber || 10428}`}
          trend="Hyperledger Fabric Testnet"
          trendType="positive"
        />
      </div>

      {/* Administration Quick Access Modules */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sprout size={18} color="var(--color-primary)" />
              <span>Multi-Crop Agronomic Configuration</span>
            </h3>
            <Link to="/crop-config" className="btn btn-sm btn-primary">
              Configure Crops <ArrowRight size={14} />
            </Link>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Define species-specific vulnerability windows, thermal bounds, baseline soil moisture thresholds, and seasonal cycle lengths.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sliders size={18} color="var(--color-accent-amber)" />
              <span>Parametric Policy Trigger Builder</span>
            </h3>
            <Link to="/policy-config" className="btn btn-sm btn-primary">
              Configure Triggers <ArrowRight size={14} />
            </Link>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Formulate automated payout thresholds (e.g. Consecutive dry spell days, maximum thermal degrees, flash flood water levels).
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={18} color="var(--color-info)" />
              <span>Role-Based Access Control (RBAC)</span>
            </h3>
            <Link to="/users" className="btn btn-sm btn-primary">
              Manage Users <ArrowRight size={14} />
            </Link>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Provision and audit user roles: Farmer, Insurance Officer, System Administrator, and Regulatory Auditor.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={18} color="var(--color-blockchain)" />
              <span>System Security & Audit Trails</span>
            </h3>
            <Link to="/audit-logs" className="btn btn-sm btn-primary">
              View Audit Logs <ArrowRight size={14} />
            </Link>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Comprehensive traceability of administrative actions, claim adjudications, and oracle ingestions with IP tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

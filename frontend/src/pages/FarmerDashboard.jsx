import React from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Sprout,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Droplet,
  Thermometer,
  CloudRain
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLocale } from "../locales";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";

export function FarmerDashboard() {
  const { user, farms, claims, policies, telemetrySeries } = useApp();
  const { t } = useLocale();

  const totalArea = farms.reduce((sum, f) => sum + f.area, 0).toFixed(1);
  const myClaims = claims;
  const approvedTotal = myClaims
    .filter(c => c.status === "Approved" || c.status === "Settled")
    .reduce((sum, c) => sum + c.claimedAmount, 0);

  const latestTelemetry = telemetrySeries[telemetrySeries.length - 1] || { temp: 28, moisture: 16, rainfall: 0 };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Sprout size={28} />
            <span>Welcome, {user?.name || "Farmer"}</span>
          </h1>
          <p className="page-subtitle">
            {user?.district ? `${user.district}${user.state ? `, ${user.state}` : ""}` : "Registered Cultivator Portal"}
            {user?.aadhaarMasked ? ` | Aadhaar ID: ${user.aadhaarMasked}` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/claim-wizard" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>{t("nav_claim_wizard")}</span>
          </Link>
          <Link to="/farms" className="btn btn-secondary">
            <Compass size={18} />
            <span>{t("nav_farms")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          icon={Compass}
          label="Registered Land"
          value={`${totalArea} Acres`}
          trend={`${farms.length} Plots Monitored`}
          trendType="positive"
        />
        <StatCard
          icon={Sprout}
          label="Active Crop Cycles"
          value={farms.length}
          trend="Kharif 2026 Season"
          trendType="neutral"
        />
        <StatCard
          icon={CheckCircle2}
          label="Submitted Claims"
          value={myClaims.length}
          trend={`${myClaims.filter(c => c.status === 'Approved').length} Approved`}
          trendType="positive"
        />
        <StatCard
          icon={TrendingUp}
          label="Disbursed / Approved"
          value={`₹${approvedTotal.toLocaleString("en-IN")}`}
          trend="Direct Bank Transfer"
          trendType="positive"
        />
      </div>

      {/* Live Farm Environmental Health Banner */}
      <div className="card" style={{ marginBottom: 24, background: "linear-gradient(to right, #ffffff, #f4faf4)" }}>
        <div className="card-header">
          <div className="card-title">
            <Thermometer size={20} color="var(--color-primary)" />
            <span>Live Farm Microclimate & Sensor Reading</span>
          </div>
          <Link to="/iot" className="btn btn-sm btn-secondary">
            View Sensor Graphs <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid-3">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 10, borderRadius: "50%", background: "var(--color-amber-soft)", color: "var(--color-accent-amber)" }}>
              <Thermometer size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Ambient Temperature</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{latestTelemetry.temp}°C</div>
              <div style={{ fontSize: "0.75rem", color: latestTelemetry.temp > 38 ? "var(--color-danger)" : "var(--color-primary)" }}>
                {latestTelemetry.temp > 38 ? "Heat stress threshold approaching" : "Within normal vegetative range"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 10, borderRadius: "50%", background: "var(--color-info-soft)", color: "var(--color-info)" }}>
              <Droplet size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Volumetric Soil Moisture</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{latestTelemetry.moisture}%</div>
              <div style={{ fontSize: "0.75rem", color: latestTelemetry.moisture < 15 ? "var(--color-accent-amber)" : "var(--color-primary)" }}>
                {latestTelemetry.moisture < 15 ? "Low soil moisture: Parametric trigger risk" : "Adequate root moisture"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 10, borderRadius: "50%", background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
              <CloudRain size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Rainfall (24h Accumulated)</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{latestTelemetry.rainfall} mm</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Station: Navalgund Automatic Gauge
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Claims & Plots */}
      <div className="grid-2">
        {/* Recent Claims List */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <CheckCircle2 size={18} />
              <span>Recent Crop Claims</span>
            </h2>
            <Link to="/claims" className="btn btn-sm btn-secondary">
              View All Claims
            </Link>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Crop</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "28px 12px", color: "var(--text-muted)" }}>
                      <div>No claims filed yet.</div>
                      <Link to="/claim-wizard" style={{ fontSize: "0.85rem", color: "var(--color-primary)", marginTop: 4, display: "inline-block" }}>
                        Submit your first claim &rarr;
                      </Link>
                    </td>
                  </tr>
                ) : (
                  myClaims.slice(0, 4).map((claim) => (
                    <tr key={claim.id}>
                      <td>
                        <strong>{claim.id}</strong>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{claim.submissionDate}</div>
                      </td>
                      <td>{claim.crop}</td>
                      <td>₹{Number(claim.claimedAmount || 0).toLocaleString("en-IN")}</td>
                      <td><StatusBadge status={claim.status} /></td>
                      <td>
                        <Link to={`/claims/${claim.id}`} className="btn btn-sm btn-secondary">
                          Timeline
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Farm Plots */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Compass size={18} />
              <span>Monitored Farm Plots</span>
            </h2>
            <Link to="/farms" className="btn btn-sm btn-secondary">
              Manage Plots
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {farms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 12px", color: "var(--text-muted)" }}>
                <div>No farm plots registered in database yet.</div>
                <Link to="/farms" className="btn btn-sm btn-primary" style={{ marginTop: 10 }}>
                  + Register Your First Land Plot
                </Link>
              </div>
            ) : (
              farms.map((farm) => (
                <div
                  key={farm.id}
                  style={{
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{farm.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Survey No: {farm.surveyNo} | {farm.area} {farm.unit || "Acres"} | {farm.activeCrop}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-primary-light)" }}>
                      GPS: {farm.latitude}, {farm.longitude} ({farm.village})
                    </div>
                  </div>
                  <Link to={`/farms/${farm.id}`} className="btn btn-sm btn-primary">
                    Plot Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

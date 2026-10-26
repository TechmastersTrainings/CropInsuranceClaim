import React from "react";
import { useParams, Link } from "react-router-dom";
import { Compass, MapPin, Sprout, FileText, ArrowLeft, ShieldCheck, Thermometer, Droplet, Radio } from "lucide-react";
import { useApp } from "../context/AppContext";

export function FarmDetailsPage() {
  const { farmId } = useParams();
  const { farms, telemetrySeries } = useApp();

  const farm = farms.find(f => String(f.id) === String(farmId)) || farms[0];
  const latest = telemetrySeries[telemetrySeries.length - 1] || { temp: 28, moisture: 16 };

  if (!farm) {
    return (
      <div className="page-container">
        <div style={{ marginBottom: 16 }}>
          <Link to="/farms" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <ArrowLeft size={16} /> Back to Farm Registry
          </Link>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h3 style={{ marginBottom: 8 }}>Land Plot Not Found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No farm parcel matching ID "{farmId}" exists in the database.</p>
          <Link to="/farms" className="btn btn-primary" style={{ marginTop: 14 }}>
            Go to Farm Registry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: 16 }}>
        <Link to="/farms" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <ArrowLeft size={16} /> Back to Farm Registry
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Compass size={28} />
            <span>{farm.name}</span>
          </h1>
          <p className="page-subtitle">
            Survey No: {farm.surveyNo} | Plot ID: {farm.id} | Location: {farm.village}, {farm.district}, {farm.state}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/claim-wizard" className="btn btn-primary">
            File Claim For This Plot
          </Link>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Geographical Metadata</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Total Area:</span>
              <strong>{farm.area} {farm.unit}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Latitude:</span>
              <span>{farm.latitude}° N</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Longitude:</span>
              <span>{farm.longitude}° E</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Soil Type:</span>
              <span>{farm.soilType}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Irrigation:</span>
              <span>{farm.irrigation}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Crop Cycle</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Crop Variety:</span>
              <strong style={{ color: "var(--color-primary)" }}>{farm.activeCrop}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Sowing Date:</span>
              <span>{farm.sowingDate || "2026-06-15"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Expected Harvest:</span>
              <span>{farm.expectedHarvest || "2026-11-20"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Growth Stage:</span>
              <span className="badge badge-approved">Flowering & Boll Formation</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Live Sensor Node</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Node ID:</span>
              <strong style={{ fontFamily: "var(--font-mono)" }}>ESP-DEV-001</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Node Status:</span>
              <span className="badge badge-approved">Online (2m ago)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Soil Moisture:</span>
              <strong>{latest.moisture}%</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Surface Temp:</span>
              <strong>{latest.temp}°C</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Cadastral Visual Representation */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Cadastral Boundary Map & Drone Survey Polygon</h3>
          <span className="badge badge-draft">Geofence Verified</span>
        </div>
        <div style={{
          height: 220,
          background: "#e8f5e9",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          border: "1px dashed var(--color-primary-light)"
        }}>
          {/* Simulated Satellite/Cadastral SVG Polygon */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <polygon
              points="120,40 450,25 680,180 320,200"
              fill="rgba(46, 125, 50, 0.25)"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
            />
            <circle cx="390" cy="110" r="6" fill="var(--color-accent-amber)" />
            <text x="405" y="115" fill="var(--color-primary)" fontSize="12" fontWeight="600">
              Sensor Node ESP-001 (Center Field)
            </text>
          </svg>
          <div style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            background: "rgba(255,255,255,0.9)",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.78rem"
          }}>
            Survey Coordinates: Lat {farm.latitude}°N, Long {farm.longitude}°E | Accuracy: ±1.2m
          </div>
        </div>
      </div>
    </div>
  );
}

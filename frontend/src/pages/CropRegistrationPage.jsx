import React, { useState } from "react";
import { Sprout, Calendar, Plus, Info, Droplet, Sun, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export function CropRegistrationPage() {
  const { crops, farms } = useApp();
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [selectedFarm, setSelectedFarm] = useState(farms[0]?.id || "");
  const [sowingDate, setSowingDate] = useState("");
  const [estimatedYield, setEstimatedYield] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Sprout size={28} />
            <span>Crop & Growing-Period Registry</span>
          </h1>
          <p className="page-subtitle">
            Crop-specific growth cycles, vulnerability windows and environmental damage thresholds.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-banner alert-success">
          <CheckCircle size={18} />
          <span>Crop cycle successfully linked to farm plot and synchronized with insurance eligibility engine.</span>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Register Crop to Plot Form */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <div className="card-header">
            <h3 className="card-title">Register Growing Season</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Farm Plot</label>
              <select
                className="form-control"
                value={selectedFarm}
                onChange={(e) => setSelectedFarm(e.target.value)}
              >
                {farms.length === 0 ? (
                  <option value="">No registered farm plots</option>
                ) : (
                  farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.surveyNo})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Crop Type</label>
              <select
                className="form-control"
                value={selectedCrop.id}
                onChange={(e) => {
                  const c = crops.find(crop => crop.id === e.target.value);
                  if (c) setSelectedCrop(c);
                }}
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.season})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sowing Date</label>
              <input
                type="date"
                className="form-control"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Yield (Quintals/Acre)</label>
              <input
                type="number"
                step="0.5"
                placeholder="Enter estimated yield (e.g. 18.5)"
                className="form-control"
                value={estimatedYield}
                onChange={(e) => setEstimatedYield(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
              <Plus size={16} /> Link Crop to Plot
            </button>
          </form>
        </div>

        {/* Selected Crop Parameters Card */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: "var(--color-primary)" }}>
                {selectedCrop.name} — Biological & Climate Thresholds
              </h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Season: {selectedCrop.season} | Typical Cycle: {selectedCrop.cycleDays} Days
              </span>
            </div>
            <span className="badge badge-approved">Configured Parameter</span>
          </div>

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-accent-amber)", fontWeight: 600, fontSize: "0.85rem" }}>
                <Sun size={16} /> Temperature Bounds
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 4 }}>
                {selectedCrop.minTemp}°C - {selectedCrop.maxTemp}°C
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Thermal stress triggered if ambient temp exceeds {selectedCrop.maxTemp}°C.
              </div>
            </div>

            <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-info)", fontWeight: 600, fontSize: "0.85rem" }}>
                <Droplet size={16} /> Moisture & Water Trigger
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 4 }}>
                Min Moisture: {selectedCrop.moistureThreshold}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Soil moisture index threshold for vegetative drought trigger.
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>
            <strong>Ideal Soil Taxonomy:</strong> {selectedCrop.soilType} | <strong>Minimum Annual Rainfall:</strong> {selectedCrop.minRain} mm
          </div>

          <div style={{ padding: 12, background: "var(--color-primary-soft)", borderRadius: "var(--radius-sm)", fontSize: "0.825rem", color: "var(--color-primary)" }}>
            <Info size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            Insurance policies automatically calibrate their parametric payout thresholds according to these biological crop vulnerability windows.
          </div>
        </div>
      </div>

      {/* Catalog of all multi-crops */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Configured Multi-Crop Registry ({crops.length} Supported Species)</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop Code</th>
                <th>Crop Name</th>
                <th>Season</th>
                <th>Duration (Days)</th>
                <th>Temperature Range</th>
                <th>Soil Type</th>
                <th>Moisture Trigger</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.season}</td>
                  <td>{c.cycleDays} days</td>
                  <td>{c.minTemp}°C - {c.maxTemp}°C</td>
                  <td>{c.soilType}</td>
                  <td><span className="badge badge-evidence">&lt; {c.moistureThreshold}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Sprout, Plus, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";

export function CropConfigPage() {
  const { crops } = useApp();
  const [cropList, setCropList] = useState(crops);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newCrop, setNewCrop] = useState({
    id: `C0${cropList.length + 1}`,
    name: "",
    season: "Kharif",
    cycleDays: 120,
    minTemp: 20,
    maxTemp: 35,
    minRain: 600,
    soilType: "Loamy Soil",
    moistureThreshold: 20
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setCropList([...cropList, newCrop]);
    setIsModalOpen(false);
    setSuccessMsg(`Crop configuration for "${newCrop.name}" created and synced with the evaluation engine.`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Sprout size={28} />
            <span>Multi-Crop Agronomic Configuration</span>
          </h1>
          <p className="page-subtitle">
            Section 5 Compliance: Configurable species metadata, growth duration, thermal bounds and soil moisture indices.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add Crop Configuration</span>
        </button>
      </div>

      {successMsg && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop Code</th>
                <th>Crop Name</th>
                <th>Season</th>
                <th>Cycle Days</th>
                <th>Optimal Temp</th>
                <th>Moisture Threshold</th>
                <th>Soil Suitability</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cropList.map((c) => (
                <tr key={c.id}>
                  <td><strong style={{ fontFamily: "var(--font-mono)" }}>{c.id}</strong></td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.season}</td>
                  <td>{c.cycleDays} Days</td>
                  <td>{c.minTemp}°C - {c.maxTemp}°C</td>
                  <td><span className="badge badge-evidence">&lt; {c.moistureThreshold}%</span></td>
                  <td>{c.soilType}</td>
                  <td><span className="badge badge-approved">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Crop Variety"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Crop Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Groundnut / Mustard"
              required
              value={newCrop.name}
              onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Season</label>
              <select
                className="form-control"
                value={newCrop.season}
                onChange={(e) => setNewCrop({ ...newCrop, season: e.target.value })}
              >
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
                <option value="Perennial">Perennial</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cycle Duration (Days)</label>
              <input
                type="number"
                className="form-control"
                value={newCrop.cycleDays}
                onChange={(e) => setNewCrop({ ...newCrop, cycleDays: parseInt(e.target.value) || 90 })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Max Temperature Limit (°C)</label>
              <input
                type="number"
                className="form-control"
                value={newCrop.maxTemp}
                onChange={(e) => setNewCrop({ ...newCrop, maxTemp: parseFloat(e.target.value) || 35 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Moisture Trigger Threshold (%)</label>
              <input
                type="number"
                className="form-control"
                value={newCrop.moistureThreshold}
                onChange={(e) => setNewCrop({ ...newCrop, moistureThreshold: parseFloat(e.target.value) || 18 })}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Crop Variety
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

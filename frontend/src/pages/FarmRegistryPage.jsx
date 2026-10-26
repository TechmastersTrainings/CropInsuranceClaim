import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Plus, MapPin, FileCheck, Search, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";

export function FarmRegistryPage() {
  const { farms, addFarm } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New plot form state (strictly empty defaults)
  const [formData, setFormData] = useState({
    name: "",
    surveyNo: "",
    area: "",
    unit: "Acres",
    latitude: "",
    longitude: "",
    village: "",
    district: "",
    state: "",
    soilType: "",
    irrigation: "",
    activeCrop: "",
    documentRef: ""
  });

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    await addFarm({
      ...formData,
      area: parseFloat(formData.area) || 1.0
    });
    setFormData({
      name: "",
      surveyNo: "",
      area: "",
      unit: "Acres",
      latitude: "",
      longitude: "",
      village: "",
      district: "",
      state: "",
      soilType: "",
      irrigation: "",
      activeCrop: "",
      documentRef: ""
    });
    setIsModalOpen(false);
  };

  const filteredFarms = farms.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.surveyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Compass size={28} />
            <span>Farm Land Registry</span>
          </h1>
          <p className="page-subtitle">
            Cadastral survey plots, soil taxonomy and geographical boundary records.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Register New Farm Plot</span>
        </button>
      </div>

      {/* Search and Filter bar */}
      <div className="card" style={{ padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by farm plot name, survey number, or village..."
              style={{ paddingLeft: 36 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Farm Plots Grid */}
      {filteredFarms.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "50px 24px", border: "1px dashed var(--border-light)" }}>
          <Compass size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "var(--text-main)" }}>
            No Farm Plots Registered in Database
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 460, margin: "0 auto 20px" }}>
            You have not registered any cadastral land parcels yet. Click below to record your first survey plot. It will be saved directly into your database.
          </p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Register Your First Farm Plot
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredFarms.map((farm) => (
            <div key={farm.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ fontSize: "1rem" }}>{farm.name}</h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ID: {farm.id}</span>
                </div>
                <span className="badge badge-approved">{farm.activeCrop}</span>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Survey Number:</span>
                  <strong>{farm.surveyNo}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Cultivated Area:</span>
                  <strong>{farm.area} {farm.unit || "Acres"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Location:</span>
                  <span>{farm.village}, {farm.district}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Soil Classification:</span>
                  <span>{farm.soilType}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Irrigation Method:</span>
                  <span>{farm.irrigation}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary-light)", fontSize: "0.78rem", marginTop: 4 }}>
                  <MapPin size={14} /> GPS: {farm.latitude}°N, {farm.longitude}°E
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <FileCheck size={14} /> Land Title Verified
                </span>
                <Link to={`/farms/${farm.id}`} className="btn btn-sm btn-primary">
                  View Plot Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Farm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Agricultural Plot"
      >
        <form onSubmit={handleCreateFarm}>
          <div className="form-group">
            <label className="form-label">Plot Name / Identification</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter plot identification name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Official Survey Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter cadastral survey number"
                required
                value={formData.surveyNo}
                onChange={(e) => setFormData({ ...formData, surveyNo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Enter area in acres"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Village / Taluk</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter village or taluk"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter district"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Soil Classification</label>
              <select
                className="form-control"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
                <option value="">-- Select Soil Classification --</option>
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Red Laterite">Red Laterite</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Irrigation System</label>
              <select
                className="form-control"
                value={formData.irrigation}
                onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
              >
                <option value="">-- Select Irrigation Method --</option>
                <option value="Borewell + Drip Irrigation">Borewell + Drip Irrigation</option>
                <option value="Canal Fed">Canal Fed</option>
                <option value="Rainfed">Rainfed</option>
                <option value="Sprinkler">Sprinkler</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Crop</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter cultivated crop (e.g. Cotton, Paddy, Maize)"
              value={formData.activeCrop}
              onChange={(e) => setFormData({ ...formData, activeCrop: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Plot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

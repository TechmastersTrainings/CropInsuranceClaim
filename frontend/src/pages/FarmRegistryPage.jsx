import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Plus, MapPin, FileCheck, Search, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";

export function FarmRegistryPage() {
  const { farms, addFarm } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New plot form state
  const [formData, setFormData] = useState({
    name: "",
    surveyNo: "",
    area: "",
    unit: "Acres",
    latitude: "15.3647",
    longitude: "75.1240",
    village: "",
    district: "Dharwad",
    state: "Karnataka",
    soilType: "Black Cotton Soil",
    irrigation: "Borewell + Drip",
    activeCrop: "Cotton",
    documentRef: "DOC-NEW-UPLOAD.pdf"
  });

  const handleCreateFarm = (e) => {
    e.preventDefault();
    addFarm({
      ...formData,
      area: parseFloat(formData.area) || 2.5
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
                <strong>{farm.area} {farm.unit}</strong>
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
              placeholder="e.g. Cauvery Riverbank Section A"
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
                placeholder="e.g. SY-304/2A"
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
                placeholder="e.g. 3.5"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Village / Town</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Navalgund"
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
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Soil Classification</label>
              <select
                className="form-control"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
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
              placeholder="e.g. Cotton, Paddy, Soybean"
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

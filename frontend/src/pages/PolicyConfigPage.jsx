import React, { useState } from "react";
import { Sliders, Plus, CheckCircle2, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";

export function PolicyConfigPage() {
  const { policies, crops } = useApp();
  const [policyList, setPolicyList] = useState(policies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newPolicy, setNewPolicy] = useState({
    id: `POL-NEW-${Math.floor(100 + Math.random() * 900)}`,
    title: "",
    provider: "National Agri-Insurance Corp (NAIC)",
    licenseNo: "IRDAI/NL-104/AGRI",
    crop: "Wheat",
    season: "Rabi 2026-27",
    premiumPerAcre: 1100,
    coveragePerAcre: 32000,
    triggerParameter: "Terminal Heat > 36°C for 4 days during grain filling",
    deductiblePercent: 5,
    status: "Active",
    validUntil: "2027-03-31"
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setPolicyList([...policyList, newPolicy]);
    setIsModalOpen(false);
    setSuccessMsg(`Parametric policy "${newPolicy.title}" published and registered to smart contract catalog.`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Sliders size={28} />
            <span>Parametric Policy Trigger Configuration</span>
          </h1>
          <p className="page-subtitle">
            Configure algorithmic payout triggers, coverage limits and underwriter licensing credentials.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>New Policy Configuration</span>
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
                <th>Policy ID</th>
                <th>Policy Title</th>
                <th>Crop</th>
                <th>Premium / Acre</th>
                <th>Coverage / Acre</th>
                <th>Parametric Trigger Rule</th>
                <th>Underwriter License</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {policyList.map((p) => (
                <tr key={p.id}>
                  <td><strong style={{ fontFamily: "var(--font-mono)" }}>{p.id}</strong></td>
                  <td><strong>{p.title}</strong></td>
                  <td><span className="badge badge-approved">{p.crop}</span></td>
                  <td>₹{p.premiumPerAcre.toLocaleString()}</td>
                  <td><strong>₹{p.coveragePerAcre.toLocaleString()}</strong></td>
                  <td>
                    <div style={{ fontSize: "0.8rem", maxWidth: 280, color: "var(--text-main)" }}>
                      {p.triggerParameter}
                    </div>
                  </td>
                  <td><span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>{p.licenseNo}</span></td>
                  <td><span className="badge badge-approved">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Parametric Policy Template"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Policy Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rabi Wheat Terminal Heat Wave Shield"
              required
              value={newPolicy.title}
              onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Applicable Crop</label>
              <select
                className="form-control"
                value={newPolicy.crop}
                onChange={(e) => setNewPolicy({ ...newPolicy, crop: e.target.value })}
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Growing Season</label>
              <input
                type="text"
                className="form-control"
                value={newPolicy.season}
                onChange={(e) => setNewPolicy({ ...newPolicy, season: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Premium Rate (₹ / Acre)</label>
              <input
                type="number"
                className="form-control"
                value={newPolicy.premiumPerAcre}
                onChange={(e) => setNewPolicy({ ...newPolicy, premiumPerAcre: parseFloat(e.target.value) || 1000 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Coverage (₹ / Acre)</label>
              <input
                type="number"
                className="form-control"
                value={newPolicy.coveragePerAcre}
                onChange={(e) => setNewPolicy({ ...newPolicy, coveragePerAcre: parseFloat(e.target.value) || 30000 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Parametric Index Trigger Wording</label>
            <textarea
              className="form-control"
              rows={2}
              value={newPolicy.triggerParameter}
              onChange={(e) => setNewPolicy({ ...newPolicy, triggerParameter: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Policy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

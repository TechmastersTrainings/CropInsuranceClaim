import React, { useState } from "react";
import { Cpu, Plus, Wifi, Battery, RefreshCw, Key, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";

export function DeviceManagementPage() {
  const { devices, farms } = useApp();
  const [deviceList, setDeviceList] = useState(devices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotateSuccess, setRotateSuccess] = useState(false);

  const [newDevice, setNewDevice] = useState({
    id: "",
    farm: farms[0]?.name || "Navalgund Plot",
    type: "ESP32 Solar Probe",
    battery: "100%",
    signal: "Strong (WiFi)",
    status: "Online",
    lastSync: "Just now"
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setDeviceList([...deviceList, newDevice]);
    setIsModalOpen(false);
  };

  const handleRotateKey = (devId) => {
    setRotateSuccess(true);
    setTimeout(() => setRotateSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Cpu size={28} />
            <span>IoT Sensor & Gateway Device Management</span>
          </h1>
          <p className="page-subtitle">
            Authenticated hardware identities, cryptographic telemetry keys and connectivity diagnostics.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Provision New Sensor Node</span>
        </button>
      </div>

      {rotateSuccess && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>Device ingestion token rotated successfully. Firmware OTA signature re-generated.</span>
        </div>
      )}

      {/* Devices Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Hardware Type</th>
                <th>Assigned Farm Plot</th>
                <th>Battery Level</th>
                <th>Signal</th>
                <th>Status</th>
                <th>Last Ping</th>
                <th>Security Actions</th>
              </tr>
            </thead>
            <tbody>
              {deviceList.map((dev) => (
                <tr key={dev.id}>
                  <td>
                    <strong style={{ fontFamily: "var(--font-mono)" }}>{dev.id}</strong>
                  </td>
                  <td>{dev.type}</td>
                  <td>{dev.farm}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Battery size={16} color={parseInt(dev.battery) < 30 ? "var(--color-danger)" : "var(--color-primary)"} />
                      <span>{dev.battery}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
                      <Wifi size={14} color="var(--color-primary-light)" />
                      <span>{dev.signal}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${dev.status === "Online" ? "badge-approved" : dev.status === "Warning" ? "badge-review" : "badge-rejected"}`}>
                      {dev.status}
                    </span>
                  </td>
                  <td>{dev.lastSync}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleRotateKey(dev.id)}
                      title="Rotate Telemetry Key"
                    >
                      <Key size={14} /> Rotate Token
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision In-Situ Sensor Probe"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Hardware Device ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. ESP-DEV-005"
              required
              value={newDevice.id}
              onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Farm Plot</label>
            <select
              className="form-control"
              value={newDevice.farm}
              onChange={(e) => setNewDevice({ ...newDevice, farm: e.target.value })}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.surveyNo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Hardware Profile</label>
            <select
              className="form-control"
              value={newDevice.type}
              onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
            >
              <option value="ESP32 Solar Probe (Soil + Temp)">ESP32 Solar Probe (Soil + Temp)</option>
              <option value="LoRaWAN Micro Weather Station">LoRaWAN Micro Weather Station</option>
              <option value="Automated Rain Tipping Bucket">Automated Rain Tipping Bucket</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Provision Device
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

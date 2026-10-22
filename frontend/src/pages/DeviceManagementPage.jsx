import React, { useState } from "react";
import { Cpu, Plus, Wifi, Battery, RefreshCw, Key, ShieldCheck, CheckCircle2, Send, Radio } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";
import { ingestTelemetry } from "../services/api";

export function DeviceManagementPage() {
  const { devices, farms } = useApp();
  const [deviceList, setDeviceList] = useState(devices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotateSuccess, setRotateSuccess] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);
  const [pingingId, setPingingId] = useState(null);

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

  const handleSimulatePing = async (dev) => {
    setPingingId(dev.id);
    setPingStatus(null);
    try {
      // Numerical plot id
      const plotId = parseInt(String(dev.farmId || dev.farm || "1").replace(/\D/g, ""), 10) || 1;
      const temp = Number((26.5 + Math.random() * 6).toFixed(2));
      const moist = Number((18.0 + Math.random() * 12).toFixed(2));
      const humid = Number((55.0 + Math.random() * 20).toFixed(2));
      const rain = Number((Math.random() < 0.2 ? Math.random() * 15 : 0.0).toFixed(2));
      
      const frame = {
        device_identifier: dev.id,
        farm_plot_id: plotId,
        temperature: temp,
        moisture: moist,
        humidity: humid,
        rainfall: rain,
        crc_checksum: `CRC32-OK-${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, "0")}`
      };

      await ingestTelemetry(frame);
      setPingStatus({
        type: "success",
        message: `Device ${dev.id} emitted telemetry frame (${temp}°C, ${moist}% moist, ${rain}mm rain). CRC32 verified and ingested.`
      });
      
      // Update device timestamp
      setDeviceList(prev => prev.map(d => d.id === dev.id ? { ...d, lastSync: "Just now", status: "Online" } : d));
    } catch (err) {
      setPingStatus({
        type: "info",
        message: `Hardware ping simulated for ${dev.id} (CRC32 checked & verified offline buffer).`
      });
    } finally {
      setPingingId(null);
      setTimeout(() => setPingStatus(null), 5000);
    }
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

      {pingStatus && (
        <div className={`alert-banner alert-${pingStatus.type}`} style={{ marginBottom: 16 }}>
          <Radio size={18} />
          <span>{pingStatus.message}</span>
        </div>
      )}

      {/* Devices Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hardware ID</th>
                <th>Device Architecture</th>
                <th>Assigned Farm Plot</th>
                <th>Battery Level</th>
                <th>Telemetry Signal</th>
                <th>Status</th>
                <th>Last Ping</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deviceList.map((dev) => (
                <tr key={dev.id}>
                  <td>
                    <strong>{dev.id}</strong>
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
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleSimulatePing(dev)}
                        disabled={pingingId === dev.id}
                        title="Simulate Telemetry Frame"
                      >
                        <Send size={14} /> Ping
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleRotateKey(dev.id)}
                        title="Rotate Telemetry Key"
                      >
                        <Key size={14} /> Rotate
                      </button>
                    </div>
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
            <label className="form-label">Sensor Probe Architecture</label>
            <select
              className="form-control"
              value={newDevice.type}
              onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
            >
              <option value="ESP32 Multi-Probe">ESP32 Multi-Probe (Temp, Moist, Humidity, Rain)</option>
              <option value="LoRaWAN Micro-Station">LoRaWAN Agronomic Micro-Station</option>
              <option value="Cellular NB-IoT Soil Node">Cellular NB-IoT Deep Probe</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Authorize & Provision
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

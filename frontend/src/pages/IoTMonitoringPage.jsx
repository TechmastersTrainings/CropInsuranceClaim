import React, { useState } from "react";
import { Radio, Thermometer, Droplet, CloudRain, Wind, AlertCircle, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export function IoTMonitoringPage() {
  const { telemetrySeries, farms } = useApp();
  const [selectedFarm, setSelectedFarm] = useState(farms[0]?.id || "");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Radio size={28} />
            <span>IoT Farm Microclimate Telemetry</span>
          </h1>
          <p className="page-subtitle">
            Real-time streaming telemetry from in-situ soil probes, ambient sensors and rain gauges.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} className={isRefreshing ? "spin-animation" : ""} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Farm Selector Bar */}
      <div className="card" style={{ padding: "12px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
            Monitored Farm Plot:
          </label>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (Survey: {f.surveyNo}, Crop: {f.activeCrop})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Telemetry Charts */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Soil Moisture Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Droplet size={18} color="var(--color-info)" />
              <span>Volumetric Soil Moisture (%) vs Drought Trigger</span>
            </h3>
            <span className="badge badge-evidence">Critical Trigger: 15%</span>
          </div>
          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer>
              <LineChart data={telemetrySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e8e1" />
                <XAxis dataKey="time" stroke="#536b56" fontSize={12} />
                <YAxis domain={[0, 40]} stroke="#536b56" fontSize={12} unit="%" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  name="Soil Moisture (%)"
                  stroke="#0288d1"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 8 }}>
            Drought threshold warning activated between 12:00 and 21:00 as soil water content dipped below 15%.
          </div>
        </div>

        {/* Temperature & Humidity Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Thermometer size={18} color="var(--color-accent-amber)" />
              <span>Ambient Temperature (°C) & Humidity (%)</span>
            </h3>
            <span className="badge badge-approved">Calibrated</span>
          </div>
          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer>
              <LineChart data={telemetrySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e8e1" />
                <XAxis dataKey="time" stroke="#536b56" fontSize={12} />
                <YAxis yAxisId="left" domain={[15, 45]} stroke="#d84315" fontSize={12} unit="°C" />
                <YAxis yAxisId="right" orientation="right" domain={[20, 100]} stroke="#2e7d32" fontSize={12} unit="%" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  name="Temperature (°C)"
                  stroke="#d84315"
                  strokeWidth={2.5}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  name="Relative Humidity (%)"
                  stroke="#2e7d32"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 8 }}>
            Peak thermal stress observed at 15:00 reaching 39.8°C with concurrent low humidity (36%).
          </div>
        </div>
      </div>

      {/* Raw Ingestion Logs */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Latest Authenticated Ingestion Frames</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Frame ID</th>
                <th>Device ID</th>
                <th>Timestamp</th>
                <th>Temperature</th>
                <th>Moisture</th>
                <th>Humidity</th>
                <th>Rainfall</th>
                <th>Quality Code</th>
              </tr>
            </thead>
            <tbody>
              {telemetrySeries.map((t, idx) => (
                <tr key={idx}>
                  <td><strong>FRM-2026-9{idx}</strong></td>
                  <td>ESP-DEV-001</td>
                  <td>Today, {t.time} IST</td>
                  <td>{t.temp}°C</td>
                  <td><strong>{t.moisture}%</strong></td>
                  <td>{t.humidity}%</td>
                  <td>{t.rainfall} mm</td>
                  <td><span className="badge badge-approved">Q1 (Valid CRC)</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

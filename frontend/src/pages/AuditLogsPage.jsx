import React, { useState } from "react";
import { Shield, Download, Search, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";

export function AuditLogsPage() {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = auditLogs.filter(log =>
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Log ID", "Timestamp", "Actor", "Role", "Action", "Target", "IP Address"];
    const rows = filtered.map(l => [l.id, `"${l.timestamp}"`, `"${l.actor}"`, `"${l.role}"`, `"${l.action}"`, `"${l.target}"`, `"${l.ip}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Shield size={28} />
            <span>Immutable System Audit Trail</span>
          </h1>
          <p className="page-subtitle">
            Section 16 Compliance: Security-sensitive action logs, adjudication decisions and oracle telemetry ingestion.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} /> Export Audit CSV
        </button>
      </div>

      <div className="card" style={{ padding: "12px 18px", marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: 11, color: "var(--text-muted)" }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search audit trail by actor email, action, or target entity..."
            style={{ paddingLeft: 34 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Actor Email</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Target Object</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td><strong style={{ fontFamily: "var(--font-mono)" }}>#{log.id}</strong></td>
                  <td>{log.timestamp}</td>
                  <td><strong>{log.actor}</strong></td>
                  <td><span className="badge badge-draft">{log.role}</span></td>
                  <td>{log.action}</td>
                  <td><strong style={{ color: "var(--color-primary)" }}>{log.target}</strong></td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{log.ip}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

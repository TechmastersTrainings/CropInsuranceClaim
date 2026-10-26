import React, { useState } from "react";
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useApp } from "../context/AppContext";

export function NotificationsPage() {
  const { notifications } = useApp();
  const [list, setList] = useState(notifications);

  const markAllAsRead = () => {
    setList(list.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="page-container" style={{ maxWidth: 840 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bell size={28} />
            <span>Notifications & Operational Alerts</span>
          </h1>
          <p className="page-subtitle">
            Critical weather anomaly warnings, claim status transitions and smart contract notices.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={markAllAsRead}>
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      {list.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <Bell size={40} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>No Notifications at This Time</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: 440, margin: "0 auto" }}>
            Operational alerts, weather triggers, and claim state update notices will be delivered here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                padding: "16px 20px",
                borderLeft: n.type === "warning" ? "4px solid var(--color-accent-amber)" : n.type === "success" ? "4px solid var(--color-primary)" : "4px solid var(--color-info)",
                background: n.read ? "var(--bg-surface)" : "var(--bg-subtle)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "0.95rem" }}>
                  {n.type === "warning" && <AlertTriangle size={18} color="var(--color-accent-amber)" />}
                  {n.type === "success" && <CheckCircle2 size={18} color="var(--color-primary)" />}
                  {n.type === "info" && <Info size={18} color="var(--color-info)" />}
                  <span>{n.title}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{n.timestamp}</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-main)", margin: 0 }}>
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

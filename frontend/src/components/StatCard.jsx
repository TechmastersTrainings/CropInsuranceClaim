import React from "react";

export function StatCard({ icon: Icon, label, value, trend, trendType = "positive" }) {
  return (
    <div className="stat-card">
      {Icon && (
        <div className="stat-icon">
          <Icon size={24} />
        </div>
      )}
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trendType}`}>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

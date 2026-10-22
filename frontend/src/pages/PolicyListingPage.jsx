import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, CheckCircle, ArrowRight, Filter, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

export function PolicyListingPage() {
  const { policies } = useApp();
  const [filterCrop, setFilterCrop] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = policies.filter(p => {
    const matchCrop = filterCrop === "ALL" || p.crop.toLowerCase().includes(filterCrop.toLowerCase());
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.provider.toLowerCase().includes(search.toLowerCase());
    return matchCrop && matchSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={28} />
            <span>Parametric Crop Insurance Policies</span>
          </h1>
          <p className="page-subtitle">
            Underwritten by authorized institutional insurers with verifiable algorithmic weather triggers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: "14px 18px", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
            <Search size={16} style={{ position: "absolute", left: 10, top: 11, color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search policies by name, underwriter, or trigger..."
              style={{ paddingLeft: 34 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Crop Filter:</span>
            <select
              className="form-control"
              style={{ width: "auto" }}
              value={filterCrop}
              onChange={(e) => setFilterCrop(e.target.value)}
            >
              <option value="ALL">All Crops</option>
              <option value="Cotton">Cotton</option>
              <option value="Paddy">Paddy (Rice)</option>
              <option value="Soybean">Soybean</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid-3">
        {filtered.map((policy) => (
          <div key={policy.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div className="card-header">
              <div>
                <span className="badge badge-approved" style={{ marginBottom: 6 }}>{policy.crop}</span>
                <h3 className="card-title" style={{ fontSize: "1.05rem" }}>{policy.title}</h3>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Underwriter:</span>
                <strong>{policy.provider}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>IRDAI License:</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>{policy.licenseNo}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Season:</span>
                <span>{policy.season}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Premium Rate:</span>
                <strong style={{ color: "var(--color-primary)" }}>₹{policy.premiumPerAcre.toLocaleString()} / Acre</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Max Coverage:</span>
                <strong style={{ color: "var(--color-primary-light)" }}>₹{policy.coveragePerAcre.toLocaleString()} / Acre</strong>
              </div>

              {/* Parametric Trigger Summary */}
              <div style={{
                background: "var(--bg-subtle)",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                borderLeft: "3px solid var(--color-primary)",
                marginTop: 6
              }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Parametric Payout Rule
                </div>
                <div style={{ fontSize: "0.825rem", color: "var(--text-main)", marginTop: 2 }}>
                  {policy.triggerParameter}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Valid: {policy.validUntil}
              </span>
              <Link to={`/policies/${policy.id}`} className="btn btn-sm btn-primary">
                View Policy <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

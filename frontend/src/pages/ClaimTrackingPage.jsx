import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Search, Filter, Layers, ArrowRight, ExternalLink } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StatusBadge } from "../components/StatusBadge";

export function ClaimTrackingPage() {
  const { claims } = useApp();
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = claims.filter(c => {
    const matchStatus = filterStatus === "ALL" || c.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
                        c.crop.toLowerCase().includes(search.toLowerCase()) ||
                        c.farmName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CheckCircle2 size={28} />
            <span>Crop Insurance Claim Tracking</span>
          </h1>
          <p className="page-subtitle">
            Lifecycle monitoring across all 10 policy states with immutable blockchain anchor references.
          </p>
        </div>
        <Link to="/claim-wizard" className="btn btn-primary">
          Submit New Claim
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
            <Search size={16} style={{ position: "absolute", left: 10, top: 11, color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by Claim ID, Crop, or Farm..."
              style={{ paddingLeft: 34 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Status:</span>
            <select
              className="form-control"
              style={{ width: "auto" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All States (10 States)</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Settled">Settled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Farm & Crop</th>
                <th>Event Date</th>
                <th>Claim Amount</th>
                <th>Status</th>
                <th>Blockchain Anchor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((claim) => (
                <tr key={claim.id}>
                  <td>
                    <strong>{claim.id}</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{claim.submissionDate}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{claim.farmName}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-primary-light)" }}>{claim.crop}</div>
                  </td>
                  <td>{claim.eventDate}</td>
                  <td>
                    <strong>₹{claim.claimedAmount.toLocaleString("en-IN")}</strong>
                  </td>
                  <td>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--color-blockchain)"
                    }}>
                      <Layers size={12} />
                      <span>{claim.blockchainTx.slice(0, 10)}...{claim.blockchainTx.slice(-6)}</span>
                    </div>
                  </td>
                  <td>
                    <Link to={`/claims/${claim.id}`} className="btn btn-sm btn-secondary">
                      Timeline <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

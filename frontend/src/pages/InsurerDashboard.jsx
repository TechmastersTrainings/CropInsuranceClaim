import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, TrendingUp, Users, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";

export function InsurerDashboard() {
  const { claims, policies, user } = useApp();

  const pendingClaims = claims.filter(c => c.status === "Submitted" || c.status === "Under Review");
  const approvedClaims = claims.filter(c => c.status === "Approved" || c.status === "Settled");
  const totalApprovedValue = approvedClaims.reduce((acc, c) => acc + c.claimedAmount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShieldCheck size={28} />
            <span>Insurance Underwriter & Claims Workspace</span>
          </h1>
          <p className="page-subtitle">
            Officer: {user?.name || "Dr. Anand Rao (Loss Assessor)"} | Underwriter: National Agri-Insurance Corp (NAIC)
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/claim-reviews" className="btn btn-primary">
            Process Pending Queue ({pendingClaims.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          icon={Clock}
          label="Claims Pending Review"
          value={pendingClaims.length}
          trend="Awaiting Officer Sign-off"
          trendType="warning"
        />
        <StatCard
          icon={CheckCircle2}
          label="Total Approved Claims"
          value={approvedClaims.length}
          trend="Blockchain Anchored"
          trendType="positive"
        />
        <StatCard
          icon={TrendingUp}
          label="Settlement Commitments"
          value={`₹${totalApprovedValue.toLocaleString("en-IN")}`}
          trend="Parametric Triggers Met"
          trendType="positive"
        />
        <StatCard
          icon={FileText}
          label="Active Underwritten Policies"
          value={policies.length}
          trend="Kharif 2026 Season"
          trendType="neutral"
        />
      </div>

      {/* Pending Claims Review Queue */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={18} color="var(--color-accent-amber)" />
            <span>High-Priority Review Queue</span>
          </h3>
          <Link to="/claim-reviews" className="btn btn-sm btn-secondary">
            Open Claims Workspace
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Farmer Name</th>
                <th>Farm & Crop</th>
                <th>Damage Reason</th>
                <th>Claim Amount</th>
                <th>AI Condition Metric</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingClaims.map((claim) => (
                <tr key={claim.id}>
                  <td><strong>{claim.id}</strong></td>
                  <td>{claim.farmerName}</td>
                  <td>{claim.farmName} ({claim.crop})</td>
                  <td>{claim.damageReason}</td>
                  <td><strong>₹{claim.claimedAmount.toLocaleString("en-IN")}</strong></td>
                  <td>
                    <span className="badge badge-evidence">
                      {claim.aiAssessment.conditionIndicator}
                    </span>
                  </td>
                  <td>
                    <Link to="/claim-reviews" className="btn btn-sm btn-primary">
                      Inspect & Review <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {pendingClaims.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                    No pending claims in queue. All submissions have been processed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

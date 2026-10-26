import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowRight, UserCheck, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useApp();
  const location = useLocation();

  // 1. Authentication Guard: Must be signed in
  if (!user) {
    // If attempting to access claim submission, direct to farmer auth portal
    const targetPath = location.pathname.includes("claim-wizard") 
      ? "/auth/farmer" 
      : "/auth";
      
    return (
      <Navigate 
        to={targetPath} 
        state={{ 
          from: location.pathname, 
          message: "Authentication Required: Please sign in or register with verified credentials to access this service." 
        }} 
        replace 
      />
    );
  }

  // 2. Authorization Guard (Role-Based Access Control)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || "").toUpperCase();
    const isAuthorized = allowedRoles.map(r => r.toUpperCase()).includes(userRole);

    if (!isAuthorized) {
      const getRoleRedirect = () => {
        if (userRole === "FARMER") return "/farmer-dashboard";
        if (userRole === "INSURER") return "/insurer-dashboard";
        if (userRole === "ADMIN") return "/admin-dashboard";
        return "/blockchain";
      };

      return (
        <div className="page-container" style={{ maxWidth: 640, marginTop: 40, textAlign: "center" }}>
          <div className="card" style={{ padding: "36px 28px", border: "1px solid var(--border-light)" }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--color-danger-soft)",
              color: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <ShieldAlert size={30} />
            </div>

            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
              Authorization Clearance Required
            </h2>
            
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 20 }}>
              You are currently authenticated as <strong>{user.name}</strong> ({user.role}). 
              Under statutory PMFBY regulations, this workspace is restricted to authorized <strong>{allowedRoles.join(" or ")}</strong> personnel.
            </p>

            <div style={{
              background: "var(--bg-subtle)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              color: "var(--text-main)",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}>
              <Lock size={15} color="var(--text-muted)" />
              <span>Required Role: <strong>{allowedRoles.join(" / ")}</strong></span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <Link to={getRoleRedirect()} className="btn btn-primary">
                Return to My Dashboard <ArrowRight size={16} />
              </Link>
              <Link to="/auth" className="btn btn-secondary">
                <UserCheck size={16} /> Switch Role / Portal
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and authorized
  return children;
}

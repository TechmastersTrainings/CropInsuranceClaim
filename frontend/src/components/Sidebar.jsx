import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  FileText,
  FilePlus2,
  CheckCircle2,
  Cpu,
  Layers,
  Shield,
  Sliders,
  Users,
  Activity,
  Settings as SettingsIcon,
  HelpCircle,
  Radio,
  FileCheck2,
  Compass,
  Home,
  BookOpen,
  LogOut,
  BadgeCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLocale } from "../locales";

export function Sidebar() {
  const { user, logoutUserSession } = useApp();
  const { t } = useLocale();
  const navigate = useNavigate();

  // If user is not authenticated, do not render sidebar
  if (!user) return null;

  const currentRole = (user.role || "FARMER").toUpperCase();

  const handleLogout = () => {
    logoutUserSession();
    navigate("/");
  };

  const farmerLinks = [
    { to: "/farmer-dashboard", label: t("nav_dashboard"), icon: LayoutDashboard },
    { to: "/farms", label: t("nav_farms"), icon: Compass },
    { to: "/crops", label: t("nav_crops"), icon: Sprout },
    { to: "/policies", label: t("nav_policies"), icon: FileText },
    { to: "/claim-wizard", label: t("nav_claim_wizard"), icon: FilePlus2 },
    { to: "/claims", label: t("nav_claims"), icon: CheckCircle2 },
    { to: "/evidence", label: t("nav_evidence"), icon: FileCheck2 },
    { to: "/iot", label: t("nav_iot"), icon: Radio },
    { to: "/ai-assessment", label: t("nav_ai_assessment"), icon: Activity }
  ];

  const insurerLinks = [
    { to: "/insurer-dashboard", label: "Insurer Dashboard", icon: LayoutDashboard },
    { to: "/claim-reviews", label: t("nav_claim_review"), icon: CheckCircle2 },
    { to: "/policies", label: t("nav_policies"), icon: FileText },
    { to: "/ai-assessment", label: t("nav_ai_assessment"), icon: Activity },
    { to: "/iot", label: t("nav_iot"), icon: Radio },
    { to: "/blockchain", label: t("nav_blockchain"), icon: Layers }
  ];

  const adminLinks = [
    { to: "/admin-dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
    { to: "/crop-config", label: t("nav_crop_config"), icon: Sprout },
    { to: "/policy-config", label: t("nav_policy_config"), icon: Sliders },
    { to: "/users", label: t("nav_user_mgmt"), icon: Users },
    { to: "/devices", label: t("nav_devices"), icon: Cpu },
    { to: "/blockchain", label: t("nav_blockchain"), icon: Layers },
    { to: "/audit-logs", label: t("nav_audit_logs"), icon: Shield },
    { to: "/system-states", label: "System Diagnostics", icon: HelpCircle }
  ];

  const auditorLinks = [
    { to: "/blockchain", label: t("nav_blockchain"), icon: Layers },
    { to: "/claim-reviews", label: "Auditor Claim Inspection", icon: CheckCircle2 },
    { to: "/audit-logs", label: t("nav_audit_logs"), icon: Shield },
    { to: "/system-states", label: "System Integrity", icon: HelpCircle }
  ];

  let activeLinks = farmerLinks;
  let roleTitle = "Farmer Workspace";
  let roleBadge = "🌾 Verified Farmer";
  let idTag = user.survey || user.landSurveyNumber || "PMFBY-KA-88219";

  if (currentRole === "INSURER") {
    activeLinks = insurerLinks;
    roleTitle = "Underwriting Portal";
    roleBadge = "🏢 Licensed Insurer";
    idTag = user.licenseId || "IRDAI/NL-042";
  } else if (currentRole === "ADMIN") {
    activeLinks = adminLinks;
    roleTitle = "Admin Control Suite";
    roleBadge = "⚡ System Admin";
    idTag = user.division || "SEC-OPS-L3";
  } else if (currentRole === "AUDITOR") {
    activeLinks = auditorLinks;
    roleTitle = "Statutory Audit Cell";
    roleBadge = "🏛️ Govt. Auditor";
    idTag = user.govId || "GOV-PMFBY-707";
  }

  return (
    <aside style={{
      width: 250,
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border-light)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      padding: "16px 12px"
    }}>
      {/* Authenticated Identity Card */}
      <div style={{
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-md)",
        padding: "12px",
        marginBottom: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--color-primary)",
            color: "#fff",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            flexShrink: 0
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text-main)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {user.name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--color-primary)", fontWeight: 600 }}>
              {roleBadge}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          paddingTop: 6,
          borderTop: "1px solid rgba(0,0,0,0.06)"
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)" }}></span>
            Active Session
          </span>
          <span style={{ fontWeight: 600, color: "var(--text-main)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>
            {idTag}
          </span>
        </div>
      </div>

      <div style={{
        fontSize: "0.7rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--text-subtle)",
        padding: "0 10px 8px"
      }}>
        {roleTitle}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, overflowY: "auto" }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.86rem",
            fontWeight: isActive ? 600 : 500,
            color: isActive ? "var(--color-primary)" : "var(--text-main)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none",
            transition: "all var(--transition-fast)",
            marginBottom: 2
          })}
        >
          <Home size={17} />
          <span>Home Overview</span>
        </NavLink>

        {activeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.86rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--color-primary)" : "var(--text-main)",
                background: isActive ? "var(--color-primary-soft)" : "transparent",
                textDecoration: "none",
                transition: "all var(--transition-fast)"
              })}
            >
              <Icon size={17} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Utility Links */}
      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
        <NavLink
          to="/working-procedure"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.83rem",
            color: isActive ? "var(--color-primary)" : "var(--text-muted)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none"
          })}
        >
          <BookOpen size={16} />
          <span>Operating Guide</span>
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.83rem",
            color: isActive ? "var(--color-primary)" : "var(--text-muted)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none"
          })}
        >
          <SettingsIcon size={16} />
          <span>{t("nav_settings")}</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.83rem",
            color: "var(--color-danger)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            marginTop: 4,
            transition: "all var(--transition-fast)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-danger-soft)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={16} />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
}

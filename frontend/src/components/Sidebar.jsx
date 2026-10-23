import React from "react";
import { NavLink } from "react-router-dom";
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
  KeyRound
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLocale } from "../locales";

export function Sidebar() {
  const { currentRole } = useApp();
  const { t } = useLocale();

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
  if (currentRole === "INSURER") activeLinks = insurerLinks;
  else if (currentRole === "ADMIN") activeLinks = adminLinks;
  else if (currentRole === "AUDITOR") activeLinks = auditorLinks;

  return (
    <aside style={{
      width: 250,
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border-light)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      padding: "20px 12px"
    }}>
      <div style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--text-subtle)",
        padding: "0 12px 10px",
        borderBottom: "1px solid var(--border-light)",
        marginBottom: 12
      }}>
        {currentRole} Workspace
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.88rem",
            fontWeight: isActive ? 600 : 500,
            color: isActive ? "var(--color-primary)" : "var(--text-main)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none",
            transition: "all var(--transition-fast)",
            marginBottom: 4
          })}
        >
          <Home size={18} />
          <span>Home / Overview</span>
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
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.88rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--color-primary)" : "var(--text-main)",
                background: isActive ? "var(--color-primary-soft)" : "transparent",
                textDecoration: "none",
                transition: "all var(--transition-fast)"
              })}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Common Links */}
      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <NavLink
          to="/working-procedure"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            color: isActive ? "var(--color-primary)" : "var(--text-muted)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none"
          })}
        >
          <BookOpen size={16} />
          <span>Operating Guide</span>
        </NavLink>

        <NavLink
          to="/auth"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            color: isActive ? "var(--color-primary)" : "var(--text-muted)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none"
          })}
        >
          <KeyRound size={16} />
          <span>Sign In / Register</span>
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            color: isActive ? "var(--color-primary)" : "var(--text-muted)",
            background: isActive ? "var(--color-primary-soft)" : "transparent",
            textDecoration: "none"
          })}
        >
          <SettingsIcon size={16} />
          <span>{t("nav_settings")}</span>
        </NavLink>
      </div>
    </aside>
  );
}

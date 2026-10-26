import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, Wifi, WifiOff, Globe, LogOut, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLocale } from "../locales";

export function Header() {
  const { user, logoutUserSession, isOnline, demoMode, notifications } = useApp();
  const { lang, setLang, t } = useLocale();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logoutUserSession();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/auth";
    const role = (user.role || "").toUpperCase();
    if (role === "INSURER") return "/insurer-dashboard";
    if (role === "ADMIN") return "/admin-dashboard";
    if (role === "AUDITOR") return "/blockchain";
    return "/farmer-dashboard";
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const role = (user.role || "").toUpperCase();
    if (role === "INSURER") return { label: "🏢 Insurer", color: "var(--color-primary)" };
    if (role === "ADMIN") return { label: "⚡ Admin", color: "#6a1b9a" };
    if (role === "AUDITOR") return { label: "🏛️ Auditor", color: "#e65100" };
    return { label: "🌾 Farmer", color: "var(--color-primary)" };
  };

  const roleInfo = getRoleBadge();

  return (
    <header style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-light)",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow-xs)"
    }}>
      {/* Brand & Quick Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            background: "var(--color-primary)",
            color: "#fff",
            padding: "8px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center"
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.12rem", color: "var(--color-primary)", letterSpacing: "-0.01em" }}>
              {t("app_title")}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {t("app_subtitle")}
            </div>
          </div>
        </Link>

        {/* Global Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 14, marginLeft: 12 }}>
          <Link
            to="/"
            style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", textDecoration: "none" }}
          >
            Home
          </Link>
          <Link
            to="/working-procedure"
            style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", textDecoration: "none" }}
          >
            Operating Guide
          </Link>
          {user ? (
            <Link
              to={getDashboardPath()}
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <LayoutDashboard size={14} /> My Workspace
            </Link>
          ) : (
            <Link
              to="/auth"
              style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}
            >
              Role Portals
            </Link>
          )}
        </nav>
      </div>

      {/* Right Controls: Connectivity, Language, Notifications, Authenticated Session */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Connectivity Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.78rem",
          color: isOnline ? "var(--color-primary)" : "var(--color-accent-amber)",
          background: isOnline ? "var(--color-primary-soft)" : "var(--color-amber-soft)",
          padding: "4px 9px",
          borderRadius: "var(--radius-pill)"
        }}>
          {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{isOnline ? "Online" : "Offline (Queued)"}</span>
        </div>

        {/* Language Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Globe size={15} color="var(--text-muted)" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
            aria-label="Language"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
          </select>
        </div>

        {/* Notifications Icon (Only shown or active when relevant) */}
        {user && (
          <Link
            to="/notifications"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
              background: "var(--bg-surface)",
              color: "var(--text-main)"
            }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: -3,
                right: -3,
                background: "var(--color-danger)",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 700,
                width: 16,
                height: 16,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        {/* Authenticated User Session vs Guest CTAs */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 8, borderLeft: "1px solid var(--border-light)" }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--color-primary-soft)",
              color: "var(--color-primary)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.82rem"
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.2, color: "var(--text-main)" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "0.68rem", color: roleInfo?.color, fontWeight: 600 }}>
                {roleInfo?.label}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out Session"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 9px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)",
                background: "var(--bg-subtle)",
                color: "var(--color-danger)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: 4
              }}
            >
              <LogOut size={13} />
              <span>Exit</span>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 8, borderLeft: "1px solid var(--border-light)" }}>
            <Link
              to="/auth"
              className="btn btn-secondary btn-sm"
              style={{ padding: "6px 12px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
            <Link
              to="/auth"
              className="btn btn-primary btn-sm"
              style={{ padding: "6px 12px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <UserPlus size={14} />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

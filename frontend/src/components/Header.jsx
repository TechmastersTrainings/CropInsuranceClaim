import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Bell, Wifi, WifiOff, Globe, UserCheck, AlertTriangle, LogOut, LogIn, UserPlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLocale } from "../locales";

export function Header() {
  const { currentRole, switchRole, user, logoutUserSession, isOnline, demoMode, notifications } = useApp();
  const { lang, setLang, t } = useLocale();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-light)",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow-xs)"
    }}>
      {/* Brand & Demo Pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
            <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--color-primary)", letterSpacing: "-0.01em" }}>
              {t("app_title")}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {t("app_subtitle")}
            </div>
          </div>
        </Link>

        {demoMode && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            background: "var(--color-amber-soft)",
            color: "#bf360c",
            border: "1px solid #ffcc80",
            borderRadius: "var(--radius-pill)",
            fontSize: "0.75rem",
            fontWeight: 600
          }}>
            <AlertTriangle size={12} /> Demo Mode
          </span>
        )}

        {/* Quick Nav Shortcuts */}
        <nav style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 10 }}>
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
          <Link
            to="/auth"
            style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}
          >
            Sign In / Register
          </Link>
        </nav>
      </div>

      {/* Right Controls: Connectivity, Role Switcher, Language, Notifications, User */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Connectivity Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.8rem",
          color: isOnline ? "var(--color-primary)" : "var(--color-accent-amber)",
          background: isOnline ? "var(--color-primary-soft)" : "var(--color-amber-soft)",
          padding: "5px 10px",
          borderRadius: "var(--radius-pill)"
        }}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isOnline ? "Online" : "Offline (Sync Queued)"}</span>
        </div>

        {/* Language Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Globe size={16} color="var(--text-muted)" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
            aria-label="Language"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
          </select>
        </div>

        {/* Role Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-subtle)", padding: "4px 8px", borderRadius: "var(--radius-md)" }}>
          <UserCheck size={16} color="var(--color-primary)" />
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Role:</span>
          <select
            value={currentRole}
            onChange={(e) => switchRole(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-primary)",
              background: "#fff",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
            aria-label="Active Role"
          >
            <option value="FARMER">Farmer</option>
            <option value="INSURER">Insurance Officer</option>
            <option value="ADMIN">Administrator</option>
            <option value="AUDITOR">Auditor / Regulator</option>
          </select>
        </div>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-light)",
            background: "var(--bg-surface)",
            color: "var(--text-main)"
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--color-danger)",
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 700,
              width: 17,
              height: 17,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Session or Guest Authentication */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 6, borderLeft: "1px solid var(--border-light)" }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--color-primary-soft)",
              color: "var(--color-primary)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85rem"
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div style={{ fontSize: "0.825rem", fontWeight: 700, lineHeight: 1.2 }}>{user.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{user.role}</div>
            </div>
            <button
              type="button"
              onClick={logoutUserSession}
              title="Sign Out"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 8px",
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 6, borderLeft: "1px solid var(--border-light)" }}>
            <Link
              to="/auth"
              className="btn btn-secondary btn-sm"
              style={{ padding: "5px 10px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </Link>
            <Link
              to="/auth"
              className="btn btn-primary btn-sm"
              style={{ padding: "5px 10px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <UserPlus size={13} />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

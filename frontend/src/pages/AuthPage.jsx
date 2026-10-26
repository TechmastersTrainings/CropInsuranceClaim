import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Phone,
  MapPin,
  Sprout,
  Check,
  Compass,
  AlertTriangle,
  UserCheck,
  Building2,
  FileBadge,
  KeyRound,
  Layers,
  HelpCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { loginUser, registerUser } from "../services/api";

const ROLE_METADATA = {
  FARMER: {
    key: "FARMER",
    path: "farmer",
    title: "Farmer Access Portal (Kisan)",
    subtitle: "Register land survey plots, track IoT sensor metrics, and submit automated parametric claims.",
    icon: Sprout,
    accentColor: "var(--color-primary)",
    softBg: "var(--color-primary-soft)"
  },
  INSURER: {
    key: "INSURER",
    path: "insurer",
    title: "Insurance Officer & Underwriter Portal",
    subtitle: "Adjudicate multi-source claim evidence, verify PMFBY parametric entitlement, and authorize state changes.",
    icon: ShieldCheck,
    accentColor: "var(--color-accent-amber)",
    softBg: "var(--color-amber-soft)"
  },
  ADMIN: {
    key: "ADMIN",
    path: "admin",
    title: "System Administrator Portal",
    subtitle: "Configure 9-crop agronomic rules, manage policy limits, sensor device registries, and system RBAC.",
    icon: Building2,
    accentColor: "var(--color-info)",
    softBg: "var(--color-info-soft)"
  },
  AUDITOR: {
    key: "AUDITOR",
    path: "auditor",
    title: "Regulatory Oversight & Auditor Portal",
    subtitle: "Audit Hyperledger Fabric smart contract blocks, Merkle tree telemetry roots, and statutory compliance.",
    icon: Layers,
    accentColor: "var(--color-blockchain)",
    softBg: "var(--color-blockchain-soft)"
  }
};

export function AuthPage() {
  const { targetRole } = useParams();
  const navigate = useNavigate();
  const { loginUserSession, registerUserSession, user } = useApp();

  // Normalize target role from URL or default to FARMER
  const initialRole = (targetRole && targetRole.toUpperCase() in ROLE_METADATA)
    ? targetRole.toUpperCase()
    : "FARMER";

  const [activeRole, setActiveRole] = useState(initialRole);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Common fields (strictly empty defaults)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Farmer-specific fields (strictly empty defaults)
  const [farmerState, setFarmerState] = useState("");
  const [farmerDistrict, setFarmerDistrict] = useState("");
  const [farmerVillage, setFarmerVillage] = useState("");
  const [farmerSurvey, setFarmerSurvey] = useState("");
  const [farmerAcres, setFarmerAcres] = useState("");
  const [farmerCrop, setFarmerCrop] = useState("");
  const [farmerAadhaar4, setFarmerAadhaar4] = useState("");

  // Insurer-specific fields (strictly empty defaults)
  const [insurerCompany, setInsurerCompany] = useState("");
  const [insurerLicense, setInsurerLicense] = useState("");
  const [insurerBranch, setInsurerBranch] = useState("");
  const [insurerState, setInsurerState] = useState("");

  // Admin-specific fields (strictly empty defaults)
  const [adminDivision, setAdminDivision] = useState("");
  const [adminClearancePin, setAdminClearancePin] = useState("");

  // Auditor-specific fields (strictly empty defaults)
  const [auditorAgency, setAuditorAgency] = useState("");
  const [auditorGovId, setAuditorGovId] = useState("");
  const [auditorDesignation, setAuditorDesignation] = useState("");

  // UI status
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync role if URL route changes
  useEffect(() => {
    if (targetRole) {
      const match = Object.keys(ROLE_METADATA).find(
        k => k.toLowerCase() === targetRole.toLowerCase()
      );
      if (match) setActiveRole(match);
    }
  }, [targetRole]);

  const activeMeta = ROLE_METADATA[activeRole] || ROLE_METADATA.FARMER;
  const ActiveIcon = activeMeta.icon;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      const loggedUser = {
        id: res.user?.id || 1,
        name: res.user?.full_name || fullName || (email ? email.split("@")[0] : "Authenticated User"),
        email: res.user?.email || email,
        role: res.user?.role || activeRole,
        phone: res.user?.phone || phone || "",
        state: res.user?.state || farmerState || "",
        district: res.user?.district || farmerDistrict || "",
        aadhaarMasked: res.user?.aadhaar_masked || (farmerAadhaar4 ? `XXXX-XXXX-${farmerAadhaar4}` : ""),
        crop: farmerCrop,
        acres: farmerAcres,
        company: insurerCompany,
        licenseId: insurerLicense,
        agency: auditorAgency
      };

      loginUserSession(loggedUser, activeRole);
      setSuccessMessage(`Authentication successful! Welcome, ${loggedUser.name}.`);

      setTimeout(() => {
        if (activeRole === "FARMER") navigate("/farmer-dashboard");
        else if (activeRole === "INSURER") navigate("/claim-reviews");
        else if (activeRole === "ADMIN") navigate("/admin-dashboard");
        else navigate("/blockchain");
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "Failed to authenticate. Please verify email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register directly in MySQL
      const regPayload = {
        email: email,
        password: password,
        full_name: fullName,
        role: activeRole,
        phone: phone || "",
        aadhaar_masked: farmerAadhaar4 ? `XXXX-XXXX-${farmerAadhaar4}` : "",
        district: farmerDistrict || "",
        state: activeRole === "FARMER" ? farmerState : (insurerState || "")
      };

      const newUserRes = await registerUser(regPayload);

      // 2. Authenticate to acquire real JWT token
      const loginRes = await loginUser(email, password);

      const userData = {
        id: newUserRes.id || loginRes.user?.id,
        name: newUserRes.full_name,
        email: newUserRes.email,
        phone: newUserRes.phone,
        role: newUserRes.role,
        state: newUserRes.state,
        district: newUserRes.district,
        village: farmerVillage,
        survey: farmerSurvey,
        crop: farmerCrop,
        acres: farmerAcres,
        aadhaarMasked: newUserRes.aadhaar_masked || (farmerAadhaar4 ? `XXXX-XXXX-${farmerAadhaar4}` : ""),
        company: insurerCompany,
        licenseId: insurerLicense,
        division: adminDivision,
        agency: auditorAgency,
        govId: auditorGovId
      };

      registerUserSession(userData, activeRole);
      setSuccessMessage(`Registration complete! Account saved in database. Welcome, ${userData.name}.`);

      setTimeout(() => {
        if (activeRole === "FARMER") navigate("/farmer-dashboard");
        else if (activeRole === "INSURER") navigate("/claim-reviews");
        else if (activeRole === "ADMIN") navigate("/admin-dashboard");
        else navigate("/blockchain");
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 900, padding: "30px 16px" }}>
      {/* Role Selection Tabs */}
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
          AgriClaim Shield Access Portal
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: 600, margin: "0 auto 20px" }}>
          Select your dedicated portal to sign in or register with verified credentials.
        </p>

        {/* 4 Role Selector Buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12
        }}>
          {Object.values(ROLE_METADATA).map((meta) => {
            const isSelected = activeRole === meta.key;
            const Icon = meta.icon;
            return (
              <button
                key={meta.key}
                type="button"
                onClick={() => {
                  setActiveRole(meta.key);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                style={{
                  padding: "16px 14px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? `2px solid ${meta.accentColor}` : "1px solid var(--border-light)",
                  background: isSelected ? meta.softBg : "var(--bg-surface)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all var(--transition-fast)",
                  boxShadow: isSelected ? "var(--shadow-sm)" : "none"
                }}
              >
                <div style={{
                  display: "inline-flex",
                  padding: 8,
                  borderRadius: "var(--radius-sm)",
                  background: isSelected ? meta.accentColor : "var(--bg-subtle)",
                  color: isSelected ? "#ffffff" : "var(--text-muted)",
                  marginBottom: 8
                }}>
                  <Icon size={20} />
                </div>
                <div style={{
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: isSelected ? meta.accentColor : "var(--text-main)"
                }}>
                  {meta.title.split(" ")[0]} Portal
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {meta.key === "FARMER" && "Cultivators & Landholders"}
                  {meta.key === "INSURER" && "Loss Assessors & Underwriters"}
                  {meta.key === "ADMIN" && "System & Device Config"}
                  {meta.key === "AUDITOR" && "Government & Fabric Audit"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="card" style={{ maxWidth: 640, margin: "0 auto", padding: "32px 28px", boxShadow: "var(--shadow-md)" }}>
        {/* Active Portal Header */}
        <div style={{
          padding: 16,
          background: activeMeta.softBg,
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${activeMeta.accentColor}`,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 14
        }}>
          <div style={{
            padding: 10,
            background: activeMeta.accentColor,
            color: "#fff",
            borderRadius: "var(--radius-sm)"
          }}>
            <ActiveIcon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-main)" }}>
              {activeMeta.title}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
              {activeMeta.subtitle}
            </div>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "var(--bg-subtle)",
          padding: 4,
          borderRadius: "var(--radius-sm)",
          marginBottom: 20
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              background: authMode === "login" ? "var(--bg-surface)" : "transparent",
              color: authMode === "login" ? "var(--color-primary)" : "var(--text-muted)",
              boxShadow: authMode === "login" ? "var(--shadow-xs)" : "none"
            }}
          >
            Sign In to {activeMeta.title.split(" ")[0]}
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode("register"); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              background: authMode === "register" ? "var(--bg-surface)" : "transparent",
              color: authMode === "register" ? "var(--color-primary)" : "var(--text-muted)",
              boxShadow: authMode === "register" ? "var(--shadow-xs)" : "none"
            }}
          >
            Register New {activeMeta.title.split(" ")[0]}
          </button>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="alert-banner alert-success" style={{ marginBottom: 16 }}>
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert-banner alert-danger" style={{ marginBottom: 16 }}>
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}


        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: SIGN IN FORM */}
        {/* ------------------------------------------------------------- */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">
                {activeRole === "FARMER" ? "Registered Mobile Number or Email" : "Official Email Address"}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={activeRole === "FARMER" ? "Enter mobile number or email" : "Enter official email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Role-Specific Login Verification Key */}
            {activeRole === "INSURER" && (
              <div className="form-group">
                <label className="form-label">IRDAI Surveyor License / Employee ID (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter IRDAI license or employee ID"
                  value={insurerLicense}
                  onChange={(e) => setInsurerLicense(e.target.value)}
                />
              </div>
            )}

            {activeRole === "ADMIN" && (
              <div className="form-group">
                <label className="form-label">Admin Security Clearance PIN</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter security clearance PIN"
                  value={adminClearancePin}
                  onChange={(e) => setAdminClearancePin(e.target.value)}
                />
              </div>
            )}

            {activeRole === "AUDITOR" && (
              <div className="form-group">
                <label className="form-label">Government Auditor Clearance ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter government clearance ID"
                  value={auditorGovId}
                  onChange={(e) => setAuditorGovId(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
              disabled={loading}
            >
              <span>{loading ? "Authenticating..." : `Authenticate as ${activeMeta.title.split(" ")[0]}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: REGISTER FORM */}
        {/* ------------------------------------------------------------- */}
        {authMode === "register" && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter complete legal name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (SMS / OTP)</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 1. FARMER REGISTRATION SPECIFIC FIELDS */}
            {activeRole === "FARMER" && (
              <div style={{ padding: 14, background: "var(--color-primary-soft)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Sprout size={16} />
                  <span>Land Plot & Agronomic Crop Registration</span>
                </div>

                <div className="grid-2" style={{ gap: 10, marginBottom: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>State</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maharashtra, Karnataka"
                      value={farmerState}
                      onChange={(e) => setFarmerState(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>District</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter district"
                      value={farmerDistrict}
                      onChange={(e) => setFarmerDistrict(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 10, marginBottom: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Taluk / Village</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter taluk / village"
                      value={farmerVillage}
                      onChange={(e) => setFarmerVillage(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Survey Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter official survey number"
                      value={farmerSurvey}
                      onChange={(e) => setFarmerSurvey(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 10, marginBottom: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Cultivated Crop</label>
                    <select
                      className="form-control"
                      value={farmerCrop}
                      onChange={(e) => setFarmerCrop(e.target.value)}
                      required
                    >
                      <option value="">-- Select Cultivated Crop --</option>
                      <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                      <option value="Paddy (Rice)">Paddy / Rice (Oryza sativa)</option>
                      <option value="Maize">Maize (Zea mays)</option>
                      <option value="Soybean">Soybean (Glycine max)</option>
                      <option value="Wheat">Wheat (Triticum aestivum)</option>
                      <option value="Pulses">Pulses (Cajanus cajan)</option>
                      <option value="Sugarcane">Sugarcane (Saccharum)</option>
                      <option value="Vegetables">Vegetables (Horticulture)</option>
                      <option value="Fruits">Fruits (Orchard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Land Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      placeholder="e.g. 4.5"
                      value={farmerAcres}
                      onChange={(e) => setFarmerAcres(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Aadhaar Card (Last 4 Digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    className="form-control"
                    placeholder="Enter last 4 digits"
                    value={farmerAadhaar4}
                    onChange={(e) => setFarmerAadhaar4(e.target.value)}
                    required
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>
                    🔒 <em>Section 16 Data Privacy: Biometric and full Aadhaar data is never collected or stored.</em>
                  </div>
                </div>
              </div>
            )}

            {/* 2. INSURER REGISTRATION SPECIFIC FIELDS */}
            {activeRole === "INSURER" && (
              <div style={{ padding: 14, background: "var(--color-amber-soft)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-accent-amber)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Building2 size={16} />
                  <span>Insurance Company & IRDAI Assessor Credentials</span>
                </div>

                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Insurance Organization</label>
                  <select
                    className="form-control"
                    value={insurerCompany}
                    onChange={(e) => setInsurerCompany(e.target.value)}
                    required
                  >
                    <option value="">-- Select Insurance Organization --</option>
                    <option value="National Agriculture Insurance Company (NAIC)">National Agriculture Insurance Company (NAIC)</option>
                    <option value="Agriculture Insurance Company of India (AIC)">Agriculture Insurance Company of India (AIC)</option>
                    <option value="HDFC ERGO General Insurance">HDFC ERGO General Insurance</option>
                    <option value="ICICI Lombard General Insurance">ICICI Lombard General Insurance</option>
                    <option value="Bajaj Allianz General Insurance">Bajaj Allianz General Insurance</option>
                  </select>
                </div>

                <div className="grid-2" style={{ gap: 10, marginBottom: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>IRDAI Surveyor License / ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter IRDAI License ID"
                      value={insurerLicense}
                      onChange={(e) => setInsurerLicense(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Jurisdiction State</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter state"
                      value={insurerState}
                      onChange={(e) => setInsurerState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Zonal / Regional Branch</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter regional branch location"
                    value={insurerBranch}
                    onChange={(e) => setInsurerBranch(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* 3. ADMIN REGISTRATION SPECIFIC FIELDS */}
            {activeRole === "ADMIN" && (
              <div style={{ padding: 14, background: "var(--color-info-soft)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-info)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Building2 size={16} />
                  <span>Administrative Division & Security PIN</span>
                </div>

                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Operations Division</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter operations division"
                    value={adminDivision}
                    onChange={(e) => setAdminDivision(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Admin Master Clearance PIN</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter security clearance PIN"
                    value={adminClearancePin}
                    onChange={(e) => setAdminClearancePin(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* 4. AUDITOR REGISTRATION SPECIFIC FIELDS */}
            {activeRole === "AUDITOR" && (
              <div style={{ padding: 14, background: "var(--color-blockchain-soft)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-blockchain)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Layers size={16} />
                  <span>State Regulatory Authority & Statutory Credentials</span>
                </div>

                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Regulatory Agency / Directorate</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter regulatory agency"
                    value={auditorAgency}
                    onChange={(e) => setAuditorAgency(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Official Gov Employee ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter government employee ID"
                      value={auditorGovId}
                      onChange={(e) => setAuditorGovId(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter designation"
                      value={auditorDesignation}
                      onChange={(e) => setAuditorDesignation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
              disabled={loading}
            >
              <span>{loading ? "Registering..." : `Register as ${activeMeta.title.split(" ")[0]}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

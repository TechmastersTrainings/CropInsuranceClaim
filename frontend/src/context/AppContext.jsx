import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CROPS_CATALOG,
  FARMS_DATA,
  POLICIES_DATA,
  CLAIMS_DATA,
  IOT_TELEMETRY_SERIES,
  SENSOR_DEVICES,
  BLOCKCHAIN_LEDGER,
  AUDIT_LOGS,
  NOTIFICATIONS_DATA
} from "../data/mockData";
import {
  checkBackendHealth,
  fetchCropsRegistry,
  fetchPolicies,
  fetchClaims,
  submitNewClaim,
  transitionClaim
} from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Dynamic session state: loads from localStorage or defaults to null (no hardcoded user!)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("agrishield_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem("agrishield_role") || "FARMER";
  });

  const [farms, setFarms] = useState(FARMS_DATA);
  const [crops, setCrops] = useState(CROPS_CATALOG);
  const [policies, setPolicies] = useState(POLICIES_DATA);
  const [claims, setClaims] = useState(CLAIMS_DATA);
  const [devices, setDevices] = useState(SENSOR_DEVICES);
  const [ledger, setLedger] = useState(BLOCKCHAIN_LEDGER);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendConnected, setBackendConnected] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  // Sync with real backend API
  useEffect(() => {
    async function initBackend() {
      const health = await checkBackendHealth();
      if (health && health.status === "healthy") {
        setBackendConnected(true);
        try {
          const apiCrops = await fetchCropsRegistry();
          if (apiCrops && apiCrops.length > 0) {
            setCrops(apiCrops.map(c => ({
              id: c.crop_code,
              name: c.name,
              season: c.season,
              cycleDays: c.cycle_days,
              minTemp: c.min_temp,
              maxTemp: c.max_temp,
              minRain: c.min_rain,
              soilType: c.soil_type,
              moistureThreshold: c.moisture_threshold
            })));
          }
        } catch (e) {
          // Keep local fallback
        }
      }
    }
    initBackend();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loginUserSession = (userData, role) => {
    setUser(userData);
    setCurrentRole(role);
    try {
      localStorage.setItem("agrishield_user", JSON.stringify(userData));
      localStorage.setItem("agrishield_role", role);
    } catch (e) {}
  };

  const registerUserSession = (userData, role) => {
    setUser(userData);
    setCurrentRole(role);
    try {
      localStorage.setItem("agrishield_user", JSON.stringify(userData));
      localStorage.setItem("agrishield_role", role);
    } catch (e) {}
  };

  const logoutUserSession = () => {
    setUser(null);
    setCurrentRole("FARMER");
    try {
      localStorage.removeItem("agrishield_user");
      localStorage.removeItem("agrishield_role");
      localStorage.removeItem("agrishield_token");
    } catch (e) {}
  };

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    try {
      localStorage.setItem("agrishield_role", newRole);
    } catch (e) {}
  };

  const addClaim = (newClaim) => {
    if (!user) {
      throw new Error("Authentication Required: Only authenticated farmers can submit claims under PMFBY regulations.");
    }
    const id = `CLM-2026-${Math.floor(884 + Math.random() * 100)}`;
    const tx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const actorName = user.name;
    const actorEmail = user.email || `${user.id?.toLowerCase()}@agrishield.org`;
    const actorRole = (user.role || "FARMER").toUpperCase();

    const claimRecord = {
      ...newClaim,
      id,
      blockchainTx: tx,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Submitted",
      aiAssessment: {
        status: "Assessment Pending",
        conditionIndicator: "Queued for automated assessment",
        estimatedDamagePct: 0,
        weatherCorrelationScore: 0.0,
        reviewRecommendation: "Evidence submitted",
        sensorAnomalyNoted: "Processing station telemetry"
      },
      timeline: [
        { step: "Claim Submitted", timestamp: new Date().toLocaleString(), actor: actorName, state: "Completed" }
      ]
    };
    setClaims([claimRecord, ...claims]);
    
    // Log audit event
    const newAudit = {
      id: auditLogs.length + 1000,
      timestamp: new Date().toLocaleString(),
      actor: actorEmail,
      role: actorRole,
      action: "Created New Claim",
      target: id,
      ip: "127.0.0.1"
    };
    setAuditLogs([newAudit, ...auditLogs]);
    return id;
  };

  const updateClaimStatus = (claimId, newStatus, remarks) => {
    const actorName = user?.name || `Authorized Officer (${currentRole})`;
    const actorRole = user?.role || currentRole;

    setClaims(claims.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: newStatus,
          timeline: [
            ...c.timeline,
            {
              step: `Status changed to ${newStatus}`,
              timestamp: new Date().toLocaleString(),
              actor: `${actorName} (${actorRole}) - ${remarks || "Action processed"}`,
              state: "Completed"
            }
          ]
        };
      }
      return c;
    }));
  };

  const addFarm = (newFarm) => {
    const id = `FARM-${100 + farms.length + 1}`;
    setFarms([...farms, { ...newFarm, id }]);
  };

  const updateClaimAIAssessment = (claimId, assessmentData) => {
    setClaims(claims.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          aiAssessment: {
            status: "Completed",
            conditionIndicator: assessmentData.damage_category,
            estimatedDamagePct: assessmentData.estimated_loss_percentage,
            weatherCorrelationScore: assessmentData.weather_correlation_score,
            reviewRecommendation: assessmentData.anomaly_detected 
              ? "Flagged for Manual Surveyor Review (Anomaly Flagged)" 
              : `Parametric Payout Advisory (${assessmentData.recommended_payout_percentage}%)`,
            sensorAnomalyNoted: assessmentData.anomaly_detected ? assessmentData.inconsistency_reasons?.join("; ") : "Physical Telemetry Verified",
            severity: assessmentData.severity_level,
            advisoryRationale: assessmentData.advisory_rationale
          }
        };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        user,
        setUser,
        loginUserSession,
        registerUserSession,
        logoutUserSession,
        farms,
        addFarm,
        crops,
        policies,
        claims,
        addClaim,
        updateClaimStatus,
        updateClaimAIAssessment,
        devices,
        ledger,
        notifications,
        auditLogs,
        isOnline,
        backendConnected,
        demoMode,
        setDemoMode,
        telemetrySeries: IOT_TELEMETRY_SERIES
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

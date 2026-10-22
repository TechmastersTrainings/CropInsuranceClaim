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
  // Roles: "FARMER", "INSURER", "ADMIN", "AUDITOR"
  const [currentRole, setCurrentRole] = useState("FARMER");
  const [user, setUser] = useState({
    id: "USR-001",
    name: "Basavaraj Patil",
    email: "patil.farmer@agrishield.org",
    role: "FARMER",
    aadhaarMasked: "XXXX-XXXX-4819",
    state: "Karnataka",
    district: "Dharwad"
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

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === "FARMER") {
      setUser({
        id: "USR-001",
        name: "Basavaraj Patil",
        email: "patil.farmer@agrishield.org",
        role: "FARMER",
        aadhaarMasked: "XXXX-XXXX-4819",
        state: "Karnataka",
        district: "Dharwad"
      });
    } else if (newRole === "INSURER") {
      setUser({
        id: "USR-202",
        name: "Rajesh Kumar (NAIC Claims Div)",
        email: "rajesh.kumar@naic.in",
        role: "INSURER",
        licenseNo: "IRDAI-OFFICER-491",
        state: "All India",
        district: "Zonal HQ"
      });
    } else if (newRole === "ADMIN") {
      setUser({
        id: "USR-999",
        name: "Dr. Sunita Rao (System Admin)",
        email: "admin.sunita@agrishield.org",
        role: "ADMIN",
        state: "HQ",
        district: "Central"
      });
    } else if (newRole === "AUDITOR") {
      setUser({
        id: "USR-707",
        name: "V. Sharma (Govt. Ag Audit)",
        email: "v.sharma@agri.gov.in",
        role: "AUDITOR",
        state: "National Audit Cell",
        district: "Govt Oversight"
      });
    }
  };

  const addClaim = (newClaim) => {
    const id = `CLM-2026-${Math.floor(884 + Math.random() * 100)}`;
    const tx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
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
        { step: "Claim Submitted", timestamp: new Date().toLocaleString(), actor: user.name, state: "Completed" }
      ]
    };
    setClaims([claimRecord, ...claims]);
    
    // Log audit event
    const newAudit = {
      id: auditLogs.length + 1000,
      timestamp: new Date().toLocaleString(),
      actor: user.email,
      role: user.role,
      action: "Created New Claim",
      target: id,
      ip: "127.0.0.1"
    };
    setAuditLogs([newAudit, ...auditLogs]);
    return id;
  };

  const updateClaimStatus = (claimId, newStatus, remarks) => {
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
              actor: `${user.name} (${user.role}) - ${remarks || "Action processed"}`,
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

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        user,
        farms,
        addFarm,
        crops,
        policies,
        claims,
        addClaim,
        updateClaimStatus,
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

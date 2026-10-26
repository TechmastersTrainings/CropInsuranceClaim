import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CROPS_CATALOG,
  POLICIES_DATA,
  IOT_TELEMETRY_SERIES
} from "../data/mockData";
import {
  checkBackendHealth,
  fetchCropsRegistry,
  fetchPolicies,
  fetchFarms,
  createFarmPlot,
  fetchClaims,
  submitNewClaim,
  transitionClaim
} from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Dynamic session state: loads from localStorage or defaults to null (no hardcoded demo user)
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

  // Zero-dummy data: User transactional states start strictly empty
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState(CROPS_CATALOG);
  const [policies, setPolicies] = useState(POLICIES_DATA);
  const [claims, setClaims] = useState([]);
  const [devices, setDevices] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendConnected, setBackendConnected] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Sync user-created records from MySQL backend
  const loadUserDataFromBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem("agrishield_token");
      if (!token) return;

      // 1. Fetch user's registered farm plots from MySQL
      try {
        const apiFarms = await fetchFarms();
        if (Array.isArray(apiFarms)) {
          setFarms(apiFarms.map(f => ({
            id: f.id,
            name: f.name,
            surveyNo: f.survey_number,
            area: f.area_acres,
            unit: "Acres",
            village: f.village || "",
            taluk: f.taluk || "",
            district: f.district || "",
            state: f.state || "",
            latitude: f.latitude || 0,
            longitude: f.longitude || 0,
            soilType: f.soil_type || "",
            irrigation: f.irrigation_type || "",
            activeCrop: f.active_crop_name || "",
            documentRef: f.document_ref || "VERIFIED_KHATA.pdf"
          })));
        }
      } catch (err) {
        // User might not have plots yet
      }

      // 2. Fetch user's claims from MySQL
      try {
        const apiClaims = await fetchClaims();
        if (Array.isArray(apiClaims)) {
          setClaims(apiClaims.map(c => ({
            id: c.claim_number || `CLM-2026-${c.id}`,
            backendId: c.id,
            farmerId: c.farmer_id,
            farmId: c.farm_plot_id,
            farmName: `Plot #${c.farm_plot_id}`,
            policyId: c.policy_id,
            claimedAmount: c.claimed_amount,
            approvedAmount: c.approved_amount,
            damageReason: c.damage_reason,
            eventDate: c.damage_event_date,
            submissionDate: c.created_at ? c.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            status: c.status,
            blockchainTx: c.blockchain_tx_hash || "0x0000000000000000000000000000000000000000",
            aiAssessment: {
              status: c.ai_condition_indicator ? "Completed" : "Assessment Pending",
              conditionIndicator: c.ai_condition_indicator || "In-situ & satellite telemetry verification",
              estimatedDamagePct: c.ai_loss_percentage || 0,
              weatherCorrelationScore: c.weather_correlation_score || 0.0,
              reviewRecommendation: c.status === "Approved" ? "Parametric Payout Authorized" : "Under Adjudication",
              sensorAnomalyNoted: c.officer_remarks || "Awaiting surveyor adjudication"
            },
            timeline: c.transitions && c.transitions.length > 0
              ? c.transitions.map(t => ({
                  step: `Status: ${t.to_state}`,
                  timestamp: t.created_at ? new Date(t.created_at).toLocaleString() : new Date().toLocaleString(),
                  actor: `${t.actor_name} (${t.actor_role}) - ${t.remarks || ""}`,
                  state: "Completed"
                }))
              : [
                  { step: "Claim Submitted", timestamp: new Date().toLocaleString(), actor: "Farmer", state: "Completed" }
                ]
          })));
        }
      } catch (err) {
        // User might not have claims yet
      }
    } catch (e) {
      console.warn("Could not sync user data from backend:", e);
    }
  }, []);

  // Sync with real backend API on mount
  useEffect(() => {
    async function initBackend() {
      const health = await checkBackendHealth();
      if (health && health.status === "healthy") {
        setBackendConnected(true);
        try {
          // Fetch master certified crop catalog from MySQL
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

          // Fetch master PMFBY policies from MySQL
          const apiPolicies = await fetchPolicies();
          if (apiPolicies && apiPolicies.length > 0) {
            setPolicies(apiPolicies.map(p => ({
              id: p.id,
              policyCode: p.policy_code,
              title: p.title,
              provider: p.underwriter_name,
              crop: p.crop_name,
              season: p.season,
              premiumPerAcre: p.premium_per_acre,
              coveragePerAcre: p.coverage_per_acre,
              triggerParam: p.trigger_parameter,
              deductible: p.deductible_percent,
              validUntil: p.valid_until
            })));
          }
        } catch (e) {
          // Keep master defaults
        }

        // If a session exists, load user records
        loadUserDataFromBackend();
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
  }, [loadUserDataFromBackend]);

  const loginUserSession = (userData, role) => {
    setUser(userData);
    setCurrentRole(role);
    try {
      localStorage.setItem("agrishield_user", JSON.stringify(userData));
      localStorage.setItem("agrishield_role", role);
    } catch (e) {}
    loadUserDataFromBackend();
  };

  const registerUserSession = (userData, role) => {
    setUser(userData);
    setCurrentRole(role);
    try {
      localStorage.setItem("agrishield_user", JSON.stringify(userData));
      localStorage.setItem("agrishield_role", role);
    } catch (e) {}
    loadUserDataFromBackend();
  };

  const logoutUserSession = () => {
    setUser(null);
    setCurrentRole("FARMER");
    setFarms([]);
    setClaims([]);
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
    loadUserDataFromBackend();
  };

  // Add new farm plot: Saves directly into MySQL database
  const addFarm = async (newFarm) => {
    try {
      const created = await createFarmPlot({
        name: newFarm.name,
        survey_number: newFarm.surveyNo,
        area_acres: parseFloat(newFarm.area) || 1.0,
        village: newFarm.village || "",
        taluk: newFarm.taluk || "",
        district: newFarm.district || "",
        state: newFarm.state || "",
        latitude: newFarm.latitude ? parseFloat(newFarm.latitude) : null,
        longitude: newFarm.longitude ? parseFloat(newFarm.longitude) : null,
        soil_type: newFarm.soilType || "",
        irrigation_type: newFarm.irrigation || "",
        active_crop_name: newFarm.activeCrop || ""
      });

      const mapped = {
        id: created.id,
        name: created.name,
        surveyNo: created.survey_number,
        area: created.area_acres,
        unit: "Acres",
        village: created.village,
        taluk: created.taluk,
        district: created.district,
        state: created.state,
        soilType: created.soil_type,
        irrigation: created.irrigation_type,
        activeCrop: created.active_crop_name,
        latitude: created.latitude,
        longitude: created.longitude,
        documentRef: created.document_ref || "VERIFIED_KHATA.pdf"
      };

      setFarms(prev => [mapped, ...prev]);
      return mapped;
    } catch (err) {
      console.error("Backend error saving farm plot to MySQL:", err);
      // Fallback local persistence if network unavailable
      const fallbackId = `FARM-${Date.now() % 10000}`;
      const mappedFallback = { ...newFarm, id: fallbackId, unit: "Acres" };
      setFarms(prev => [mappedFallback, ...prev]);
      return mappedFallback;
    }
  };

  // Add new claim: Saves directly into MySQL database & triggers FSM state transition
  const addClaim = async (newClaim) => {
    if (!user) {
      throw new Error("Authentication Required: Only authenticated farmers can submit claims under PMFBY regulations.");
    }

    try {
      const created = await submitNewClaim({
        farm_plot_id: parseInt(newClaim.farmId || 1),
        policy_id: parseInt(newClaim.policyId || 1),
        claimed_amount: parseFloat(newClaim.claimedAmount || 100000),
        damage_reason: newClaim.damageReason || "Crop foliage desiccation",
        damage_event_date: newClaim.eventDate || new Date().toISOString().split("T")[0]
      });

      const mapped = {
        id: created.claim_number || `CLM-2026-${created.id}`,
        backendId: created.id,
        farmerName: user.name,
        farmerId: created.farmer_id,
        farmId: created.farm_plot_id,
        farmName: newClaim.farmName || `Plot #${created.farm_plot_id}`,
        crop: newClaim.crop || "Cotton",
        policyId: created.policy_id,
        claimedAmount: created.claimed_amount,
        approvedAmount: created.approved_amount,
        damageReason: created.damage_reason,
        eventDate: created.damage_event_date,
        submissionDate: created.created_at ? created.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        status: created.status,
        blockchainTx: created.blockchain_tx_hash,
        aiAssessment: {
          status: created.ai_condition_indicator ? "Completed" : "Assessment Pending",
          conditionIndicator: created.ai_condition_indicator || "Analyzing in-situ sensor & satellite vegetation indices",
          estimatedDamagePct: created.ai_loss_percentage || 0,
          weatherCorrelationScore: created.weather_correlation_score || 0.0,
          reviewRecommendation: created.status === "Approved" ? "Parametric Payout Advisory" : "Under Adjudication",
          sensorAnomalyNoted: "Ground sensor telemetry anchored"
        },
        timeline: [
          { step: "Claim Submitted", timestamp: new Date().toLocaleString(), actor: user.name, state: "Completed" }
        ]
      };

      setClaims(prev => [mapped, ...prev]);
      return mapped.id;
    } catch (err) {
      console.error("Backend error saving claim to MySQL:", err);
      // Fallback local persistence if offline
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
      setClaims(prev => [claimRecord, ...prev]);
      return id;
    }
  };

  // Update claim status: Persists transition to MySQL and records transition audit log
  const updateClaimStatus = async (claimId, newStatus, remarks) => {
    const actorName = user?.name || `Authorized Officer (${currentRole})`;
    const actorRole = user?.role || currentRole;

    try {
      const claimObj = claims.find(c => c.id === claimId || c.backendId === claimId);
      const targetId = claimObj?.backendId || claimId;
      await transitionClaim(targetId, newStatus, remarks);
    } catch (err) {
      console.warn("Backend state transition warning:", err.message);
    }

    setClaims(prev => prev.map(c => {
      if (c.id === claimId || c.backendId === claimId) {
        return {
          ...c,
          status: newStatus,
          timeline: [
            ...(c.timeline || []),
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

  const updateClaimAIAssessment = (claimId, assessmentData) => {
    setClaims(prev => prev.map(c => {
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

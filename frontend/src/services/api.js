// API client connecting the React frontend to the FastAPI backend service

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("agrishield_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login-json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Authentication failed");
  }
  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem("agrishield_token", data.access_token);
  }
  return data;
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }
  return await res.json();
}

export async function fetchCropsRegistry() {
  const res = await fetch(`${API_BASE_URL}/crops`);
  if (!res.ok) throw new Error("Failed to fetch crop registry");
  return await res.json();
}

export async function fetchFarms() {
  const res = await fetch(`${API_BASE_URL}/farms`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch farm plots");
  return await res.json();
}

export async function createFarmPlot(farmData) {
  const res = await fetch(`${API_BASE_URL}/farms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(farmData)
  });
  if (!res.ok) throw new Error("Failed to register plot");
  return await res.json();
}

export async function fetchPolicies() {
  const res = await fetch(`${API_BASE_URL}/policies`);
  if (!res.ok) throw new Error("Failed to fetch policies");
  return await res.json();
}

export async function fetchClaims() {
  const res = await fetch(`${API_BASE_URL}/claims`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch claims");
  return await res.json();
}

export async function submitNewClaim(claimData) {
  const res = await fetch(`${API_BASE_URL}/claims`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(claimData)
  });
  if (!res.ok) throw new Error("Failed to submit claim");
  return await res.json();
}

export async function transitionClaim(claimId, newStatus, remarks) {
  const res = await fetch(`${API_BASE_URL}/claims/${claimId}/transition`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ new_status: newStatus, remarks })
  });
  if (!res.ok) throw new Error("Failed to transition claim status");
  return await res.json();
}

export async function fetchTelemetry(farmPlotId = 1) {
  const res = await fetch(`${API_BASE_URL}/telemetry/readings?farm_plot_id=${farmPlotId}&limit=20`);
  if (!res.ok) throw new Error("Failed to fetch sensor telemetry");
  return await res.json();
}

export async function fetchBlockchainBlocks() {
  const res = await fetch(`${API_BASE_URL}/blockchain/blocks`);
  if (!res.ok) throw new Error("Failed to fetch blockchain ledger");
  return await res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE_URL}/audit/logs`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return await res.json();
}

export async function assessClaim(claimId, assessmentPayload = {}) {
  const res = await fetch(`${API_BASE_URL}/claims/${claimId}/assess`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(assessmentPayload)
  });
  if (!res.ok) throw new Error("Failed to assess claim with AI engine");
  return await res.json();
}

export async function ingestTelemetry(frame) {
  const res = await fetch(`${API_BASE_URL}/telemetry/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(frame)
  });
  if (!res.ok) throw new Error("Failed to ingest telemetry frame");
  return await res.json();
}

export async function fetchAllowedTransitions(claimId) {
  const res = await fetch(`${API_BASE_URL}/claims/${claimId}/allowed-transitions`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch allowed transitions");
  return await res.json();
}

export async function fetchStateMachineGraph() {
  const res = await fetch(`${API_BASE_URL}/claims/state-machine/graph`);
  if (!res.ok) throw new Error("Failed to fetch state machine graph");
  return await res.json();
}

export async function fetchCropAgronomicProfile(cropName) {
  const res = await fetch(`${API_BASE_URL}/crops/${encodeURIComponent(cropName)}/agronomic-profile`);
  if (!res.ok) throw new Error("Failed to fetch crop agronomic profile");
  return await res.json();
}

export async function evaluateParametricPayout(sumInsured, lossPercentage, deductiblePct = 10.0) {
  const res = await fetch(`${API_BASE_URL}/claims/evaluate-parametric-payout`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      sum_insured: sumInsured,
      loss_percentage: lossPercentage,
      deductible_pct: deductiblePct
    })
  });
  if (!res.ok) throw new Error("Failed to evaluate parametric payout");
  return await res.json();
}




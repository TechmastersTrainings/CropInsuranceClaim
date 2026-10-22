// Configurable Demonstration Datasets for AgriClaim Shield Prototype
// All demonstration data is clearly marked and ready for Phase 2 API substitution.

export const CROPS_CATALOG = [
  { id: "C01", name: "Cotton", season: "Kharif", cycleDays: 160, minTemp: 21, maxTemp: 38, minRain: 500, soilType: "Black Soil", moistureThreshold: 22 },
  { id: "C02", name: "Paddy (Rice)", season: "Kharif", cycleDays: 125, minTemp: 20, maxTemp: 35, minRain: 1000, soilType: "Clay Loam", moistureThreshold: 35 },
  { id: "C03", name: "Maize", season: "Kharif / Rabi", cycleDays: 105, minTemp: 18, maxTemp: 32, minRain: 600, soilType: "Sandy Loam", moistureThreshold: 20 },
  { id: "C04", name: "Soybean", season: "Kharif", cycleDays: 95, minTemp: 20, maxTemp: 32, minRain: 650, soilType: "Well-drained Loam", moistureThreshold: 24 },
  { id: "C05", name: "Wheat", season: "Rabi", cycleDays: 130, minTemp: 10, maxTemp: 26, minRain: 350, soilType: "Alluvial / Loam", moistureThreshold: 18 },
  { id: "C06", name: "Pulses (Chickpea/Tur)", season: "Rabi", cycleDays: 110, minTemp: 15, maxTemp: 30, minRain: 400, soilType: "Black Loam", moistureThreshold: 16 },
  { id: "C07", name: "Sugarcane", season: "Perennial", cycleDays: 360, minTemp: 20, maxTemp: 38, minRain: 1500, soilType: "Deep Rich Loam", moistureThreshold: 28 },
  { id: "C08", name: "Vegetables (Tomato/Onion)", season: "Zaid / Round-year", cycleDays: 80, minTemp: 18, maxTemp: 30, minRain: 500, soilType: "Loamy Sand", moistureThreshold: 25 },
  { id: "C09", name: "Fruits (Pomegranate/Banana)", season: "Perennial", cycleDays: 300, minTemp: 22, maxTemp: 36, minRain: 800, soilType: "Deep Alluvial", moistureThreshold: 26 }
];

export const FARMS_DATA = [
  {
    id: "FARM-101",
    name: "Green Valley North Plot",
    surveyNo: "SY-442/1B",
    area: 4.5,
    unit: "Acres",
    latitude: 15.3647,
    longitude: 75.1240,
    village: "Navalgund",
    district: "Dharwad",
    state: "Karnataka",
    soilType: "Black Cotton Soil",
    irrigation: "Borewell + Drip Irrigation",
    activeCrop: "Cotton",
    sowingDate: "2026-06-12",
    expectedHarvest: "2026-11-20",
    documentRef: "DOC-LAND-8821.pdf"
  },
  {
    id: "FARM-102",
    name: "Cauvery Basin South Plot",
    surveyNo: "SY-108/4A",
    area: 3.2,
    unit: "Acres",
    latitude: 12.3118,
    longitude: 76.6529,
    village: "Srirangapatna",
    district: "Mandya",
    state: "Karnataka",
    soilType: "Clay Loam",
    irrigation: "Canal Fed",
    activeCrop: "Paddy (Rice)",
    sowingDate: "2026-07-01",
    expectedHarvest: "2026-11-05",
    documentRef: "DOC-LAND-9043.pdf"
  },
  {
    id: "FARM-103",
    name: "Deccan Plateau East Plot",
    surveyNo: "SY-215/3",
    area: 5.0,
    unit: "Acres",
    latitude: 17.3850,
    longitude: 78.4867,
    village: "Shamshabad",
    district: "Rangareddy",
    state: "Telangana",
    soilType: "Red Sandy Loam",
    irrigation: "Rainfed + Rainwater Harvesting",
    activeCrop: "Soybean",
    sowingDate: "2026-06-25",
    expectedHarvest: "2026-10-15",
    documentRef: "DOC-LAND-7124.pdf"
  }
];

export const POLICIES_DATA = [
  {
    id: "POL-COTTON-2026",
    title: "Kharif Cotton Parametric Drought & Heat Shield",
    provider: "National Agri-Insurance Corp (NAIC)",
    licenseNo: "IRDAI/NL-104/AGRI",
    crop: "Cotton",
    season: "Kharif 2026",
    premiumPerAcre: 1450,
    coveragePerAcre: 35000,
    triggerParameter: "Rainfall < 15mm for 21 consecutive days OR Temp > 41°C for 5 days",
    deductiblePercent: 5,
    status: "Active",
    validUntil: "2026-12-31"
  },
  {
    id: "POL-PADDY-2026",
    title: "Monsoon Paddy Flood & Excessive Rain Guarantee",
    provider: "AgroSafe Mutual Insurance",
    licenseNo: "IRDAI/NL-209/AGRI",
    crop: "Paddy (Rice)",
    season: "Kharif 2026",
    premiumPerAcre: 1200,
    coveragePerAcre: 40000,
    triggerParameter: "Single-day Rainfall > 180mm OR Submerged for > 72 hours",
    deductiblePercent: 0,
    status: "Active",
    validUntil: "2026-11-30"
  },
  {
    id: "POL-SOY-2026",
    title: "Soybean Moisture Deficit Parametric Protection",
    provider: "Kisan Suraksha General Insurance",
    licenseNo: "IRDAI/NL-318/AGRI",
    crop: "Soybean",
    season: "Kharif 2026",
    premiumPerAcre: 980,
    coveragePerAcre: 28000,
    triggerParameter: "Soil Moisture Index < 14% at Pod Development Stage",
    deductiblePercent: 5,
    status: "Active",
    validUntil: "2026-10-31"
  }
];

export const CLAIMS_DATA = [
  {
    id: "CLM-2026-881",
    farmerName: "Basavaraj Patil",
    farmerId: "FMR-0012",
    farmId: "FARM-101",
    farmName: "Green Valley North Plot",
    crop: "Cotton",
    policyId: "POL-COTTON-2026",
    claimedAmount: 140000,
    damageReason: "Severe Prolonged Dry Spell & Thermal Desiccation",
    eventDate: "2026-09-18",
    status: "Approved",
    blockchainTx: "0x7f9a882c31e9014b2d398f6190a618e3881471329a174092bbf8924083aef110",
    submissionDate: "2026-09-22",
    aiAssessment: {
      status: "Assessment Complete",
      conditionIndicator: "Severe Vegetative Stress (Foliage Wilting)",
      estimatedDamagePct: 68.5,
      weatherCorrelationScore: 0.94,
      reviewRecommendation: "Automated Parametric Criteria Met",
      sensorAnomalyNoted: "Soil moisture below 12% for 18 continuous days"
    },
    timeline: [
      { step: "Claim Submitted", timestamp: "2026-09-22 10:14 IST", actor: "Farmer (Basavaraj)", state: "Completed" },
      { step: "Evidence Validated", timestamp: "2026-09-22 10:18 IST", actor: "Automated Validator", state: "Completed" },
      { step: "IoT & Weather Verified", timestamp: "2026-09-22 10:20 IST", actor: "Weather Oracle Gateway", state: "Completed" },
      { step: "Assessment Completed", timestamp: "2026-09-22 10:22 IST", actor: "Assessment Engine", state: "Completed" },
      { step: "Blockchain State Registered", timestamp: "2026-09-22 10:25 IST", actor: "Hyperledger Fabric Gateway", state: "Completed" },
      { step: "Approved by Officer", timestamp: "2026-09-23 14:05 IST", actor: "Officer Rajesh Kumar", state: "Completed" }
    ]
  },
  {
    id: "CLM-2026-882",
    farmerName: "Anand Murthy",
    farmerId: "FMR-0044",
    farmId: "FARM-102",
    farmName: "Cauvery Basin South Plot",
    crop: "Paddy (Rice)",
    policyId: "POL-PADDY-2026",
    claimedAmount: 110000,
    damageReason: "Flash Flood Waterlogging after Cloudburst",
    eventDate: "2026-10-02",
    status: "Under Review",
    blockchainTx: "0x3b1154c9a87d00f912e61a4982701bf4984210d7a6e19034bc4051a8823f0019",
    submissionDate: "2026-10-04",
    aiAssessment: {
      status: "Assessment Complete",
      conditionIndicator: "Submersion Canopy Discoloration",
      estimatedDamagePct: 42.0,
      weatherCorrelationScore: 0.88,
      reviewRecommendation: "Flagged for Physical Verification",
      sensorAnomalyNoted: "Rainfall station recorded 162mm; farm gauge offline"
    },
    timeline: [
      { step: "Claim Submitted", timestamp: "2026-10-04 09:30 IST", actor: "Farmer (Anand)", state: "Completed" },
      { step: "Evidence Uploaded", timestamp: "2026-10-04 09:35 IST", actor: "Farmer (Anand)", state: "Completed" },
      { step: "Assessment Completed", timestamp: "2026-10-04 09:40 IST", actor: "Assessment Engine", state: "Completed" },
      { step: "Review Pending", timestamp: "2026-10-04 09:45 IST", actor: "Assigned: Officer Priya V.", state: "In Progress" }
    ]
  },
  {
    id: "CLM-2026-883",
    farmerName: "Ramesh Goud",
    farmerId: "FMR-0089",
    farmId: "FARM-103",
    farmName: "Deccan Plateau East Plot",
    crop: "Soybean",
    policyId: "POL-SOY-2026",
    claimedAmount: 85000,
    damageReason: "Pod Rot & High Humidity Infestation",
    eventDate: "2026-10-10",
    status: "Settled",
    blockchainTx: "0x89201fba453cd9810a4729bc900134817a98214309aef901235614902188ab12",
    submissionDate: "2026-10-11",
    aiAssessment: {
      status: "Assessment Complete",
      conditionIndicator: "Severe Pod Lesion Formation",
      estimatedDamagePct: 74.0,
      weatherCorrelationScore: 0.96,
      reviewRecommendation: "Parametric Trigger Satisfied",
      sensorAnomalyNoted: "Relative humidity > 92% for 6 consecutive days"
    },
    timeline: [
      { step: "Claim Submitted", timestamp: "2026-10-11 11:00 IST", actor: "Farmer (Ramesh)", state: "Completed" },
      { step: "Approved", timestamp: "2026-10-12 16:30 IST", actor: "Officer Rajesh Kumar", state: "Completed" },
      { step: "Settlement Confirmed (Demo)", timestamp: "2026-10-13 10:15 IST", actor: "Payment Gateway Adapter", state: "Completed" }
    ]
  }
];

export const IOT_TELEMETRY_SERIES = [
  { time: "00:00", temp: 24.2, moisture: 18.5, humidity: 76, rainfall: 0.0 },
  { time: "03:00", temp: 23.0, moisture: 18.2, humidity: 82, rainfall: 0.0 },
  { time: "06:00", temp: 22.8, moisture: 17.9, humidity: 85, rainfall: 0.0 },
  { time: "09:00", temp: 28.5, moisture: 16.5, humidity: 65, rainfall: 0.0 },
  { time: "12:00", temp: 36.4, moisture: 14.1, humidity: 44, rainfall: 0.0 },
  { time: "15:00", temp: 39.8, moisture: 12.3, humidity: 36, rainfall: 0.0 },
  { time: "18:00", temp: 33.1, moisture: 12.0, humidity: 52, rainfall: 0.0 },
  { time: "21:00", temp: 27.6, moisture: 11.8, humidity: 68, rainfall: 0.0 }
];

export const SENSOR_DEVICES = [
  { id: "ESP-DEV-001", farm: "Green Valley North Plot", type: "Multi-Probe ESP32", battery: "94%", signal: "Strong (4G)", status: "Online", lastSync: "2 mins ago" },
  { id: "ESP-DEV-002", farm: "Cauvery Basin South Plot", type: "Soil & Rain Node", battery: "81%", signal: "Moderate (WiFi)", status: "Online", lastSync: "5 mins ago" },
  { id: "ESP-DEV-003", farm: "Deccan Plateau East Plot", type: "Micro-Weather Station", battery: "42%", signal: "Weak", status: "Warning", lastSync: "38 mins ago" },
  { id: "ESP-DEV-004", farm: "Reserve Testing Plot 4", type: "LoRaWAN Gateway", battery: "0%", signal: "Offline", status: "Offline", lastSync: "3 days ago" }
];

export const BLOCKCHAIN_LEDGER = [
  {
    blockNumber: 10428,
    txHash: "0x7f9a882c31e9014b2d398f6190a618e3881471329a174092bbf8924083aef110",
    channel: "cropinsurancechannel",
    chaincode: "claimlifecycle:1.0",
    event: "CLAIM_APPROVED",
    claimId: "CLM-2026-881",
    endorserMsp: "Org1MSP, Org2MSP",
    timestamp: "2026-09-23 14:05:22 UTC",
    status: "VALID"
  },
  {
    blockNumber: 10427,
    txHash: "0x5a18b99210e7401c9a081546b891024317a98214309aef901235614902188ab1",
    channel: "cropinsurancechannel",
    chaincode: "claimlifecycle:1.0",
    event: "ASSESSMENT_RECORDED",
    claimId: "CLM-2026-881",
    endorserMsp: "Org1MSP",
    timestamp: "2026-09-22 10:25:10 UTC",
    status: "VALID"
  },
  {
    blockNumber: 10426,
    txHash: "0x3b1154c9a87d00f912e61a4982701bf4984210d7a6e19034bc4051a8823f0019",
    channel: "cropinsurancechannel",
    chaincode: "claimlifecycle:1.0",
    event: "CLAIM_SUBMITTED",
    claimId: "CLM-2026-882",
    endorserMsp: "Org1MSP",
    timestamp: "2026-10-04 09:30:45 UTC",
    status: "VALID"
  },
  {
    blockNumber: 10425,
    txHash: "0x89201fba453cd9810a4729bc900134817a98214309aef901235614902188ab12",
    channel: "cropinsurancechannel",
    chaincode: "claimlifecycle:1.0",
    event: "SETTLEMENT_CONFIRMED",
    claimId: "CLM-2026-883",
    endorserMsp: "Org1MSP, Org2MSP",
    timestamp: "2026-10-13 10:15:02 UTC",
    status: "VALID"
  }
];

export const AUDIT_LOGS = [
  { id: 901, timestamp: "2026-10-23 01:14 IST", actor: "officer_rajesh@naic.in", role: "Insurance Officer", action: "Approved Claim Settlement", target: "CLM-2026-881", ip: "103.21.144.12" },
  { id: 900, timestamp: "2026-10-23 00:52 IST", actor: "system_gateway", role: "Oracle Gateway", action: "Weather Telemetry Sync", target: "FARM-101 (navalgund_stn)", ip: "127.0.0.1" },
  { id: 899, timestamp: "2026-10-22 23:40 IST", actor: "admin_security@agrishield.org", role: "Administrator", action: "Modified Policy Trigger Rule", target: "POL-COTTON-2026", ip: "14.139.122.9" },
  { id: 898, timestamp: "2026-10-22 21:10 IST", actor: "auditor_gov@agri.gov.in", role: "Auditor", action: "Exported Compliance State Hashes", target: "Channel: cropinsurancechannel", ip: "164.100.24.5" }
];

export const NOTIFICATIONS_DATA = [
  { id: "NOTIF-1", title: "Claim Approved", message: "Your claim CLM-2026-881 for Cotton has been approved by the insurance officer.", timestamp: "2 hours ago", read: false, type: "success" },
  { id: "NOTIF-2", title: "Extreme Weather Alert", message: "High heat anomaly detected in Dharwad district. Sensor telemetry indicates soil moisture near threshold.", timestamp: "5 hours ago", read: false, type: "warning" },
  { id: "NOTIF-3", title: "Blockchain State Anchored", message: "Transaction for CLM-2026-882 anchored on Hyperledger Fabric block #10426.", timestamp: "1 day ago", read: true, type: "info" }
];

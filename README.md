# AgriClaim Shield | AI, IoT & Blockchain Crop Insurance Automation

[![CI](https://github.com/TechmastersTrainings/CropInsuranceClaim/actions/workflows/ci.yml/badge.svg)](https://github.com/TechmastersTrainings/CropInsuranceClaim/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.161.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)](https://react.dev)
[![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger_Fabric-v2.5-2F3136.svg?logo=hyperledger)](https://www.hyperledger.org/projects/fabric)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python)](https://python.org)
[![Pytest](https://img.shields.io/badge/Pytest-45%20Passed-brightgreen.svg?logo=pytest)](https://pytest.org)

AgriClaim Shield is an enterprise-grade, end-to-end prototype for automated parametric crop insurance claims. It unifies in-situ IoT telemetry probes, agronomic machine learning damage assessment models, and Hyperledger Fabric distributed smart contracts to automate claim adjudication, prevent fraud, and expedite payouts for smallholder farmers.

---

## Architecture Overview

```
                                  +----------------------------------------------------+
                                  |         React 18 + Vite Web Application            |
                                  |   (25 Screens, Multilingual: EN / HI / KN, RBAC)   |
                                  +-------------------------+--------------------------+
                                                            | HTTP / REST (JWT)
                                                            ▼
+--------------------------------------------------------------------------------------------------------------------+
|                                              FastAPI Backend Service                                               |
|                                         (Port 8000 | SQLAlchemy 2.x | Pydantic)                                     |
+--------------------------+--------------------------------+--------------------------------+-----------------------+
                           |                                |                                |
                           ▼                                ▼                                ▼
              +--------------------------+    +---------------------------+    +---------------------------+
              |    Agronomic AI Engine   |    |    IoT Ingestion Hub      |    | Hyperledger Fabric Client |
              |  - Damage Classifier     |    |  - CRC32 Checksumming     |    |  - Merkle Root Hashing    |
              |  - Loss Regressor        |    |  - Anti-Replay Counter    |    |  - SHA-256 Block Chaining |
              |  - Anomaly Detector      |    |  - Store-and-Forward      |    |  - Multi-Party Signatures |
              |  - Section 25 IP Shield  |    |  - ESP32 Firmware C++     |    |  - Go Smart Contract      |
              +--------------------------+    +---------------------------+    +---------------------------+
                           |                                |                                |
                           +--------------------------------+--------------------------------+
                                                            |
                                                            ▼
                                              +----------------------------+
                                              |   PostgreSQL / SQLite DB   |
                                              | (Dual-Driver Auto-Fallback)|
                                              +----------------------------+
```

---

## Key Features

1. **Multi-Role RBAC**:
   - **Farmer**: Plot registration, crop cycle tracking, parametric claim submission, geotagged evidence upload.
   - **Insurance Officer**: Multi-evidence fusion workspace, algorithmic loss review, state transition authorization (`Approved`, `Under Review`, `Rejected`, `Settled`).
   - **System Administrator**: Multi-crop parameters, parametric policy triggers, hardware device registry, security token rotation.
   - **Government Auditor / Regulator**: Sovereign ledger inspection, cryptographic hash verification, compliance audits.

2. **Multi-Crop Registry (9 Supported Crops)**:
   - Cotton, Paddy (Rice), Maize, Soybean, Wheat, Pulses, Sugarcane, Vegetables, Fruits.

3. **10-State Claim Lifecycle**:
   - `Draft` -> `Submitted` -> `Evidence Verification` -> `Under Review` -> `Field Survey Assigned` -> `Survey Completed` -> `Approved` / `Rejected` -> `Settlement In Progress` -> `Settled` -> `Closed`.

4. **Section 25 IP Confidentiality Protection**:
   - Proprietary neural network architectures, internal model weights, and server-side prompts are strictly confidential.
   - External APIs and frontend screens only receive business-level indicators (`damage_category`, `severity_level`, `estimated_loss_percentage`, `weather_correlation_score`, `advisory_rationale`).

5. **Hardware-Accurate IoT Subsystem**:
   - Production ESP32 C++ firmware (`iot/firmware/esp32_firmware.ino`) with calibrated ADC soil moisture conversion, DHT22 readings, hardware interrupt rain gauge pulse counter, and SPIFFS flash store-and-forward offline buffer.
   - Multi-device fleet simulator (`iot/simulator/esp32_simulator.py`) supporting `NORMAL`, `DROUGHT`, `FLOOD`, and `HEATWAVE` agronomic operational profiles.

6. **Cryptographic Blockchain Ledger**:
   - Hyperledger Fabric Go chaincode (`blockchain/chaincode/crop_insurance_contract.go`).
   - Python Fabric Gateway SDK (`blockchain/client/gateway.py`) with binary Merkle tree root hashing for sensor batches and cryptographic hash pointer verification from Genesis Block 0 to Tip.

---

## Directory Structure

```
crop-insurance-system/
├── ai/                              # Agronomic AI Subsystem
│   ├── datasets/                    # Stratified benchmark dataset (1,200 records)
│   ├── models/                      # Serialized ML models (Joblib)
│   ├── preprocessing/               # Image & sensor time-series pipelines
│   ├── training/                    # Damage classifier & anomaly detector training scripts
│   ├── evaluation/                  # Benchmark report & metric evaluation
│   ├── inference/                   # Section 25 compliant crop damage predictor
│   └── tests/                       # AI unit & confidentiality tests
├── backend/                         # FastAPI Backend Application
│   ├── app/
│   │   ├── api/v1/                  # REST endpoints (Auth, Claims, Farms, Policies, Telemetry, Ledger)
│   │   ├── core/                    # Config, security, JWT, password hashing
│   │   ├── db/                      # Session, models, auto-seed data
│   │   ├── models/                  # SQLAlchemy 2.x ORM models
│   │   └── schemas/                 # Pydantic v2 validation schemas
│   ├── tests/                       # Pytest test suite (Auth, Claims, Farms, Telemetry, E2E)
│   └── Dockerfile                   # Production Python 3.11 containerfile
├── blockchain/                      # Distributed Ledger Subsystem
│   ├── chaincode/                   # Hyperledger Fabric Go Smart Contract
│   ├── client/                      # Fabric Gateway SDK with Merkle trees & block chaining
│   └── tests/                       # Immutability, tamper detection & lifecycle tests
├── frontend/                        # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/              # Modals, Navbar, Layout, Stats
│   │   ├── context/                 # AppContext (RBAC, multilingual, state)
│   │   ├── localization/            # English, Hindi, Kannada dictionaries
│   │   ├── pages/                   # All 25 required screens
│   │   └── services/                # API client connecting frontend to backend
│   ├── nginx.conf                   # Nginx reverse proxy configuration
│   └── Dockerfile                   # Multi-stage production containerfile
├── iot/                             # IoT Embedded & Simulation Subsystem
│   ├── firmware/                    # Production ESP32 C++ firmware (Arduino/ESP-IDF)
│   ├── simulator/                   # ESP32 hardware simulator & anomaly injector
│   └── tests/                       # Firmware physics, CRC32 & buffer tests
├── .github/workflows/ci.yml         # GitHub Actions CI workflow
├── docker-compose.yml               # Multi-service container orchestration
├── pytest.ini                       # Test configuration file
└── README.md                        # Documentation
```

---

## Quick Start Guide

### Option 1: Docker Compose (Production Stack)

Clone the repository and spin up all 4 microservices with a single command:

```bash
git clone https://github.com/TechmastersTrainings/CropInsuranceClaim.git
cd CropInsuranceClaim
docker compose up --build -d
```

- **Frontend Application**: `http://localhost:5173` or `http://localhost:80`
- **FastAPI Interactive Docs (Swagger)**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432`

---

### Option 2: Local Development Setup

#### 1. Backend & AI Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate       # On Windows
# source venv/bin/activate    # On Linux/macOS

pip install -r requirements.txt
```

Run database migrations and start server:
```bash
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Access the frontend at `http://127.0.0.1:5173`.

---

## Running the Automated Test Suite

All 45 automated unit, integration, and security tests can be executed across all components with:

```bash
.\backend\venv\Scripts\python.exe -m pytest -v
```

### Test Suite Distribution

| Component | Test File | Test Count | Description |
| :--- | :--- | :---: | :--- |
| **Backend Auth** | `backend/tests/test_auth.py` | 6 | JWT login, password bcrypt, duplicate email rejection, /me profile |
| **Backend Claims** | `backend/tests/test_claims_workflow.py` | 5 | Wizard submission, evidence SHA-256 hashing, insurer adjudication, AI endpoint |
| **Backend E2E** | `backend/tests/test_e2e_parametric_claim.py` | 1 | Full multi-phase lifecycle (Plot -> IoT -> Claim -> AI -> Evidence -> Payout -> Chain) |
| **Backend Farms** | `backend/tests/test_farms_crops.py` | 3 | Multi-crop registry, plot creation, farmer data isolation |
| **Backend Security**| `backend/tests/test_security_confidentiality.py`| 4 | RBAC privilege escalation blocked, unauthenticated rejection, Section 25 verification |
| **Backend Telemetry**| `backend/tests/test_telemetry.py` | 3 | Ingestion, CRC32 verification, time-series query, device registry |
| **AI Subsystem** | `ai/tests/test_*.py` | 10 | Classifier, regressor, anomaly detection, ExG image extraction, Section 25 IP protection |
| **IoT Subsystem** | `iot/tests/test_*.py` | 6 | ESP32 physics, CRC32 consistency, offline flash buffering, API frame ingestion |
| **Blockchain** | `blockchain/tests/test_*.py` | 7 | Merkle tree calculation, SHA-256 block pointers, ledger immutability & tamper detection |
| **Total** | | **45 Passed** | **100% Pass Rate** |

---

## Default Seed Credentials

| Role | Email | Password | Preloaded Context |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer.rajesh@agrishield.org` | `Farmer@2026` | Dharwad North Plot #4B (Cotton), Policy POL-2026-KA-001 |
| **Insurer** | `officer.suresh@icici-agri.com` | `Insurer@2026` | Claims Adjudication & Payout Authorization |
| **Administrator** | `admin.sunita@agrishield.org` | `Admin@2026` | Multi-crop configurations, policy underwriting parameters |
| **Auditor** | `v.sharma@agri.gov.in` | `Auditor@2026` | Blockchain ledger inspection & sovereign regulatory audit |

---

## License & Intellectual Property
Developed for AgriClaim Shield parametric insurance research and development. In compliance with Platform Security Policy (Section 25), all machine learning model weights, proprietary architectures, and server prompts remain strictly protected behind authorized server boundaries.

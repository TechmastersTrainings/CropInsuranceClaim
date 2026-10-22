import React, { useState } from "react";
import { Upload, FileCheck, CheckCircle2, Shield, Image, FileText, Trash2, Hash } from "lucide-react";
import { useApp } from "../context/AppContext";

export function EvidenceUploadPage() {
  const { claims } = useApp();
  const [selectedClaimId, setSelectedClaimId] = useState(claims[0]?.id || "");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [filesList, setFilesList] = useState([
    {
      id: "EV-01",
      filename: "Cotton_Canopy_Desiccation_01.jpg",
      size: "3.2 MB",
      gps: "15.3647° N, 75.1240° E",
      timestamp: "2026-09-21 14:22 IST",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      type: "Foliage Wilting Photo"
    },
    {
      id: "EV-02",
      filename: "Soil_Moisture_Sensor_InSitu.jpg",
      size: "2.1 MB",
      gps: "15.3648° N, 75.1241° E",
      timestamp: "2026-09-21 14:28 IST",
      sha256: "cca99371089ae1e66c9ad84183863ca3e41e4649b934ca495991b7852b82098",
      type: "IoT Probe In-Field Proof"
    },
    {
      id: "EV-03",
      filename: "Pahani_Land_Record_RTC.pdf",
      size: "1.4 MB",
      gps: "Navalgund Taluk Office",
      timestamp: "2026-09-22 09:10 IST",
      sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      type: "Official Cadastral Record"
    }
  ]);

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `EV-0${filesList.length + 1}`,
      filename: `Crop_Damage_Geotag_${Date.now().toString().slice(-4)}.jpg`,
      size: "2.8 MB",
      gps: "15.3647° N, 75.1240° E",
      timestamp: new Date().toLocaleString(),
      sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      type: "Field Evidence"
    };
    setFilesList([newDoc, ...filesList]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Upload size={28} />
            <span>Claim Evidence & Geotagged Proof Upload</span>
          </h1>
          <p className="page-subtitle">
            Secure off-chain document repository with cryptographic SHA-256 fingerprinting on Hyperledger Fabric.
          </p>
        </div>
      </div>

      {uploadSuccess && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>Evidence item uploaded, SHA-256 hash computed, and cryptographic receipt generated.</span>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Upload Form Box */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <div className="card-header">
            <h3 className="card-title">Upload New Evidence</h3>
          </div>

          <form onSubmit={handleSimulateUpload}>
            <div className="form-group">
              <label className="form-label">Link to Claim ID</label>
              <select
                className="form-control"
                value={selectedClaimId}
                onChange={(e) => setSelectedClaimId(e.target.value)}
              >
                {claims.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.crop} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Evidence Category</label>
              <select className="form-control">
                <option value="photo">Field Foliage / Crop Damage Photo</option>
                <option value="drone">Drone Orthomosaic Map</option>
                <option value="soil">Ground Soil Test Certificate</option>
                <option value="revenue">Pahani / RTC Cadastral Title</option>
              </select>
            </div>

            {/* Drag & drop simulated container */}
            <div style={{
              border: "2px dashed var(--border-light)",
              borderRadius: "var(--radius-md)",
              padding: "24px 16px",
              textAlign: "center",
              background: "var(--bg-subtle)",
              cursor: "pointer",
              marginBottom: 16
            }}>
              <Upload size={32} color="var(--color-primary)" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Click to Select File</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                Supports JPEG, PNG, GeoTIFF, PDF (Max 15MB)
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              <Upload size={16} /> Upload & Fingerprint Evidence
            </button>
          </form>

          <div style={{ marginTop: 16, padding: 12, background: "var(--color-info-soft)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--color-info)" }}>
            <Shield size={14} style={{ display: "inline", marginRight: 4 }} />
            In compliance with Section 13, raw heavy media files are stored off-chain while only cryptographic content hashes are registered to the smart contract.
          </div>
        </div>

        {/* Existing Evidence List */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <h3 className="card-title">Registered Evidence Inventory ({filesList.length} Items)</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filesList.map((f) => (
              <div
                key={f.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-surface)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{
                    padding: 10,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-primary-soft)",
                    color: "var(--color-primary)"
                  }}>
                    {f.filename.endsWith(".pdf") ? <FileText size={22} /> : <Image size={22} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.925rem" }}>{f.filename}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                      {f.type} | Size: {f.size} | Timestamp: {f.timestamp}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-primary-light)", marginTop: 2 }}>
                      Geotag: {f.gps}
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: "0.72rem",
                      color: "var(--text-subtle)",
                      fontFamily: "var(--font-mono)",
                      marginTop: 4
                    }}>
                      <Hash size={12} /> SHA-256: {f.sha256}
                    </div>
                  </div>
                </div>

                <span className="badge badge-approved">Hash Anchored</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

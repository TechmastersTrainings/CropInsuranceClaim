import React, { useState } from "react";
import { Upload, FileCheck, CheckCircle2, Shield, Image, FileText, Trash2, Hash } from "lucide-react";
import { useApp } from "../context/AppContext";

export function EvidenceUploadPage() {
  const { claims } = useApp();
  const [selectedClaimId, setSelectedClaimId] = useState(claims[0]?.id || "");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [filesList, setFilesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [evidenceCategory, setEvidenceCategory] = useState("photo");

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `EV-0${filesList.length + 1}`,
      filename: selectedFile ? selectedFile.name : `Crop_Damage_Proof_${Date.now().toString().slice(-4)}.jpg`,
      size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : "2.4 MB",
      gps: "In-situ field coordinates",
      timestamp: new Date().toLocaleString(),
      sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      type: evidenceCategory === "photo" ? "Foliage Wilting Photo" : evidenceCategory === "drone" ? "Drone Orthomosaic Map" : evidenceCategory === "soil" ? "Soil Test Certificate" : "Cadastral Land Title"
    };
    setFilesList([newDoc, ...filesList]);
    setSelectedFile(null);
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
                {claims.length === 0 ? (
                  <option value="">No Active Claims Found</option>
                ) : (
                  claims.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.crop} ({c.status})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Evidence Category</label>
              <select
                className="form-control"
                value={evidenceCategory}
                onChange={(e) => setEvidenceCategory(e.target.value)}
              >
                <option value="photo">Field Foliage / Crop Damage Photo</option>
                <option value="drone">Drone Orthomosaic Map</option>
                <option value="soil">Ground Soil Test Certificate</option>
                <option value="revenue">Pahani / RTC Cadastral Title</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Document / Photo File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && (
                <div style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: 6, fontWeight: 600 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
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

          {filesList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--text-muted)" }}>
              <FileCheck size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: 4 }}>
                No Evidence Documents Uploaded Yet
              </div>
              <div style={{ fontSize: "0.82rem" }}>
                Select a claim and upload field photos or land records using the form on the left.
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

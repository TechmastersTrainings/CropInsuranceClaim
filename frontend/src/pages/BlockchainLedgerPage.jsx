import React, { useState } from "react";
import { Layers, ShieldCheck, Hash, CheckCircle2, Search, ExternalLink, Cpu, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

export function BlockchainLedgerPage() {
  const { ledger } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = ledger.filter(b =>
    b.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Layers size={28} color="var(--color-blockchain)" />
            <span>Hyperledger Fabric Audit Ledger</span>
          </h1>
          <p className="page-subtitle">
            Immutable, peer-endorsed state transitions for parametric crop insurance claims.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge badge-blockchain" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
            <ShieldCheck size={16} /> Channel: cropinsurancechannel (Active)
          </span>
        </div>
      </div>

      {/* Network Health KPI Summary */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Current Block Height</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-blockchain)", marginTop: 4 }}>
            #{ledger[0]?.blockNumber || 10428}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-primary-light)", marginTop: 2 }}>Zero orphaned blocks</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Endorsing Peers</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
            4 Peers (2 Orgs)
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Org1MSP, Org2MSP</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Consensus Engine</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-main)", marginTop: 4 }}>
            Raft (CFT)
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", marginTop: 2 }}>Leader synced</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Smart Contract (Chaincode)</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-main)", marginTop: 4 }}>
            claimlifecycle:1.0
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Deterministic execution</div>
        </div>
      </div>

      {/* Search block explorer */}
      <div className="card" style={{ padding: "12px 18px", marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: 11, color: "var(--text-muted)" }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search blocks by Tx Hash, Claim ID (e.g. CLM-2026-881), or Event Name..."
            style={{ paddingLeft: 34 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blocks Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Block #</th>
                <th>Lifecycle Event</th>
                <th>Target Claim ID</th>
                <th>Cryptographic Transaction Hash</th>
                <th>Endorsers</th>
                <th>Timestamp (UTC)</th>
                <th>Validation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.blockNumber}>
                  <td>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--color-blockchain)" }}>
                      #{b.blockNumber}
                    </strong>
                  </td>
                  <td>
                    <span className="badge badge-blockchain">{b.event}</span>
                  </td>
                  <td>
                    <strong>{b.claimId}</strong>
                  </td>
                  <td>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--text-main)"
                    }}>
                      {b.txHash.slice(0, 16)}...{b.txHash.slice(-8)}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{b.endorserMsp}</span>
                  </td>
                  <td>{b.timestamp}</td>
                  <td>
                    <span className="badge badge-approved">
                      <CheckCircle2 size={12} /> {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

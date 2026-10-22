import React, { useState } from "react";
import { Users, Plus, Shield, CheckCircle2, UserCheck, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";

export function UserManagementPage() {
  const [usersList, setUsersList] = useState([
    { id: "USR-001", name: "Basavaraj Patil", email: "patil.farmer@agrishield.org", role: "FARMER", status: "Active", joined: "2026-05-10" },
    { id: "USR-202", name: "Rajesh Kumar", email: "rajesh.kumar@naic.in", role: "INSURER", status: "Active", joined: "2026-04-18" },
    { id: "USR-999", name: "Dr. Sunita Rao", email: "admin.sunita@agrishield.org", role: "ADMIN", status: "Active", joined: "2026-01-01" },
    { id: "USR-707", name: "V. Sharma", email: "v.sharma@agri.gov.in", role: "AUDITOR", status: "Active", joined: "2026-06-01" },
    { id: "USR-002", name: "Anand Murthy", email: "anand.m@farmer.agrishield.org", role: "FARMER", status: "Active", joined: "2026-06-12" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "FARMER"
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      joined: new Date().toISOString().split("T")[0]
    };
    setUsersList([...usersList, created]);
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} />
            <span>User & Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="page-subtitle">
            Section 6 Compliance: Granular permissions for Farmers, Insurance Officers, Administrators and Auditors.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Provision User</span>
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Access Scope</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td><strong style={{ fontFamily: "var(--font-mono)" }}>{u.id}</strong></td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-rejected' : u.role === 'INSURER' ? 'badge-review' : u.role === 'AUDITOR' ? 'badge-blockchain' : 'badge-approved'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td><span className="badge badge-approved">{u.status}</span></td>
                  <td>{u.joined}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {u.role === "FARMER" && "Own farm plots & claims"}
                    {u.role === "INSURER" && "All claims & policy reviews"}
                    {u.role === "ADMIN" && "Full administrative control"}
                    {u.role === "AUDITOR" && "Read-only blockchain ledger & logs"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision Platform User"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ramesh Chandra"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. ramesh@agrishield.org"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role Assignment</label>
            <select
              className="form-control"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="FARMER">Farmer</option>
              <option value="INSURER">Insurance Officer</option>
              <option value="ADMIN">System Administrator</option>
              <option value="AUDITOR">Auditor / Regulator</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Provision User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

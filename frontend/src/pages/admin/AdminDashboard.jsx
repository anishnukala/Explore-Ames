import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/adminDashboard.css";

import {
  fetchUsers,
  fetchUserStats,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../utils/usersApi.js";

function formatMonthYear(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function splitName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "User",
  };
}

function normalizeUser(u) {
  return {
    id: u.id || u._id,
    name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    email: u.email,
    role: u.role || "user",
    createdAt: u.createdAt || u.created_at || u.created || null,
  };
}

function computeStats(users) {
  const total = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const members = users.filter((u) => u.role === "user" || u.role === "member").length;
  const guests = 0;
  return { total, admins, members, guests };
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, members: 0, guests: 0 });

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const refresh = async () => {
    try {
      const raw = await fetchUsers();
      const normalized = Array.isArray(raw) ? raw.map(normalizeUser) : [];
      setUsers(normalized);

      try {
        const s = await fetchUserStats();
        if (s && typeof s === "object" && "total" in s) setStats(s);
        else setStats(computeStats(normalized));
      } catch {
        setStats(computeStats(normalized));
      }
    } catch (e) {
      console.error(e);
      setUsers([]);
      setStats({ total: 0, admins: 0, members: 0, guests: 0 });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const recentUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    return sorted.slice(0, 8);
  }, [users]);

  const openAdd = () => {
    setMode("add");
    setEditingId(null);
    setName("");
    setEmail("");
    setRole("user");
    setPassword("");
    setErr("");
    setMsg("");
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setEditingId(u.id);
    setName(u.name || "");
    setEmail(u.email || "");
    setRole(u.role || "user");
    setPassword("");
    setErr("");
    setMsg("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErr("");
    setMsg("");
  };

  // ✅ PERFECT CREATE + UPDATE (SYNCED WITH BACKEND)
  const handleSave = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      if (!name.trim() || !email.trim()) {
        setErr("Name and email are required.");
        return;
      }

      const { firstName, lastName } = splitName(name.trim());

      if (mode === "add") {
        await createUserApi({
          firstName,
          lastName,
          email: email.trim(),
          role,
          password: password.trim() || "user123",
        });
        setMsg("✅ User created");
      } else {
        await updateUserApi(editingId, {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          email: email.trim(),
          role,
          ...(password.trim() ? { password: password.trim() } : {}),
        });
        setMsg("✅ User updated");
      }

      await refresh();

      setTimeout(() => {
        setModalOpen(false);
        setMsg("");
      }, 600);
    } catch (e2) {
      console.error(e2);
      setErr(e2?.response?.data?.message || e2.message || "Operation failed");
    }
  };

  const handleDelete = async (u) => {
    const ok = window.confirm(`Delete ${u.name} (${u.email})?`);
    if (!ok) return;

    try {
      await deleteUserApi(u.id);
      await refresh();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <h2 className="admin-title">Dashboard Overview</h2>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p>Total Users</p>
            <h3>{stats.total}</h3>
            <span className="stat-positive">stored accounts</span>
          </div>

          <div className="admin-stat-card">
            <p>Admins</p>
            <h3>{stats.admins}</h3>
            <span className="stat-positive">active admins</span>
          </div>

          <div className="admin-stat-card">
            <p>Members</p>
            <h3>{stats.members}</h3>
            <span className="stat-positive">registered members</span>
          </div>

          <div className="admin-stat-card">
            <p>Guests</p>
            <h3>{stats.guests}</h3>
            <span className="stat-positive">not stored</span>
          </div>
        </div>

        <h3 className="admin-subtitle">Pages</h3>
        <div className="admin-pages-grid">
          <div className="admin-page-card" onClick={() => navigate("/")}>Home</div>
          <div className="admin-page-card" onClick={() => navigate("/admin/diners")}>Diners</div>
          <div className="admin-page-card" onClick={() => navigate("/admin/explore")}>Explore</div>
          <div className="admin-page-card" onClick={() => navigate("/admin/shop")}>Shop</div>
          <div className="admin-page-card" onClick={() => navigate("/admin/faq")}>FAQ</div>
        </div>

        <div className="admin-users-card">
          <div className="admin-users-header">
            <h3>Recent Users</h3>
            <button className="add-user-btn" type="button" onClick={openAdd}>
              + Add User
            </button>
          </div>

          {recentUsers.length === 0 ? (
            <p style={{ padding: "10px 0", color: "#607163", fontWeight: 700 }}>
              No users found in database.
            </p>
          ) : (
            recentUsers.map((u) => (
              <div className="admin-user-row" key={u.id}>
                <div>
                  <strong>{u.name || "—"}</strong>
                  <p>{u.email}</p>
                </div>

                <span className={`role ${u.role === "admin" ? "admin" : "member"}`}>
                  {u.role === "admin" ? "Admin" : "Member"}
                </span>

                <span className="date">{formatMonthYear(u.createdAt)}</span>

                <div className="actions">
                  <button className="edit" type="button" onClick={() => openEdit(u)}>
                    Edit
                  </button>
                  <button className="delete" type="button" onClick={() => handleDelete(u)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 18,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 100%)",
              background: "#fff",
              borderRadius: 18,
              padding: 18,
              boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>
                {mode === "add" ? "Add User" : "Edit User"}
              </div>
              <button
                onClick={closeModal}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #cfdcc7",
                  fontSize: "0.95rem",
                  marginBottom: 10,
                }}
              />

              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #cfdcc7",
                  fontSize: "0.95rem",
                  marginBottom: 10,
                }}
              />

              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #cfdcc7",
                  fontSize: "0.95rem",
                  marginBottom: 10,
                }}
              >
                <option value="user">Member</option>
                <option value="admin">Admin</option>
              </select>

              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
                {mode === "add" ? "Password" : "New Password (optional)"}
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "add" ? "Set password" : "Leave blank to keep current"}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #cfdcc7",
                  fontSize: "0.95rem",
                }}
              />

              {err && <div style={{ marginTop: 10, color: "#b00020", fontWeight: 800 }}>{err}</div>}
              {msg && <div style={{ marginTop: 10, color: "#2f6b34", fontWeight: 900 }}>{msg}</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    border: "1px solid #d0e6c7",
                    background: "#f6ffed",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    border: "none",
                    background: "#2f6b34",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {mode === "add" ? "Create User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
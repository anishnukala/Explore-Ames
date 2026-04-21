import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const res = await axios.get(`/api/users/${id}`);
        setForm({
          username: res.data.username || "",
          email: res.data.email || "",
          role: res.data.role || "user",
          password: "",
        });
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Could not load user.");
      }
    }

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (id) {
        // update
        await axios.put(`/api/users/${id}`, form);
      } else {
        // create
        await axios.post("/api/users", form);
      }
      navigate("/admin/users");
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Could not save user.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2>{id ? "Edit User" : "Create User"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder={id ? "Leave blank to keep current" : "Set a password"}
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}
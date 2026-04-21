// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../assets/css/Signup.css";

import api from "../utils/api";
import { loginUser } from "../utils/auth.js";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);

    const firstName = (data.get("firstName") || "").trim();
    const lastName = (data.get("lastName") || "").trim();
    const email = (data.get("email") || "").trim().toLowerCase();
    const password = (data.get("password") || "").trim();
    const agree = data.get("agree") === "on";

    if (!agree) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      // ✅ send to backend
      // backend route: POST http://localhost:4000/auth/signup
      const res = await api.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        role: role || "user",
      });

      // ✅ save user + token (auth.js should support loginUser(user, token))
      loginUser(res.data.user, res.data.token);

      // ✅ go home after signup
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-card-header">
          <img src={logo} alt="Explore Ames logo" className="signup-logo" />

          <h1 className="signup-title">Create an account</h1>
          <p className="signup-subtitle">
            Welcome! Create an account to start exploring Ames.
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Role select */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
            </select>
          </div>

          {/* First & last name row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="John"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter a password"
            />
          </div>

          {/* Terms */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="agree" required />
              <span>
                I agree to the <span className="linkish">Terms</span> and{" "}
                <span className="linkish">Conditions</span>
              </span>
            </label>
          </div>

          {/* ✅ Error message */}
          {error && (
            <div style={{ color: "#b00020", fontWeight: 700, marginTop: 6 }}>
              {error}
            </div>
          )}

          <button type="submit" className="signup-button" disabled={submitting}>
            {submitting ? "Creating…" : "Create free account"}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
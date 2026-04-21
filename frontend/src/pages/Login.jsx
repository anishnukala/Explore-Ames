import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../assets/css/Login.css";

import api from "../utils/api";
import { loginUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);

    // ✅ Normalize email
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    // ✅ IMPORTANT: do NOT trim password
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      // ✅ MUST match backend route: /api/auth/login
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data || {};

      if (!user || !token) {
        setError("Invalid email or password.");
        return;
      }

      // ✅ Save auth session
      loginUser(user, token);

      // ✅ Redirect to originally requested page if exists
      const redirectTo = location.state?.from?.pathname;
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      // ✅ Role-based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <img src={logo} alt="Explore Ames logo" className="login-logo" />
          <h1 className="login-title">Log in</h1>
          <p className="login-subtitle">Welcome back! Log in to continue.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                color: "#b00020",
                fontWeight: "600",
                marginTop: "8px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="login-footer-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

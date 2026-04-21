import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, hasRole } from "../utils/auth.js";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();

  // not logged in -> go login
  if (!isLoggedIn()) {
    // if they tried admin page, send them to /admin/login, else /login
    const wantsAdmin = location.pathname.startsWith("/admin");
    return <Navigate to={wantsAdmin ? "/admin/login" : "/login"} replace />;
  }

  // logged in but wrong role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
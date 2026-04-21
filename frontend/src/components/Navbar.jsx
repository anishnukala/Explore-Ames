// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { useCart } from "../../Context/CartContext.jsx";
import { getUser, logoutUser } from "../utils/auth.js";

function Navbar() {
  const navigate = useNavigate();

  // auth state (reads from localStorage via auth.js)
  const [user, setUser] = useState(getUser());

  // keep navbar synced when login/logout happens in same tab
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, []);

  const isAdmin = user?.role === "admin";

  // cart (safe even if provider not wrapped)
  const cartContext = useCart && useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  const goShop = (e) => {
    e.preventDefault();
    navigate(isAdmin ? "/admin/shop" : "/shop");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to={isAdmin ? "/admin/dashboard" : "/"} className="nav-logo">
          <img src={logo} alt="Explore Ames Logo" />
        </Link>

        {/* Center nav links */}
        <nav className="nav-center">
          {/* ✅ ADMIN NAV */}
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className="nav-link">
                DASHBOARD
              </NavLink>

              <NavLink to="/home" className="nav-link">
                HOME
              </NavLink>

              <NavLink to="/admin/diners" className="nav-link">
                DINERS
              </NavLink>

              <NavLink to="/admin/explore" className="nav-link">
                EXPLORE
              </NavLink>

              <NavLink to="/admin/shop" className="nav-link">
                SHOP
              </NavLink>

              <NavLink to="/authors" className="nav-link">
                AUTHORS
              </NavLink>

              <NavLink to="/admin/faq" className="nav-link">
                FAQ
              </NavLink>
            </>
          ) : (
            <>
              {/* ✅ USER / PUBLIC NAV */}
              <NavLink to="/home" className="nav-link">
                HOME
              </NavLink>

              <NavLink to="/diners" className="nav-link">
                DINERS
              </NavLink>

              <NavLink to="/explore" className="nav-link">
                EXPLORE
              </NavLink>

              {/* ✅ shop navigation controlled by goShop() */}
              <NavLink to="#" onClick={goShop} className="nav-link">
                SHOP
              </NavLink>

              <NavLink to="/authors" className="nav-link">
                AUTHORS
              </NavLink>

              <NavLink to="/faq" className="nav-link">
                FAQ
              </NavLink>
            </>
          )}
        </nav>

        {/* Right side: cart + auth */}
        <div className="nav-right">
          {/* ✅ Hide cart for admin */}
          {!isAdmin && (
            <NavLink
              to="/cart"
              className="cart-icon-wrapper"
              style={{
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🛒</span>
              <span
                style={{
                  minWidth: "20px",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: "#2f6b34",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {cartCount}
              </span>
            </NavLink>
          )}

          {/* Auth */}
          {!user ? (
            <>
              <NavLink to="/signup" className="signup-text">
                Sign up
              </NavLink>
              <NavLink to="/login" className="login-pill">
                Log in
              </NavLink>
            </>
          ) : (
            <>
              <span className="signup-text" style={{ fontWeight: 600 }}>
                {user.name}
              </span>

              <button
                type="button"
                className="login-pill"
                onClick={handleLogout}
                style={{ cursor: "pointer", border: "none" }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
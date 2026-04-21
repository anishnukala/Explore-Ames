import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function StarRating() {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const { user } = useAuth();

  const stars = [1, 2, 3, 4, 5];

  function handleClick(star) {
    if (!user) {
      setSelected(0);
      setShowLogin(true);
      return;
    }

    setSelected(star);
    setShowLogin(false);
  }

  function handleMouseEnter(star) {
    if (selected === 0) setHovered(star);
  }

  function handleMouseLeave() {
    if (selected === 0) setHovered(0);
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        {stars.map((star) => {
          const isActive = star <= (hovered || selected);

          return (
            <span
              key={star}
              style={{
                fontSize: "34px",
                userSelect: "none",
                transition: "color 0.2s, transform 0.15s",
                color: isActive ? "#1d3b2a" : "#c4c4c4",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(star)}
            >
              ★
            </span>
          );
        })}
      </div>

      {showLogin && (
        <div
          style={{
            marginTop: "14px",
            background: "#ffffff",
            padding: "14px",
            borderRadius: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxWidth: "300px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "10px",
              color: "#1d3b2a",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            You need to log in to review this diner.
          </p>

          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "8px 22px",
              borderRadius: "999px",
              backgroundColor: "#1d3b2a",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}
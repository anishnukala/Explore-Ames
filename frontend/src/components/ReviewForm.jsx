// export default ReviewForm;

import React, { useState } from "react";

export default function ReviewForm({
  productName,
  isLoggedIn,
  onClose,
  onLogin,
  onSubmit,
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  // ✅ NOT LOGGED IN: show ONLY login required UI
  if (!isLoggedIn) {
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 18,
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(500px, 100%)",
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>
                Write a review
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.75 }}>
                {productName}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              marginTop: 14,
              background: "#f6ffed",
              border: "1px solid #d0e6c7",
              borderRadius: 12,
              padding: "12px 12px",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 4 }}>
              Login required
            </div>
            <div style={{ opacity: 0.85 }}>
              You need to log in to write a review.
            </div>

            <button
              type="button"
              onClick={onLogin}
              style={{
                marginTop: 12,
                border: "none",
                borderRadius: 999,
                padding: "10px 14px",
                background: "#2f6b34",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Go to login
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: 14,
                border: "1px solid #d0e6c7",
                background: "#f6ffed",
                borderRadius: 999,
                padding: "10px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ LOGGED IN: normal review form
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return alert("Please type a review.");

    onSubmit?.({
      user: "You",
      rating: Number(rating),
      text: trimmed,
    });

    setText("");
    setRating(5);
    onClose?.();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          background: "#fff",
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>
              Write a review
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.75 }}>
              {productName}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
            Rating
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 10,
              padding: "10px 12px",
              border: "1px solid #d0e6c7",
              marginBottom: 12,
            }}
          >
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>

          <label
            style={{
              display: "block",
              fontWeight: 700,   // slightly lighter than 800
              marginBottom: 4,   // tighter spacing
              fontSize: "0.85rem",
            }}
          >
            Your review
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you like about this product?"
            rows={3}                       // ⬅ smaller box height
            style={{
              width: "100%",
              borderRadius: 8,
              padding: "4px 1px",          // ⬅ reduced padding
              border: "1px solid #d0e6c7",
              resize: "none",
              fontSize: "0.9rem",
              lineHeight: 1.4,
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: 14,
                border: "none",
                background: "#d8ead0",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                marginTop: 14,
                border: "none",
                background: "#2f6b34",
                color: "#fff",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Submit review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
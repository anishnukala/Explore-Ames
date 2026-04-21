// src/pages/Diners.jsx
import React, { useEffect, useState } from "react";
import "../assets/css/Diners.css";
import StarRating from "../components/StarRating.jsx";
import { fetchDiners, createDinerReview } from "../utils/dinersApi";
import { getUser, getToken } from "../utils/auth.js";

const getRealId = (d) => {
  const v = d?._id ?? d?.id ?? "";
  return v ? String(v) : "";
};

function Diners() {
  const [diners, setDiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const isLoggedIn = !!(getUser() || getToken());
  const [selectedRatings, setSelectedRatings] = useState({}); 

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setPageError("");

        const data = await fetchDiners();
        if (!alive) return;

        setDiners(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        console.error("Diners page error:", err);
        if (!alive) return;
        setDiners([]);
        setPageError(err?.response?.data?.message || err?.message || "Failed to load diners");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleStarClick = (dinerId, value) => {
    if (!dinerId) return; 
    setSelectedRatings((prev) => ({ ...prev, [dinerId]: value }));
  };

  const handleSubmitReview = async (dinerId) => {
    if (!dinerId) {
      alert("This restaurant is missing an id in the database. Ask admin to re-save it.");
      return;
    }

    const rating = selectedRatings[dinerId];
    if (!rating) return;

    try {
      const userEmail =
        JSON.parse(localStorage.getItem("user") || "{}")?.email ||
        localStorage.getItem("email") ||
        "anonymous";

      await createDinerReview(dinerId, {
        rating,
        comment: "",
        userEmail,
      });

      alert("Review saved ✅");

      setSelectedRatings((prev) => {
        const copy = { ...prev };
        delete copy[dinerId];
        return copy;
      });
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e?.message || "Failed to save review");
    }
  };

  return (
    <div className="diners-page">
      <section className="diners-hero">
        <div className="diners-hero-inner">
          <div className="diners-tag">Dining</div>
          <h1 className="diners-title">Local Favorites &amp; Must-Try Eats</h1>
          <p className="diners-subtitle">
            Experience the best of Ames dining, from cafés to classic favorites.
          </p>
        </div>
      </section>

      {pageError && (
        <div style={{ padding: 18, color: "#b91c1c", fontWeight: 700 }}>
          Error: {pageError}
        </div>
      )}

      <section className="diners-grid-section">
        <div className="diners-grid">
          {loading && <div style={{ padding: 18 }}>Loading…</div>}

          {!loading &&
            diners.map((diner) => {
              const dinerId = getRealId(diner); // ✅ only real id
              const canReview = isLoggedIn && !!dinerId;

              return (
                <article key={dinerId || diner?.name} className="diner-card">
                  <div className="diner-image-wrapper">
                    <img
                      src={diner?.image || "https://via.placeholder.com/600x400?text=Diner"}
                      alt={diner?.name || "Diner"}
                    />
                  </div>

                  <div className="diner-body">
                    <h3 className="diner-name">{diner?.name || "Unnamed Diner"}</h3>

                    <div className="diner-meta">
                      <p><span className="diner-label">Cuisine:</span> {diner?.cuisine || "—"}</p>
                      <p><span className="diner-label">Specialty:</span> {diner?.specialty || "—"}</p>
                      <p><span className="diner-label">Timings:</span> {diner?.timings || "—"}</p>
                      <p><span className="diner-label">Address:</span> {diner?.address || "—"}</p>
                      <p><span className="diner-label">Rating:</span> {Number(diner?.rating || 0).toFixed(1)}</p>
                    </div>

                    {isLoggedIn ? (
                      dinerId ? (
                        <div className="star-rating-container">
                          <div className="stars-row">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                className={`star ${
                                  n <= (selectedRatings[dinerId] || 0)
                                    ? "star-on"
                                    : "star-off"
                                }`}
                                onClick={() => handleStarClick(dinerId, n)}
                                style={{ cursor: "pointer" }}
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          {(selectedRatings[dinerId] || 0) > 0 && (
                            <button
                              type="button"
                              className="submit-review-btn"
                              onClick={() => handleSubmitReview(dinerId)}
                            >
                              Submit review
                            </button>
                          )}
                        </div>
                      ) : (
                        <div style={{ marginTop: 10, color: "#b91c1c", fontWeight: 700 }}>
                          Cannot review: this diner has no ID in DB.
                        </div>
                      )
                    ) : (
                      <StarRating />
                    )}
                  </div>
                </article>
              );
            })}

          {!loading && diners.length === 0 && !pageError && (
            <div style={{ padding: 18, color: "#6b7280" }}>
              No restaurants found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Diners;
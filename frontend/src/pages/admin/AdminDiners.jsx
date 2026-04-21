// src/pages/admin/AdminDiners.jsx
import React, { useEffect, useState } from "react";
import "../../assets/css/Diners.css";
import {
  fetchDiners,
  createDiner,
  updateDiner,
  deleteDiner,
  fetchDinerReviews,
  deleteDinerReviewApi,
} from "../../utils/dinersApi";

const emptyForm = {
  _id: null,
  name: "",
  cuisine: "",
  specialty: "",
  timings: "",
  address: "",
  rating: "4.5",
  phone: "",
  tagsText: "",
  image: "",
};

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleString();
}

export default function AdminDiners() {
  const [diners, setDiners] = useState([]);
  const [loading, setLoading] = useState(true);

  // diner modal
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [form, setForm] = useState(emptyForm);

  // reviews
  const [reviewsOpenFor, setReviewsOpenFor] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  /* ---------------- LOAD DINERS ---------------- */
  const loadDiners = async () => {
    setLoading(true);
    try {
      const data = await fetchDiners();
      setDiners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      alert(err?.response?.data?.message || "Failed to load diners from DB.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiners();
  }, []);

  /* ---------------- MODAL HANDLERS ---------------- */
  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (d) => {
    setMode("edit");
    const id = typeof d?._id === "string" ? d._id : String(d?._id);

    setForm({
      _id: id,
      name: d.name || "",
      cuisine: d.cuisine || "",
      specialty: d.specialty || "",
      timings: d.timings || "",
      address: d.address || "",
      rating: String(d.rating ?? "4.5"),
      phone: d.phone || "",
      tagsText: (d.tags || []).join(", "),
      image: d.image || "",
    });

    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- SAVE (CREATE / UPDATE) ---------------- */
  const saveRestaurant = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      cuisine: form.cuisine.trim(),
      specialty: form.specialty.trim(),
      timings: form.timings.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      rating: Math.min(5, Math.max(0, Number(form.rating) || 4.5)),
      tags: form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image:
        form.image.trim() ||
        "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg",
    };

    if (
      !payload.name ||
      !payload.cuisine ||
      !payload.specialty ||
      !payload.timings ||
      !payload.address
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (mode === "create") {
        await createDiner(payload);
      } else {
        const id = typeof form._id === "string" ? form._id : String(form._id);
        if (!id || id === "null" || id === "undefined") {
          alert("Update failed: missing diner _id. Click Edit again.");
          return;
        }
        await updateDiner(id, payload);
      }
      closeModal();
      await loadDiners();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert(err?.response?.data?.message || "Save failed");
    }
  };

  /* ---------------- DELETE DINER ---------------- */
  const deleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await deleteDiner(id);
      await loadDiners();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  /* ---------------- REVIEWS: LOAD + DELETE ---------------- */
  const toggleReviews = async (dinerId) => {
    const id = typeof dinerId === "string" ? dinerId : String(dinerId);

    if (reviewsOpenFor === id) {
      setReviewsOpenFor(null);
      setReviews([]);
      return;
    }

    setReviewsOpenFor(id);
    setReviewsLoading(true);
    try {
      const data = await fetchDinerReviews(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("REVIEWS LOAD ERROR:", err);
      alert(err?.response?.data?.message || "Failed to load diner reviews.");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const rid = typeof reviewId === "string" ? reviewId : String(reviewId);
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteDinerReviewApi(rid);

      if (reviewsOpenFor) {
        const data = await fetchDinerReviews(reviewsOpenFor);
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("REVIEW DELETE ERROR:", err);
      alert(err?.response?.data?.message || "Failed to delete review.");
    }
  };

  return (
    <div className="diners-page">
      {/* HEADER */}
      <section className="diners-hero">
        <div className="diners-hero-inner">
          <div className="diners-tag">ADMIN</div>
          <h1 className="diners-title">Manage Diners</h1>
          <p className="diners-subtitle">
            Add, update, and delete restaurants stored in MongoDB.
          </p>

          <button
            className="diners-filter-btn diners-filter-btn-active"
            onClick={openCreate}
            type="button"
          >
            + Add Restaurant
          </button>
        </div>
      </section>

      {/* GRID */}
      <section className="diners-grid-section">
        <div className="diners-grid">
          {loading && <div style={{ padding: 20 }}>Loading…</div>}

          {!loading &&
            diners.map((d) => {
              const dinerId =
                typeof d?._id === "string" ? d._id : String(d?._id);
              const isReviewsOpen = reviewsOpenFor === dinerId;

              return (
                <article key={dinerId} className="diner-card">
                  <div className="diner-image-wrapper">
                    <img src={d.image} alt={d.name} />
                  </div>

                  <div className="diner-body">
                    <h3 className="diner-name">{d.name}</h3>

                    <div className="diner-meta">
                      <p>
                        <strong>Cuisine:</strong> {d.cuisine}
                      </p>
                      <p>
                        <strong>Specialty:</strong> {d.specialty}
                      </p>
                      <p>
                        <strong>Timings:</strong> {d.timings}
                      </p>
                      <p>
                        <strong>Address:</strong> {d.address}
                      </p>
                      <p>
                        <strong>Rating:</strong>{" "}
                        {Number(d.rating || 0).toFixed(1)}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="diners-filter-btn diners-filter-btn-active"
                        onClick={() => openEdit(d)}
                        type="button"
                      >
                        Edit
                      </button>

                      <button
                        className="diners-filter-btn"
                        style={{ color: "#ff6b6b", borderColor: "#ff6b6b" }}
                        onClick={() => deleteRestaurant(dinerId)}
                        type="button"
                      >
                        Delete
                      </button>

                      {/* ✅ Toggle reviews button */}
                      <button
                        className="diners-filter-btn"
                        onClick={() => toggleReviews(dinerId)}
                        type="button"
                      >
                        {isReviewsOpen ? "Hide Reviews" : "View Reviews"}
                      </button>
                    </div>

                    {/* REVIEWS PANEL */}
                    {isReviewsOpen && (
                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 12,
                          borderTop: "1px solid #eee",
                        }}
                      >
                        {reviewsLoading && (
                          <div style={{ padding: 8, color: "#6b7280" }}>
                            Loading reviews…
                          </div>
                        )}

                        {!reviewsLoading && reviews.length === 0 && (
                          <div style={{ padding: 8, color: "#6b7280" }}>
                            No reviews yet.
                          </div>
                        )}

                        {!reviewsLoading && reviews.length > 0 && (
                          <div style={{ display: "grid", gap: 10 }}>
                            {reviews.map((r) => {
                              const reviewId =
                                r.id || r._id || (r?._id ? String(r._id) : "");
                              return (
                                <div
                                  key={reviewId}
                                  style={{
                                    border: "1px solid #eee",
                                    borderRadius: 12,
                                    padding: 12,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: 10,
                                    }}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 700 }}>
                                        {r.userName || r.userEmail || "Anonymous"} •{" "}
                                        {Number(r.rating || 0)}/5
                                      </div>
                                      <div style={{ color: "#6b7280", fontSize: 13 }}>
                                        {formatDate(r.createdAt)}
                                      </div>
                                    </div>

                                    <button
                                      className="diners-filter-btn"
                                      style={{
                                        color: "#ff6b6b",
                                        borderColor: "#ff6b6b",
                                        height: 38,
                                      }}
                                      onClick={() => deleteReview(reviewId)}
                                      type="button"
                                    >
                                      Delete Review
                                    </button>
                                  </div>

                                  {(r.text || r.comment) && (
                                    <div style={{ marginTop: 8 }}>
                                      {r.text || r.comment}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

          {!loading && diners.length === 0 && (
            <div style={{ padding: 20 }}>No restaurants found.</div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {isOpen && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3>{mode === "create" ? "Add Restaurant" : "Update Restaurant"}</h3>

            <form onSubmit={saveRestaurant} style={gridStyle}>
              {[
                ["name", "Restaurant Name"],
                ["cuisine", "Cuisine"],
                ["specialty", "Specialty"],
                ["timings", "Timings"],
                ["address", "Address"],
                ["phone", "Phone"],
                ["rating", "Rating (0–5)"],
                ["tagsText", "Tags (comma separated)"],
                ["image", "Image URL"],
              ].map(([nm, placeholder]) => (
                <input
                  key={nm}
                  name={nm}
                  value={form[nm]}
                  onChange={onChange}
                  placeholder={placeholder}
                  style={modalInput}
                />
              ))}

              <div style={footerStyle}>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">{mode === "create" ? "Add" : "Update"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- styles ---------- */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  width: "100%",
  maxWidth: 720,
};

const gridStyle = {
  display: "grid",
  gap: 12,
};

const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 12,
};

const modalInput = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
};
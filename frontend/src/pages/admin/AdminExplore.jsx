// src/pages/admin/AdminExplore.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../assets/css/Explore.css";
import Footer from "../../components/Footer.jsx";

import {
  fetchExplorePlaces,
  createExplorePlace,
  updateExplorePlace,
  deleteExplorePlace,
} from "../../utils/exploreApi";

const emptyForm = {
  id: null,
  title: "",
  desc: "",
  img: "",
};

export default function AdminExplore() {
  const [places, setPlaces] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(emptyForm);

  const list = useMemo(() => (Array.isArray(places) ? places : []), [places]);

  const loadPlaces = async (silent = false) => {
    try {
      const data = await fetchExplorePlaces();
      setPlaces(Array.isArray(data) ? data : []);
      return true;
    } catch (e) {
      console.error("loadPlaces error:", e);
      if (!silent) {
        alert(e?.response?.data?.message || "Failed to load explore places");
      }
      return false;
    }
  };

  useEffect(() => {
    loadPlaces(false);
  }, []);

  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (p) => {
    const mongoId = String(p?._id || p?.id || "");
    setMode("edit");
    setForm({
      id: mongoId,
      title: p?.name || p?.title || "",
      desc: p?.description || p?.desc || "",
      img: p?.image || p?.img || "",
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const title = form.title.trim();
    const desc = form.desc.trim();
    const img = form.img.trim();

    if (!title || !desc) {
      alert("Please fill: Title and Description.");
      return;
    }

    const payload = {
      name: title,
      description: desc,
      image:
        img ||
        "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg",
      category: "",
      location: "",
      tags: [],
    };

    try {
      if (mode === "create") {
        await createExplorePlace(payload);
        alert("Place added ✅");
      } else {
        const id = String(form.id || "");
        if (!id) {
          alert("Missing Mongo ID. Close modal and click Edit again.");
          return;
        }

        await updateExplorePlace(id, payload);
        alert("Place updated ✅");
      }

      setIsOpen(false);
      await loadPlaces(true);
    } catch (err) {
      console.error("savePlace error:", err);
      alert(err?.response?.data?.message || "Request failed");
    }
  };

  const deletePlace = async (placeObj) => {
    const mongoId = String(placeObj?._id || placeObj?.id || "");
    if (!mongoId) return;

    if (!window.confirm("Delete this place?")) return;

    try {
      await deleteExplorePlace(mongoId);
      alert("Place deleted ✅");
      await loadPlaces(true);
    } catch (err) {
      console.error("deletePlace error:", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="explore-page">
      <header className="page-header">
        <div className="content-box global-hero">
          <span className="badge">ADMIN</span>
          <h1>Manage Explore Places</h1>
          <p>Add, update, and delete explore locations (MongoDB).</p>

          <div style={{ marginTop: 14 }}>
            <button
              className="diners-filter-btn diners-filter-btn-active"
              onClick={openCreate}
              style={{
                background: "#234325",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "12px 22px",
                fontWeight: 800,
                cursor: "pointer",
              }}
              type="button"
            >
              + Add Place
            </button>
          </div>
        </div>
      </header>

      <section className="explore-map-wrapper">
        <div className="explore-map-card">
          <h2 className="explore-map-title">Ames Map</h2>
          <iframe
            title="Ames Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.403741617729!2d-93.65027202429848!3d42.03078126354681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87ee70bda0b7b6a3%3A0xb6aeb54d79539d08!2sAmes%2C%20IA!5e0!3m2!1sen!2sus!4v1696977480000!5m2!1sen!2sus"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      <section className="explore-places">
        <h2 className="section-title">Places</h2>

        <div className="places-grid">
          {list.map((place) => {
            const key = String(place?._id || place?.id || place?.name);
            return (
              <div className="place-card" key={key}>
                <img
                  src={place.image}
                  alt={place.name}
                  className="place-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="place-body">
                  <h3 className="place-title">{place.name}</h3>
                  <p className="place-desc">{place.description}</p>

                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button onClick={() => openEdit(place)} style={btnPrimary} type="button">
                      Edit / Update
                    </button>
                    <button onClick={() => deletePlace(place)} style={btnDanger} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {list.length === 0 && (
            <div style={{ padding: 16, color: "#6b7280" }}>
              No places yet. Click “Add Place”.
            </div>
          )}
        </div>
      </section>

      {isOpen && (
        <div style={overlayStyle} onClick={closeModal}>
          <style>{responsiveCSS}</style>

          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>
              {mode === "create" ? "Add Place" : "Update Place"}
            </h3>

            <form onSubmit={savePlace}>
              <div className="admin-modal-grid" style={gridStyle}>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Place Title (e.g., Reiman Gardens)"
                  style={modalInput}
                  required
                />
                <input
                  name="img"
                  value={form.img}
                  onChange={onChange}
                  placeholder="Image URL"
                  style={modalInput}
                />
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={onChange}
                  placeholder="Description"
                  style={{
                    ...modalInput,
                    gridColumn: "1 / -1",
                    minHeight: 100,
                    resize: "vertical",
                  }}
                  required
                />
              </div>

              <div style={footerStyle}>
                <button type="button" onClick={closeModal} style={btnLight}>
                  Cancel
                </button>
                <button type="submit" style={btnPrimary}>
                  {mode === "create" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

/* Buttons */
const btnPrimary = {
  background: "#234325",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const btnDanger = {
  background: "transparent",
  color: "#ff3b3b",
  border: "1px solid #ff3b3b",
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const btnLight = {
  background: "#eef6e6",
  color: "#234325",
  border: "1px solid #cfe6c3",
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

/* Modal styles */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 9999,
};

const modalStyle = {
  width: "100%",
  maxWidth: 760,
  background: "#fff",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
  boxSizing: "border-box",
  overflow: "hidden",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 14,
};

const modalInput = {
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  outline: "none",
  boxSizing: "border-box",
  fontSize: "0.9rem",
};

const responsiveCSS = `
@media (max-width: 640px) {
  .admin-modal-grid {
    grid-template-columns: 1fr !important;
  }
}
`;
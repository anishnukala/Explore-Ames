// src/pages/admin/AdminShop.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../assets/css/Shop.css";
import Footer from "../../components/Footer.jsx";
import api from "../../utils/api";
import { fetchReviewsByProduct, deleteReviewApi } from "../../utils/reviewsApi";

/* ---------- IMAGES ---------- */
const imageMap = {
  "Ames Explorer Tee": "/images/ShopPage/AmesExplorerTee.png",
  "Ames Explorer Beanie": "/images/ShopPage/AmesExplorerBeanie.png",
  "Ames Sticker Pack": "/images/ShopPage/AmesStickerPack.png",
  "Cyclone Mascot 3d Minurature Model":
    "/images/ShopPage/CycloneMascotMinuratureModel.png",
  "Ames Coffee Mug": "/images/ShopPage/ExploreAmesMug.png",
  "Iowa State Football Jersey": "/images/ShopPage/IowaStateJersey.png",
  "Vintage Ames Postcard Set":
    "/images/ShopPage/Vintage Ames Postcard Set.png",
  "Ames Landmark Poster Set":
    "/images/ShopPage/AmesLandmarkPosters ser.png",
};

const fallbackImg = "/images/ShopPage/AmesExplorerTee.png";

/* ---------- FILTERS ---------- */
const FILTERS = [
  { label: "All Products", value: "all" },
  { label: "Merch", value: "Merch" },
  { label: "Accessories", value: "Accessories" },
  { label: "Souvenirs & Collectibles", value: "Souvenirs" },
];

/* ---------- FORM ---------- */
const emptyForm = {
  id: "", // ✅ MUST be backend product.id (Mongo _id string)
  name: "",
  category: "Merch",
  price: "19.99",
  description: "",
  image: "",
};

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [reviewsByProductId, setReviewsByProductId] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [form, setForm] = useState(emptyForm);

  const list = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  const filteredProducts =
    filter === "all" ? list : list.filter((p) => String(p.category) === String(filter));

  /* =========================
     LOAD PRODUCTS
  ========================= */
  const loadProducts = async () => {
    setLoading(true);
    try {
      // ✅ IMPORTANT: api baseURL is "/api", so this hits /api/shop
      const res = await api.get("/shop");
      const data = res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products", err);
      alert(err?.response?.data?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================
     LOAD ALL REVIEWS (SYNC FROM DB)
  ========================= */
  useEffect(() => {
    async function loadAllReviews() {
      if (!products || products.length === 0) return;

      try {
        const entries = await Promise.all(
          products
            .map((p) => (p?.id ? String(p.id) : "")) // ✅ must use p.id
            .filter(Boolean)
            .map(async (pid) => {
              const data = await fetchReviewsByProduct(pid);
              return [pid, Array.isArray(data) ? data : []];
            })
        );

        setReviewsByProductId((prev) => ({
          ...prev,
          ...Object.fromEntries(entries),
        }));
      } catch (err) {
        console.error("Admin load reviews error:", err);
      }
    }

    loadAllReviews();
  }, [products]);

  /* =========================
     PRODUCT CRUD
  ========================= */
  const openCreate = () => {
    setMode("create");
    setForm({ ...emptyForm, id: "" });
    setIsOpen(true);
  };

  // ✅ Use backend product.id ALWAYS
  const openEdit = (p) => {
    const pid = p?.id ? String(p.id) : "";
    if (!pid) {
      alert("Missing product id from backend. Refresh and click Edit again.");
      return;
    }

    setMode("edit");
    setForm({
      id: pid,
      name: p.name || "",
      category: p.category || "Merch",
      price: String(p.price ?? "19.99"),
      description: p.description || "",
      image: p.image || "",
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const name = String(form.name || "").trim();
    const category = String(form.category || "").trim();
    const description = String(form.description || "").trim();
    const image = String(form.image || "").trim();

    const priceNum = Number(form.price);
    const price = Number.isFinite(priceNum) ? Math.max(0, priceNum) : 0;

    if (!name || !category || !description) {
      alert("Please fill: Name, Category, Description.");
      return;
    }

    const payload = { name, category, description, price, image };

    try {
      if (mode === "create") {
        await api.post("/shop", payload);
        await loadProducts();
        setIsOpen(false);
        return;
      }

      const pid = String(form.id || "").trim();
      if (!pid) {
        alert("Update failed: missing product id. Close and click Edit again.");
        return;
      }

      // ✅ must match backend: PUT /api/shop/:id
      await api.put(`/shop/${pid}`, payload);

      await loadProducts();
      setIsOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert(err?.response?.data?.message || err.message || "Save failed");
    }
  };

  const deleteProduct = async (id) => {
    const pid = String(id || "").trim();
    const p = list.find((x) => String(x.id) === pid);
    if (!p) return;

    if (!window.confirm(`Delete product "${p.name}"?`)) return;

    try {
      await api.delete(`/shop/${pid}`);
      await loadProducts();

      setReviewsByProductId((prev) => {
        const copy = { ...prev };
        delete copy[pid];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  /* =========================
     REVIEW MODERATION
  ========================= */
  const deleteReview = async (productId, reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReviewApi(reviewId);

      const fresh = await fetchReviewsByProduct(productId);
      setReviewsByProductId((prev) => ({
        ...prev,
        [productId]: Array.isArray(fresh) ? fresh : [],
      }));
    } catch (err) {
      console.error("Delete review failed:", err);
      alert(err?.response?.data?.message || "Delete review failed");
    }
  };

  const displayReviewer = (r) => {
    const raw = r?.userName || r?.user || "Anonymous";
    const name = String(raw).trim();
    if (!name) return "Anonymous";
    return name.toLowerCase() === "you" ? "Buyer" : "Buyer";
  };

  return (
    <div className="shop-page">
      {/* HERO */}
      <div className="shop-hero-wrapper">
        <section className="shop-hero-card">
          <div className="shop-pill">ADMIN</div>
          <h1 className="shop-hero-title">Manage Shop & Reviews</h1>
          <p className="shop-hero-subtitle">
            Add, update, delete products + delete reviews.
          </p>

          <div style={{ marginTop: 14 }}>
            <button className="shop-card-button" onClick={openCreate} type="button">
              + Add Product
            </button>
          </div>
        </section>
      </div>

      <main className="shop-content">
        {/* FILTERS */}
        <div className="shop-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={
                "shop-filter-btn" +
                (filter === f.value ? " shop-filter-btn-active" : "")
              }
              onClick={() => setFilter(f.value)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="shop-loading">Loading products…</div>
        ) : (
          <div className="shop-grid">
            {filteredProducts.map((product) => {
              const productId = product?.id ? String(product.id) : "";
              const imgSrc = imageMap[product.name] || product.image || fallbackImg;
              const reviews = reviewsByProductId[productId] || [];

              return (
                <article className="shop-card" key={productId || product.name}>
                  <div className="shop-card-image-wrapper">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                    />
                  </div>

                  <div className="shop-card-body">
                    <h3 className="shop-card-title">{product.name}</h3>
                    <p className="shop-card-description">{product.description}</p>

                    <p className="shop-card-price">
                      ${Number(product.price).toFixed(2)}
                    </p>

                    {/* ADMIN PRODUCT ACTIONS */}
                    <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                      <button type="button" style={btnPrimarySmall} onClick={() => openEdit(product)}>
                        Edit / Update
                      </button>

                      <button type="button" style={btnDangerSmall} onClick={() => deleteProduct(productId)}>
                        Delete
                      </button>
                    </div>

                    {/* REVIEWS */}
                    <div style={{ marginTop: 14 }}>
                      <h4 style={{ fontSize: "0.85rem", marginBottom: 8 }}>
                        Reviews
                      </h4>

                      {reviews.length === 0 ? (
                        <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          No reviews yet.
                        </p>
                      ) : (
                        reviews.map((r, idx) => (
                          <div
                            key={r.id || r._id || idx}
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 10,
                              padding: 10,
                              marginBottom: 8,
                              fontSize: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 8,
                              }}
                            >
                              <div style={{ minWidth: 0 }}>
                                <strong>{displayReviewer(r)}</strong> — ⭐{" "}
                                {r.rating}
                                <p style={{ margin: "6px 0 0", wordBreak: "break-word" }}>
                                  {r.text}
                                </p>
                              </div>

                              <button
                                onClick={() => deleteReview(productId, r.id || r._id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#ff3b3b",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                }}
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredProducts.length === 0 && (
              <div style={{ padding: 16, color: "#6b7280" }}>
                No products in this category.
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL */}
      {isOpen && (
        <div style={overlayStyle} onClick={closeModal}>
          <style>{responsiveCSS}</style>

          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>
              {mode === "create" ? "Add Product" : "Update Product"}
            </h3>

            <form onSubmit={saveProduct}>
              <div className="admin-modal-grid" style={gridStyle}>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Product Name"
                  style={{ ...modalInput, gridColumn: "1 / -1" }}
                  required
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  style={modalInput}
                >
                  <option value="Merch">Merch</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Souvenirs">Souvenirs & Collectibles</option>
                </select>

                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  placeholder="Price (e.g., 19.99)"
                  style={modalInput}
                  required
                />

                <input
                  name="image"
                  value={form.image}
                  onChange={onChange}
                  placeholder="Image URL (optional)"
                  style={{ ...modalInput, gridColumn: "1 / -1" }}
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Description"
                  style={{
                    ...modalInput,
                    gridColumn: "1 / -1",
                    minHeight: 110,
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
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

const btnPrimarySmall = {
  ...btnPrimary,
  padding: "8px 14px",
  fontWeight: 700,
};

const btnDangerSmall = {
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
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

/* Modal */
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
  fontSize: "0.95rem",
  fontFamily: "inherit",
};

const responsiveCSS = `
@media (max-width: 640px) {
  .admin-modal-grid {
    grid-template-columns: 1fr !important;
  }
}
`;
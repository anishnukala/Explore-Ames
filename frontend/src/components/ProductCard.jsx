import React, { useMemo, useState } from "react";
import ReviewList from "./ReviewList.jsx";
import ReviewForm from "./ReviewForm.jsx";

export default function ProductCard({ product }) {
  // ✅ ALWAYS use Mongo _id for reviews
  const productId = useMemo(() => {
    return product?._id ? String(product._id) : null;
  }, [product]);

  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-price">
          ${Number(product.price || 0).toFixed(2)}
        </div>

        {/* ✅ Reviews ALWAYS visible */}
        <div className="product-reviews-box">
          <ReviewList productId={productId} refreshKey={refreshKey} />

          <button
            type="button"
            className="write-review-link"
            onClick={() => setShowForm(true)}
            style={{
              background: "transparent",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Write a review
          </button>

          {showForm && (
            <ReviewForm
              productId={productId}
              onClose={() => setShowForm(false)}
              onSubmitted={() => {
                setRefreshKey((k) => k + 1); // ✅ force reload
                setShowForm(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
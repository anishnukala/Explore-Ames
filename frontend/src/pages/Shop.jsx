import React, { useEffect, useState } from "react";
import "../assets/css/Shop.css";
import { useCart } from "../../Context/CartContext.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import ReviewForm from "../components/ReviewForm.jsx";
import ReviewList from "../components/ReviewList.jsx";
import Footer from "../components/Footer.jsx";
import api from "../utils/api";
import { fetchReviewsByProduct, createReview } from "../utils/reviewsApi";

// images from public/images/ShopPage
const teeImg = "/images/ShopPage/AmesExplorerTee.png";
const beanieImg = "/images/ShopPage/AmesExplorerBeanie.png";
const stickerImg = "/images/ShopPage/AmesStickerPack.png";
const mascotImg = "/images/ShopPage/CycloneMascotMinuratureModel.png";
const mugImg = "/images/ShopPage/ExploreAmesMug.png";
const jerseyImg = "/images/ShopPage/IowaStateJersey.png";
const postcardsImg = "/images/ShopPage/Vintage Ames Postcard Set.png";
const postersImg = "/images/ShopPage/AmesLandmarkPosters ser.png";

const imageMap = {
  "Ames Explorer Tee": teeImg,
  "Ames Explorer Beanie": beanieImg,
  "Ames Sticker Pack": stickerImg,
  "Cyclone Mascot 3d Minurature Model": mascotImg,
  "Ames Coffee Mug": mugImg,
  "Iowa State Football Jersey": jerseyImg,
  "Vintage Ames Postcard Set": postcardsImg,
  "Ames Landmark Poster Set": postersImg,
};

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // reviews keyed by productId (Mongo ObjectId string)
  const [reviewsByProductId, setReviewsByProductId] = useState({});
  const [activeReviewProductId, setActiveReviewProductId] = useState(null);

  // reopen modal after login
  useEffect(() => {
    if (location?.state?.openReviewProductId) {
      setActiveReviewProductId(String(location.state.openReviewProductId));
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load products from Mongo
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get("/shop");
        const data = res.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Load all reviews once products load
  useEffect(() => {
    async function loadAllReviews() {
      if (!products.length) return;

      try {
        const entries = await Promise.all(
          products
            .map((p) => (p?.id ? String(p.id) : null))
            .filter(Boolean)
            .map(async (pid) => {
              const data = await fetchReviewsByProduct(pid);
              return [pid, Array.isArray(data) ? data : []];
            })
        );

        setReviewsByProductId(Object.fromEntries(entries));
      } catch (err) {
        console.error("Load reviews error:", err);
      }
    }

    loadAllReviews();
  }, [products]);

  const handleAddToCart = (product, imgSrc) => {
    const id = product.id ?? product.name;
    const price = Number(product.price) || 0;

    addToCart({
      id,
      name: product.name,
      price,
      imageUrl: imgSrc,
      quantity: 1,
    });
  };

  const openReviewForm = (productId) => {
    setActiveReviewProductId(productId);
  };

  const closeReviewForm = () => setActiveReviewProductId(null);

  const handleSubmitReview = async (productId, review) => {
    const userName =
      review.userName ||
      user?.name ||
      user?.email ||
      "User";

    const rating = Number(review.rating);
    const text = String(review.text || "").trim();

    if (!productId) return alert("Missing product id");
    if (!text) return alert("Please type a review.");

    try {
      await createReview({ productId, userName, rating, text });

      const fresh = await fetchReviewsByProduct(productId);
      setReviewsByProductId((prev) => ({
        ...prev,
        [productId]: Array.isArray(fresh) ? fresh : [],
      }));
    } catch (err) {
      console.error("Failed to save review", err);
      alert(err?.response?.data?.message || "Review save failed");
    }
  };

  const goToLoginForReview = (productId) => {
    navigate("/login", {
      state: { from: "/shop", openReviewProductId: productId },
    });
  };

  return (
    <div className="shop-page">
      {/* HERO */}
      <div className="shop-hero-wrapper">
        <section className="shop-hero-card">
          <div className="shop-pill">SHOP US</div>
          <h1 className="shop-hero-title">
            Ames Merch, Accessories &amp; Souvenirs
          </h1>
          <p className="shop-hero-subtitle">
            Represent Cyclone spirit and local love. Browse student-designed
            apparel, accessories, and collectibles inspired by Ames.
          </p>
        </section>
      </div>

      {/* PRODUCTS GRID */}
      <main className="shop-content">
        {loading ? (
          <div className="shop-loading">Loading products…</div>
        ) : (
          <div className="shop-grid">
            {products.map((product) => {
              const imgSrc = imageMap[product.name] || teeImg;
              const productId = product?.id ? String(product.id) : null;
              const productReviews = productId
                ? reviewsByProductId[productId] || []
                : [];

              return (
                <article className="shop-card" key={productId ?? product.name}>
                  <div className="shop-card-image-wrapper">
                    <img src={imgSrc} alt={product.name} />
                  </div>

                  <div className="shop-card-body">
                    <h3 className="shop-card-title">{product.name}</h3>
                    <p className="shop-card-description">
                      {product.description}
                    </p>

                    <p className="shop-card-price">
                      ${Number(product.price).toFixed(2)}
                    </p>

                    {/* Reviews */}
                    <ReviewList reviews={productReviews} />

                    {/* Write review */}
                    <button
                      onClick={() => {
                        if (!productId) return;
                        if (!user) return goToLoginForReview(productId);
                        openReviewForm(productId);
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#2f6b34",
                        fontSize: "0.78rem",
                        textDecoration: "underline",
                        cursor: "pointer",
                        marginBottom: "10px",
                        fontWeight: 600,
                      }}
                    >
                      Write a review
                    </button>

                    {/* Add to cart */}
                    <button
                      className="shop-card-button"
                      onClick={() => handleAddToCart(product, imgSrc)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Review modal */}
      {activeReviewProductId && (
        <ReviewForm
          productName={
            products.find(
              (p) => String(p.id) === String(activeReviewProductId)
            )?.name || "Product"
          }
          isLoggedIn={!!user}
          onClose={closeReviewForm}
          onLogin={() => navigate("/login")}
          onSubmit={(review) =>
            handleSubmitReview(activeReviewProductId, review)
          }
        />
      )}

      <Footer />
    </div>
  );
}

export default Shop;
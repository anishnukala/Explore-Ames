// src/pages/Cart.jsx
import React from "react";
import "../assets/css/Cart.css";
import { useCart } from "../../Context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

function Cart() {
  const cartContext = typeof useCart === "function" ? useCart() : null;

  if (!cartContext) {
    // If the provider isn't wrapping this page yet
    return (
      <div className="cart-page">
        <div className="cart-shell">
          <h1 className="cart-heading">Your Shopping Cart</h1>
          <p className="cart-subheading">
            Cart is not available. Make sure CartProvider wraps your app.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    cartItems = [],
    increaseQty = () => {},
    decreaseQty = () => {},
    removeFromCart = () => {},
  } = cartContext;

  const navigate = useNavigate();

  // ---- SAFE NUMERIC CALCULATIONS ----
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const shipping = cartItems.length > 0 ? 5 : 0;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  // helper: choose image field safely
  const getImageForItem = (item) =>
    item.imageUrl || item.image || item.img || "/images/placeholder.png";

  return (
    <div className="cart-page">
      <div className="cart-shell">
        {/* Header */}
        <div className="cart-header-row">
          <div className="cart-title-left">
            <span className="cart-icon" aria-hidden="true">
              🛒
            </span>
            <div>
              <h1 className="cart-heading">Your Shopping Cart</h1>
              <p className="cart-subheading">
                {cartItems.length === 0
                  ? "Your cart is empty."
                  : "Review your items before checkout."}
              </p>
            </div>
          </div>
          <div className="cart-items-count">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-list">
          {cartItems.length === 0 && (
            <div className="cart-empty">
              <p>You don’t have anything in your cart yet.</p>
              <button
                className="cart-empty-button"
                onClick={() => navigate("/shop")}
              >
                Browse the Shop
              </button>
            </div>
          )}

          {cartItems.map((item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;

            return (
              <div className="cart-item-card" key={item.id}>
                <div className="cart-item-main">
                  {/* Image */}
                  <div className="cart-item-image-wrapper">
                    <img
                      src={getImageForItem(item)}
                      alt={item.name || "Cart item"}
                      className="cart-item-image"
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name || "Item"}</div>
                    <div className="cart-item-per">
                      ${price.toFixed(2)} <span>per item</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="cart-qty-row">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQty(item.id)}
                      >
                        −
                      </button>
                      <div className="qty-display">{qty}</div>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side: price & delete */}
                <div className="cart-item-right">
                  <div className="cart-item-total-price">
                    ${(price * qty).toFixed(2)}
                  </div>
                  <button
                    className="cart-item-delete"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="cart-summary-divider" />

          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="cart-checkout-btn"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
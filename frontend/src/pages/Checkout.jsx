import React, { useState, useMemo } from "react";
import "../assets/css/Checkout.css";
import { useCart } from "../../Context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "5–7 business days",
    price: 4.99,
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "2–3 business days",
    price: 9.99,
  },
  {
    id: "overnight",
    label: "Overnight Shipping",
    description: "Next business day",
    price: 19.99,
  },
];

function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("standard");

  // simple shipping + tax calc (7%)
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const shippingCost = useMemo(() => {
    const opt =
      SHIPPING_OPTIONS.find((o) => o.id === shippingMethod) ||
      SHIPPING_OPTIONS[0];
    return opt.price;
  }, [shippingMethod]);

  const tax = subtotal * 0.07;
  const total = subtotal + shippingCost + tax;

  const handleContinue = (e) => {
    e.preventDefault();
    navigate("/payment", { state: { total } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        {/* Left: Shipping Form */}
        <section className="checkout-main">
          <header className="checkout-header">
            <div className="checkout-step-pill">Shipping</div>
            <h1>Shipping Information</h1>
            <p>Enter your details to get your Ames merch delivered.</p>
          </header>

          <form className="checkout-form" onSubmit={handleContinue}>
            {/* Name row */}
            <div className="form-row two-col">
              <div className="form-field">
                <label>First Name *</label>
                <input type="text" placeholder="John" required />
              </div>
              <div className="form-field">
                <label>Last Name *</label>
                <input type="text" placeholder="Doe" required />
              </div>
            </div>

            {/* Email / Phone */}
            <div className="form-row two-col">
              <div className="form-field">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input type="tel" placeholder="+1 (555) 123-4567" />
              </div>
            </div>

            {/* Address */}
            <div className="form-row">
              <div className="form-field">
                <label>Address *</label>
                <input type="text" placeholder="123 Main Street" required />
              </div>
            </div>

            {/* City / State / ZIP */}
            <div className="form-row three-col">
              <div className="form-field">
                <label>City *</label>
                <input type="text" placeholder="Ames" required />
              </div>
              <div className="form-field">
                <label>State *</label>
                <input type="text" placeholder="IA" required />
              </div>
              <div className="form-field">
                <label>ZIP Code *</label>
                <input type="text" placeholder="50010" required />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="form-section-heading">Shipping Method</div>
            <div className="shipping-options">
              {SHIPPING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={
                    "shipping-card" +
                    (shippingMethod === opt.id ? " shipping-card-active" : "")
                  }
                >
                  <div className="shipping-left">
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shippingMethod === opt.id}
                      onChange={() => setShippingMethod(opt.id)}
                    />
                    <div className="shipping-text">
                      <div className="shipping-label">{opt.label}</div>
                      <div className="shipping-description">
                        {opt.description}
                      </div>
                    </div>
                  </div>
                  <div className="shipping-price">
                    ${opt.price.toFixed(2)}
                  </div>
                </label>
              ))}
            </div>

            <button type="submit" className="checkout-continue-btn">
              Continue to Payment
            </button>
          </form>
        </section>

        {/* Right: Order Summary */}
        <aside className="checkout-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <p className="summary-count">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </p>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-thumb">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="summary-thumb-placeholder" />
                    )}
                  </div>
                  <div className="summary-item-info">
                    <div className="summary-item-name">{item.name}</div>
                    <div className="summary-item-meta">
                      Qty {item.quantity || 1} · $
                      {Number(item.price).toFixed(2)} each
                    </div>
                  </div>
                  <div className="summary-item-price">
                    $
                    {(
                      Number(item.price || 0) * (item.quantity || 1)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <p className="summary-empty">
                  Your cart is empty. Add something from the shop first!
                </p>
              )}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (7%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row summary-row-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

export default Checkout;
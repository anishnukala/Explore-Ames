// src/pages/Payment.jsx
import React, { useState } from "react";
import "../assets/css/Payment.css";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely read numbers from location.state (or fall back to 0)
  const subtotal = Number(location.state?.subtotal ?? 0);
  const shipping = Number(location.state?.shipping ?? 0);
  const tax = Number(location.state?.tax ?? 0);
  const total = Number(location.state?.total ?? 0);

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ---------- helpers ----------
  const onlyDigits = (s) => s.replace(/\D/g, "");

  const formatCardNumber = (value) => {
    const digits = onlyDigits(value).slice(0, 16); // max 16 digits
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim(); // 1234 5678 9012 3456
  };

  const formatExpiry = (value) => {
    const digits = onlyDigits(value).slice(0, 4); // MMYY
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const isExpiryValid = (mmYY) => {
    const m = mmYY.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;

    const month = Number(m[1]);
    const year2 = Number(m[2]);
    if (month < 1 || month > 12) return false;

    const year = 2000 + year2;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!nameOnCard || !cardNumber || !expiry || !cvc) {
      setError("Please fill in all payment details.");
      return;
    }

    const digitsOnlyCard = cardNumber.replace(/\s+/g, "");
    if (digitsOnlyCard.length !== 16) {
      setError("Card number must be exactly 16 digits.");
      return;
    }

    if (!isExpiryValid(expiry)) {
      setError("Expiry must be MM/YY and cannot be in the past.");
      return;
    }

    if (!(cvc.length === 3 || cvc.length === 4)) {
      setError("CVC must be 3 or 4 digits.");
      return;
    }

    setSubmitting(true);

    // fake API delay
    setTimeout(() => {
      setSubmitting(false);

      const last4 = digitsOnlyCard.slice(-4);

      // ✅ random order number each checkout
      const orderId = "AE" + Math.floor(10000000 + Math.random() * 90000000);

      navigate("/payment-success", {
        state: {
          orderId,
          total,
          last4, // ✅ pass last 4 digits
          cardholder: nameOnCard.trim(), // ✅ pass cardholder name
        },
      });
    }, 800);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <header className="payment-header">
          <div className="payment-pill">Payment</div>
          <h1 className="payment-title">Payment Details</h1>
          <p className="payment-subtitle">
            Enter your card info to complete your Explore Ames order.
          </p>
        </header>

        {/* Order summary on top of the card */}
        <div className="payment-summary">
          <div className="payment-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="payment-summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="payment-summary-row">
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="payment-summary-row payment-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="payment-field">
            <label>Name on Card</label>
            <input
              type="text"
              placeholder="Enter name on card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
          </div>

          <div className="payment-field">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              inputMode="numeric"
              maxLength={19}
              required
            />
          </div>

          <div className="payment-row">
            <div className="payment-field">
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
                maxLength={5}
                required
              />
            </div>
            <div className="payment-field">
              <label>CVC</label>
              <input
                type="password"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(onlyDigits(e.target.value).slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
                required
              />
            </div>
          </div>

          {error && <div className="payment-error">{error}</div>}

          <button
            type="submit"
            className="payment-button"
            disabled={submitting}
          >
            {submitting ? "Processing…" : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();

  const amount = Number(location.state?.total ?? 49.99);

  const orderId = useMemo(() => {
    return (
      location.state?.orderId ??
      "AE" + Math.floor(10000000 + Math.random() * 90000000)
    );
  }, [location.state?.orderId]);

  const last4 = String(location.state?.last4 ?? "4242").slice(-4);

  const cardholder = (location.state?.cardholder ?? "Explore Ames Shopper").trim();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="pay-success-page">
      <div className="pay-ticket">
        {/* Icon + heading */}
        <div className="pay-icon-wrapper">
          <div className="pay-icon-circle">
            <span className="pay-icon-check">✓</span>
          </div>
        </div>

        <h1 className="pay-title">Payment successful</h1>
        <p className="pay-subtitle">
          Your order has been confirmed. A payment receipt has been generated
          for your records.
        </p>

        {/* Main info layout */}
        <div className="pay-main-grid">
          {/* Left: Order details */}
          <section className="pay-section">
            <h2 className="pay-section-title">Order details</h2>

            <div className="pay-row">
              <span className="pay-label">Order ID</span>
              <span className="pay-value pay-mono">{orderId}</span>
            </div>

            <div className="pay-row">
              <span className="pay-label">Status</span>
              <span className="pay-status-pill">Paid</span>
            </div>

            <div className="pay-row">
              <span className="pay-label">Date</span>
              <span className="pay-value">
                {today} · {time}
              </span>
            </div>

            <div className="pay-row">
              <span className="pay-label">Channel</span>
              <span className="pay-value">Online checkout</span>
            </div>
          </section>

          {/* Right: Payment details */}
          <section className="pay-section">
            <h2 className="pay-section-title">Payment details</h2>

            <div className="pay-row">
              <span className="pay-label">Amount charged</span>
              <span className="pay-value pay-strong">${amount.toFixed(2)}</span>
            </div>

            <div className="pay-row">
              <span className="pay-label">Payment method</span>
              <span className="pay-value">Card · •••• {last4}</span>
            </div>

            <div className="pay-row">
              <span className="pay-label">Cardholder</span>
              <span className="pay-value">{cardholder}</span>
            </div>

            <div className="pay-row">
              <span className="pay-label">Authorization code</span>
              <span className="pay-value pay-mono">AUTH-382714</span>
            </div>
          </section>
        </div>

        {/* Visual card stripe */}
        <div className="pay-card">
          <div className="pay-card-chip" />
          <div className="pay-card-text">
            <div className="pay-card-name">{cardholder}</div>
            <div className="pay-card-meta">Virtual receipt • #{orderId}</div>
          </div>
        </div>

        {/* Divider + barcode */}
        <div className="pay-divider" />
        <div className="pay-barcode" />
        <div className="pay-barcode-text">{orderId}</div>

        {/* Actions (Return to Home is a button below) */}
        <div className="pay-actions">
          <Link to="/shop" className="pay-primary-btn">
            Back to Shop
          </Link>
          <Link to="/" className="pay-secondary-btn">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
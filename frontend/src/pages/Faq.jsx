import React, { useEffect, useState } from "react";
import "../assets/css/Faq.css";
import Footer from "../components/Footer.jsx";

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  // Fetch FAQs from MongoDB via backend API
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000"; 

    (async () => {
      try {
        // Fetch FAQs from MongoDB through the backend
        const res = await fetch(`${API_BASE}/api/faq`);
        if (!res.ok) {
          throw new Error("Failed to fetch FAQs");
        }

        const data = await res.json();

        // Filter and set FAQs if data is valid
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setError("No FAQs available.");
        }
      } catch (e) {
        setError(e.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="faq-page">
      {/* HERO */}
      <header className="faq-header">
        <div className="faq-hero-inner global-hero">
          <span className="faq-badge">FAQ</span>
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find quick answers about Explore Ames, accounts, reviews, and how
            to get the most out of the site.
          </p>
        </div>
      </header>

      {/* FAQ LIST */}
      <main className="faq-content">
        <section className="faq-section">
          <h2 className="faq-section-title">Have questions? We’ve got answers.</h2>

          {loading && <p>Loading FAQs...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="faq-list">
            {items.map((item, index) => {
              const isOpen = index === openIndex;
              return (
                <div className="faq-item" key={index}>
                  <button
                    className="faq-question-row"
                    onClick={() => toggleItem(index)}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Faq;
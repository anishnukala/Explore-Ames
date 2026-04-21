import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer.jsx";

function AdminFaq() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const loadFaqs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/faq`);
      const data = await res.json();
      if (Array.isArray(data)) setFaqs(data);
    } catch (err) {
      console.error("Failed to load FAQs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { question, answer };

    try {
      if (editingId) {
        await fetch(`${API_BASE}/api/faq/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE}/api/faq`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setQuestion("");
      setAnswer("");
      setEditingId(null);
      loadFaqs();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await fetch(`${API_BASE}/api/faq/${id}`, { method: "DELETE" });
      loadFaqs();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =====================
     INLINE STYLES
  ===================== */

  const page = {
    background: "#f2ffe6",
    minHeight: "100vh",
  };

  const hero = {
    padding: "60px 20px",
    textAlign: "center",
  };

  const badge = {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "999px",
    background: "#c9efb7",
    fontWeight: 600,
    marginBottom: 10,
  };

  const title = {
    fontSize: "36px",
    margin: 0,
  };

  const content = {
    maxWidth: 900,
    margin: "0 auto",
    padding: "20px",
  };

  const formBox = {
    maxWidth: 700,
    margin: "0 auto 40px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const input = {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.2)",
    fontSize: 15,
  };

  const textarea = {
    ...input,
    minHeight: 120,
    resize: "vertical",
  };

  const button = {
    width: "fit-content",
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const card = {
    background: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <header style={hero}>
        <span style={badge}>ADMIN</span>
        <h1 style={title}>Manage FAQs</h1>
      </header>

      <main style={content}>
        {/* FORM */}
        <section>
          <h2>{editingId ? "Edit FAQ" : "Add New FAQ"}</h2>

          <form onSubmit={handleSubmit} style={formBox}>
            <input
              style={input}
              type="text"
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            <textarea
              style={textarea}
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />

            <button type="submit" style={button}>
              {editingId ? "Update FAQ" : "Add FAQ"}
            </button>
          </form>
        </section>

        {/* LIST */}
        <section>
          <h2>Existing FAQs</h2>

          {loading && <p>Loading…</p>}

          {faqs.map((faq) => (
            <div key={faq._id} style={card}>
              <strong>{faq.question}</strong>
              <p>{faq.answer}</p>

              <div style={{ display: "flex", gap: 10 }}>
                <button style={button} onClick={() => startEdit(faq)}>
                  Edit
                </button>
                <button style={button} onClick={() => handleDelete(faq._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AdminFaq;
// src/pages/DinersForm.jsx
import React, { useEffect, useState } from "react";
import "../assets/css/Diners.css";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg";

const empty = {
  name: "",
  cuisine: "",
  specialty: "",
  timings: "",
  address: "",
  rating: "4.5",
  phone: "",
  tagsText: "",
  image: "",
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export default function DinersForm({ initialData, onSubmit, submitting }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        cuisine: initialData.cuisine || "",
        specialty: initialData.specialty || "",
        timings: initialData.timings || "",
        address: initialData.address || "",
        rating: String(initialData.rating ?? "4.5"),
        phone: initialData.phone || "",
        tagsText: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : "",
        image: initialData.image || "",
      });
    } else {
      setForm(empty);
    }
  }, [initialData]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const ratingRaw = Number(form.rating);
    const rating = Number.isFinite(ratingRaw) ? clamp(ratingRaw, 0, 5) : 4.5;

    const tags = form.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // unique tags
    const uniqueTags = Array.from(new Set(tags));

    const payload = {
      name: form.name.trim(),
      cuisine: form.cuisine.trim(),
      specialty: form.specialty.trim(),
      timings: form.timings.trim(),
      address: form.address.trim(),
      rating,
      phone: form.phone.trim(),
      tags: uniqueTags,
      image: form.image.trim() || DEFAULT_IMAGE,
    };

    if (typeof onSubmit === "function") onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="diner-form">
      <div style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Restaurant Name"
          required
        />
        <input
          name="cuisine"
          value={form.cuisine}
          onChange={onChange}
          placeholder="Cuisine (e.g., American)"
          required
        />
        <input
          name="specialty"
          value={form.specialty}
          onChange={onChange}
          placeholder="Specialty"
          required
        />
        <input
          name="timings"
          value={form.timings}
          onChange={onChange}
          placeholder="Timings (e.g., 8 AM – 2 PM)"
          required
        />
        <input
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="Address"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="Phone"
        />
        <input
          name="rating"
          value={form.rating}
          onChange={onChange}
          placeholder="Rating (0–5)"
          inputMode="decimal"
        />
        <input
          name="tagsText"
          value={form.tagsText}
          onChange={onChange}
          placeholder="Tags (comma separated)"
        />
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="Image URL (optional)"
        />

        <button type="submit" disabled={!!submitting}>
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
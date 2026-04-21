
import React, { useEffect, useState } from "react";
import "../assets/css/Explore.css";
import Footer from "../components/Footer.jsx";
import { fetchExplorePlaces } from "../utils/exploreApi";

function Explore() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const data = await fetchExplorePlaces();
        if (mounted) setPlaces(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Explore fetch error:", e);
        if (mounted) setErr("Failed to load places.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="explore-page">
      {/* HERO SECTION (unchanged) */}
      <header className="page-header">
        <div className="content-box global-hero">
          <span className="badge">EXPLORE</span>
          <h1>Explore Ames</h1>
          <p>
            Discover scenic spots, parks, and iconic landmarks — plan your next
            adventure across Ames.
          </p>
        </div>
      </header>

      {/* MAP SECTION (unchanged) */}
      <section className="explore-map-wrapper">
        <div className="explore-map-card">
          <h2 className="explore-map-title">Ames Map</h2>

          <iframe
            title="Ames Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.403741617729!2d-93.65027202429848!3d42.03078126354681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87ee70bda0b7b6a3%3A0xb6aeb54d79539d08!2sAmes%2C%20IA!5e0!3m2!1sen!2sus!4v1696977480000!5m2!1sen!2sus"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      {/* FAMOUS PLACES SECTION (same UI, now from MongoDB) */}
      <section className="explore-places">
        <h2 className="section-title">Famous Places to Visit in Ames</h2>

        {loading && <p>Loading...</p>}
        {err && <p>{err}</p>}

        {!loading && !err && (
          <div className="places-grid">
            {places.map((place) => (
              <div className="place-card" key={place._id}>
                {place.image && (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="place-image"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="place-body">
                  <h3 className="place-title">{place.name}</h3>
                  <p className="place-desc">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !err && places.length === 0 && (
          <p>No places available.</p>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Explore;
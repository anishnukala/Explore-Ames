import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Home.css";
import Footer from "../components/Footer";

const heroBg = "/images/HomePage/ames-bg.webp";

const img1 = "/images/HomePage/image1.jpg";
const img2 = "/images/HomePage/image2.jpg";
const img3 = "/images/HomePage/image3.jpg";

const dinersImg = "/images/HomePage/diners.jpg";
const exploreImg = "/images/HomePage/Explore.jpg";
const shopImg = "/images/HomePage/shop.jpg";
const aboutImg = "/images/HomePage/about.jpg";

const sliderImages = [
  { url: img1, alt: "Ames scene 1" },
  { url: img2, alt: "Ames scene 2" },
  { url: img3, alt: "Ames scene 3" },
];

/* -----------------------------------------------------------
   TESTIMONIALS SECTION (INLINE STYLES)
----------------------------------------------------------- */
const Testimonials = () => {
  const testimonials = [
    {
      name: "Jordan M.",
      role: "ISU Student",
      quote:
        "Explore Ames helped my friends and me find diners we never knew existed. The site makes planning a night out super easy.",
      image: "/avatar/profile.png"
    },
    {
      name: "Priya S.",
      role: "New to Ames",
      quote:
        "As someone new to town, this was the perfect guide. The trails and landmarks section made my first weekend here amazing.",
      image: "/avatar/profile.png"
    },
    {
      name: "Alex R.",
      role: "Ames Local",
      quote:
        "I’ve lived in Ames for years and still discovered new local shops through Explore Ames. Love the clean design and tips.",
      image: "/avatar/profile.png"
    }
  ];

  const sectionStyle = {
    width: "100%",
    padding: "40px 0 60px 0",
    background: "#f3ffe8",
  };

  const innerStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 16px",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#264d2c",
    marginBottom: "8px",
    fontFamily: "Poppins, sans-serif",
  };

  const subtitleStyle = {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#3f4e44",
    marginBottom: "28px",
    fontFamily: "Poppins, sans-serif",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 12px 26px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
  };

  const imageStyle = {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  };

  const quoteStyle = {
    fontSize: "0.95rem",
    color: "#324238",
    lineHeight: 1.6,
    marginBottom: "16px",
    fontFamily: "Poppins, sans-serif",
  };

  const nameStyle = {
    fontWeight: 700,
    color: "#1d3b2a",
    fontFamily: "Poppins, sans-serif",
  };

  const roleStyle = {
    fontSize: "0.85rem",
    color: "#607163",
    fontFamily: "Poppins, sans-serif",
    marginBottom: "6px",
  };

  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
        <h2 style={titleStyle}>What People Are Saying</h2>
        <p style={subtitleStyle}>
          Students, locals, and visitors use Explore Ames to find their next favorite spot.
        </p>

        <div style={gridStyle}>
          {testimonials.map((t, i) => (
            <div key={i} style={cardStyle}>
              <img src={t.image} alt={t.name} style={imageStyle} />

              <p style={quoteStyle}>“{t.quote}”</p>

              <span style={nameStyle}>{t.name}</span>
              <span style={roleStyle}>{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
/* ===========================================================
   HOME PAGE
=========================================================== */

function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const scrollToWelcome = () => {
    const el = document.getElementById("welcome");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>The Best of Ames, All in One Place</h1>
          <p>
            Explore Ames is a student-built guide to the city—diners, local shops,
            events, and hidden gems in one place.
          </p>
          <button className="hero-button" onClick={scrollToWelcome}>
            Discover
          </button>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section id="welcome" className="welcome-section">
        <div className="welcome-inner">
          <div className="welcome-text">
            <h2>Welcome to Ames</h2>
            <p>
              Ames blends college-town energy with small-city charm. Stroll Main Street’s
              historic district, catch the carillon at the Iowa State Campanile, and
              find new favorites every week.
            </p>
            <button 
  className="hero-button"
  onClick={() => navigate("/explore")}
>
  Explore Ames
</button>
          </div>

          <div className="welcome-slider">
            <div className="slider-frame">
              <img src={sliderImages[current].url} alt={sliderImages[current].alt} />

              <button className="slider-nav slider-nav-left" onClick={prevSlide}>
                ❮
              </button>
              <button className="slider-nav slider-nav-right" onClick={nextSlide}>
                ❯
              </button>
            </div>

            <div className="slider-dots">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  className={
                    "slider-dot" + (index === current ? " slider-dot-active" : "")
                  }
                  onClick={() => setCurrent(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BUCKET LIST SECTION */}
      <section className="bucket-section home-container">
        <h2 className="bucket-title">Start Your Ames Bucket List</h2>

        <div className="bucket-grid">
          <div className="bucket-card">
            <div className="card-image-wrapper">
              <img src={dinersImg} alt="Diners" />
            </div>
            <div className="card-body">
              <h3>Diners</h3>
              <div className="card-chips">
                <div className="chip">🍳 Breakfast</div>
                <div className="chip">🍔 Casual</div>
              </div>
              <p>From hearty breakfasts to late-night bites, enjoy Ames’ best local food spots.</p>
              <button className="card-button" onClick={() => navigate("/diners")}>
                Explore Diners
              </button>
            </div>
          </div>

          <div className="bucket-card">
            <div className="card-image-wrapper">
              <img src={exploreImg} alt="Explore" />
            </div>
            <div className="card-body">
              <h3>Explore Us</h3>
              <div className="card-chips">
                <div className="chip">🏛 Landmarks</div>
                <div className="chip">🌿 Trails</div>
              </div>
              <p>Find trails, landmarks, and hidden gems across Ames’ most loved spots.</p>
              <button className="card-button" onClick={() => navigate("/explore")}>
                Explore Places
              </button>
            </div>
          </div>

          <div className="bucket-card">
            <div className="card-image-wrapper">
              <img src={shopImg} alt="Shop" />
            </div>
            <div className="card-body">
              <h3>Shop</h3>
              <div className="card-chips">
                <div className="chip">🛍 Merch</div>
                <div className="chip">🎁 Gifts</div>
              </div>
              <p>Browse Ames merch, student-designed apparel, and accessories you’ll love.</p>
              <button className="card-button" onClick={() => navigate("/shop")}>
                Shop Us
              </button>
            </div>
          </div>

          <div className="bucket-card">
  <div className="card-image-wrapper">
    <img src={aboutImg} alt="FAQ" />
  </div>
  <div className="card-body">
    <h3>FAQ</h3>
    <div className="card-chips">
      <div className="chip">❓ Help</div>
      <div className="chip">📚 Answers</div>
    </div>
    <p>
      Find quick answers about diners, shops, and how to use
      the Explore Ames website.
    </p>
    <button
      className="card-button"
      onClick={() => navigate("/faq")}
    >
      View FAQ
    </button>
  </div>
</div>
        </div>
      </section>
              
      <Testimonials />
      
      <Footer />
    </div>
  );
}

export default Home;
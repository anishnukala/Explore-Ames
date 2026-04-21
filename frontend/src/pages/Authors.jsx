import React from "react";
import "../assets/css/Authors.css";

export default function Authors() {
  const authors = [
    {
      name: "Anish Reddy Nukala",
      title: "Computer Science Student",
      email: "arnukala@iastate.edu",
      image: "/images/AuthorsPage/anish.jpeg",
      bio: `I worked primarily on frontend development and administrative features for Explore Ames.
      My contributions included implementing signup functionality, building the admin dashboard,
      developing the Home and Shop pages, and creating backend API routes for admin and shop
      functionality. I also worked on UI/UX styling, testing, debugging, and organizing
      the final technical documentation.`,
    },
    {
      name: "Prajwal Reddy Chenreddy",
      title: "Computer Science Student",
      email: "preddy@iastate.edu",
      image: "/images/AuthorsPage/prajwal.jpeg",
      bio: `I worked mainly on authentication, database integration, and core feature modules.
      My responsibilities included implementing login functionality, developing the Diners
      and Explore pages, building backend CRUD routes, and designing MongoDB schemas.
      I also contributed to UI consistency, testing, debugging, and documentation.`,
    },
  ];

  return (
    <div className="authors-page">
      {/* HERO */}
      <section className="authors-hero">
        <div className="authors-hero-inner">
          <div className="authors-pill">OUR TEAM</div>
          <h1 className="authors-title">Meet the Authors</h1>
          <p className="authors-subtitle">
            This website was created as part of the{" "}
            <strong>Construction of User Interfaces</strong> course at Iowa State
            University. Explore Ames is a full-stack web application designed to
            showcase the city of Ames through an interactive, modern, and
            user-friendly platform.
          </p>
        </div>
      </section>

      {/* AUTHORS */}
      <section className="authors-grid-section">
        <div className="authors-grid">
          {authors.map((a) => (
            <article className="author-card" key={a.email}>
              <div className="author-imgWrap">
                <img src={a.image} alt={a.name} />
              </div>

              <div className="author-body">
                <h2 className="author-name">{a.name}</h2>
                <div className="author-title">{a.title}</div>
                <div className="author-email">{a.email}</div>
                <p className="author-bio">{a.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
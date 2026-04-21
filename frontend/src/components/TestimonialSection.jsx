function TestimonialSection() {
  const testimonials = [
    { id: 1, name: "Student A", quote: "Ames is amazing!" },
    { id: 2, name: "Local Resident", quote: "I love this community." },
  ];

  return (
    <section className="testimonial-section">
      <h2>What People Say</h2>

      <div className="testimonial-grid">
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t.id}>
            <p>"{t.quote}"</p>
            <h4>- {t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialSection;
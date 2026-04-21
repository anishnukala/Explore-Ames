import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-strip">
      © {new Date().getFullYear()} Explore Ames
    </footer>
  );
}

export default Footer;
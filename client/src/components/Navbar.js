import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="logo">
        ✈ TravelBuddy
      </div>

      {/* Desktop Links */}
      <div className="desktop-links">

        <Link to="/">Home</Link>

        <Link to="/about">About</Link>

        <Link to="/features">Features</Link>

        <Link to="/explore">Explore</Link>

        <Link to="/login">Login</Link>

        <Link className="register-btn" to="/register">
          Register
        </Link>

      </div>

      {/* Mobile Hamburger */}

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {menuOpen && (

        <div className="mobile-menu">

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link to="/features" onClick={() => setMenuOpen(false)}>
            Features
          </Link>

          <Link to="/explore" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>

          <Link to="/register" onClick={() => setMenuOpen(false)}>
            Register
          </Link>

        </div>

      )}

    </nav>
  );
}

export default Navbar;
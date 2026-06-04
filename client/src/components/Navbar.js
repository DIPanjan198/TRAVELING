import { Link } from "react-router-dom";
import {useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <h2 className="logo">✈️ TravelBuddy</h2>

      <div
  className="hamburger"
  onClick={() => setMenuOpen(!menuOpen)}
  style={{
    color: "black",
    fontSize: "50px",
    fontWeight: "bold",
  
  }}
>
   ☰
</div>

      <div className={`links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>

        <Link to="/features" onClick={() => setMenuOpen(false)}>
          Features
        </Link>

        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Login
        </Link>

        <Link to="/register" onClick={() => setMenuOpen(false)}>
          Register
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
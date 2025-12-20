import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-bg">
      {/* HERO SECTION */}
      <section className="hero-section">
        <h1 className="hero-title">
          ✈️ Find Your Perfect <span>Travel Buddy</span>
        </h1>

        <p className="hero-subtitle">
          Travel together, share memories, and explore the world with like-minded adventurers 🌍
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Get Started
          </button>
          <button className="secondary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="feature-card">
          🌍
          <h3>Find Travel Buddies</h3>
          <p>Match with people traveling to the same destination.</p>
        </div>

        <div className="feature-card">
          🗺️
          <h3>Explore Destinations</h3>
          <p>Discover exciting places recommended by travelers.</p>
        </div>

        <div className="feature-card">
          🤝
          <h3>Travel Safely</h3>
          <p>Verified users and secure platform for peace of mind.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;

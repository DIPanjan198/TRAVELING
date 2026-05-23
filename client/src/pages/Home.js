import travelImg from "../assets/travel-buddies.jpg";
import exploreImg from "../assets/explore.jpg";
import secureImg from "../assets/secure.jpg";
import MahadevImg from "../assets/Mahadev.jpg";

import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-bg">
       <div className="particles">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <h1 className="hero-title">
           Find Your Perfect <span>Travel Buddy</span>
        </h1>

        <p className="hero-subtitle">
          Travel together, share memories, and explore the world with
          like-minded adventurers 🌍
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

          
         
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">

        <div className="feature-card card1">
          <img
            src={travelImg}
            className="feature-image"
            alt="Find Travel Buddies"
          />

          <h3>🌍 Find Travel Buddies</h3>

          <p>
            Match with people traveling to the same destination and
            build unforgettable memories together.
          </p>
        </div>

        <div className="feature-card card2">
          <img
            src={exploreImg}
            className="feature-image"
            alt="Explore Destinations"
          />

          <h3>🗺️ Explore Destinations</h3>

          <p>
            Discover exciting places recommended by travelers from
            around the world.
          </p>
        </div>

        <div className="feature-card card3">
          <img
            src={secureImg}
            className="feature-image"
            alt="Travel Safely"
          />

          <h3>🤝 Travel Safely</h3>

          <p>
            Connect with verified travelers and enjoy a secure travel
            experience.
          </p>
        </div>

        <div className="feature-card card4">
          <img
            src={MahadevImg}
            className="feature-image"
            alt="Har Har Mahadev"
          />

          <h3>✨ Journeying Through New Places</h3>

          <p>
            Exploring a new place where silence speaks devotion and
            every step leads closer to Mahadev—finding peace, faith,
            and timeless energy in His sacred temple. 🙏
          </p>
        </div>

      </section>
      
    </div>
  );
}

export default Home;
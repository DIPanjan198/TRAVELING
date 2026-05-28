import { useState } from "react";
import { useNavigate } from "react-router-dom";

import travelImg from "../assets/travel-buddies.jpg";
import exploreImg from "../assets/explore.jpg";
import secureImg from "../assets/secure.jpg";
import MahadevImg from "../assets/Mahadev.jpg";
import Front from "../assets/FrontPage.jpg";

import "./Home.css";

function Home() {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const [matchedUsers, setMatchedUsers] = useState([]);

  /* ================= FIND BUDDY ================= */

  const handleFindBuddy = async () => {

    if (
      !destination ||
      !budget ||
      !travelStyle
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await fetch(
        "https://traveling-1-41nr.onrender.com/api/match-users",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            destination,
            budget,
            travelStyle
          })
        }
      );

      const data = await res.json();

      setMatchedUsers(data);

    }

    catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="home-bg">

      {/* HERO */}

      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${Front})`
        }}
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <h1 className="hero-title">

            Find Your Perfect
            <span> Travel Buddy</span>

          </h1>

          <p className="hero-subtitle">

            TravelBuddy Finder is a smart
            travel companion platform that
            helps travelers connect with
            like-minded people heading to
            the same destination.

          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register/explore")}
            >
              Explore
            </button>

          </div>

        </div>

      </section>

      {/* SEARCH SECTION */}

      <section className="search-section">

        <div className="search-box">
          <input
  type="text"
  placeholder="Destination"
  value={destination}
  onChange={(e) => setDestination(e.target.value)}
/>

<select
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
>
  <option value="">Budget</option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>

<select
  value={travelStyle}
  onChange={(e) => setTravelStyle(e.target.value)}
>
  <option value="">Travel Style</option>
  <option value="Adventure">Adventure</option>
  <option value="Luxury">Luxury</option>
  <option value="Backpacking">Backpacking</option>
</select>

          <button onClick={handleFindBuddy}>
            Find Buddy
          </button>

        </div>

      </section>

      {/* STATS */}

      <section className="stats-section">

        <div className="stat-card">
          <h2>5K+</h2>
          <p>Travelers</p>
        </div>

        <div className="stat-card">
          <h2>120+</h2>
          <p>Destinations</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>Trips</p>
        </div>

        <div className="stat-card">
          <h2>4.8</h2>
          <p>Ratings</p>
        </div>

      </section>

      {/* FEATURES */}

      <section className="features-wrapper">

        <h2 className="section-title">
          Why Choose TravelBuddy?
        </h2>

        <div className="features-section">

          <div className="feature-card">
            <img
              src={travelImg}
              className="feature-image"
              alt=""
            />

            <h3>🌍 Find Travel Buddies</h3>

            <p>
              Match with travelers going
              to the same destination.
            </p>
          </div>

          <div className="feature-card">
            <img
              src={exploreImg}
              className="feature-image"
              alt=""
            />

            <h3>🗺 Explore Destinations</h3>

            <p>
              Discover amazing travel
              locations around the world.
            </p>
          </div>

          <div className="feature-card">
            <img
              src={secureImg}
              className="feature-image"
              alt=""
            />

            <h3>🔒 Safe & Secure</h3>

            <p>
              Verified users and trusted
              travel experiences.
            </p>
          </div>

          <div className="feature-card">
            <img
              src={MahadevImg}
              className="feature-image"
              alt=""
            />

            <h3>✨ Spiritual Journeys</h3>

            <p>
              Explore peaceful spiritual
              destinations with companions.
            </p>
          </div>

        </div>

      </section>
      {/* MATCHED USERS */}

<section className="matched-users">

  <h2 className="section-title">
    Matched Travelers
  </h2>

  <div className="matched-grid">

    {matchedUsers.length > 0 ? (

      matchedUsers.map((user) => (

        <div
          className="matched-card"
          key={user._id}
        >

          <h3>{user.name}</h3>

          <p>
            📍 {user.destination}
          </p>

          <p>
            💰 {user.budget}
          </p>

          <p>
            🎒 {user.travelStyle}
          </p>

          <button

            className="connect-btn"

            onClick={() => {

              const loggedIn =
                localStorage.getItem("isLoggedIn");

              if (!loggedIn) {

                navigate("/register");

              }

              else {

                alert(
                  `Connected with ${user.name}`
                );

              }

            }}

          >
            Connect
          </button>

        </div>

      ))

    ) : (

      <p className="no-users">
        No travelers found
      </p>

    )}

  </div>

</section>

    </div>
  );
}

export default Home;
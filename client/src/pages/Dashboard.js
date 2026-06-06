import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Front from "../assets/FrontPage.jpg";
import travelImg from "../assets/travel-buddies.jpg";
import exploreImg from "../assets/explore.jpg";

function Dashboard() {

  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [travelers, setTravelers] = useState([]);
console.log("USER DATA");
console.log(userData);

console.log("USER ID");
console.log(userData._id);
  useEffect(() => {

    const fetchRecommended = async () => {

      try {

        if (!userData?._id) return;

        const res = await fetch(
          `https://traveling-2.onrender.com/api/recommended/${userData._id}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setTravelers(data);
        }

      } catch (err) {

        console.log(err);

      }

    };

    fetchRecommended();

  }, [userData?._id]);

  const handleAvatarChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      const updatedUser = {
        ...userData,
        avatar: reader.result
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUserData(updatedUser);

    };

    reader.readAsDataURL(file);

  };

  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login");

  };

  return (

    <div className="dashboard">

      {/* HERO */}

      <section className="hero-banner">

        <img
          src={Front}
          alt="Travel"
        />

        <div className="hero-overlay">

          <h1>
            Welcome Back,
            <span>
              {" "}
              {userData?.name || "Traveler"} ✈️
            </span>
          </h1>

          <p>
            Discover new destinations,
            connect with travelers and
            create unforgettable memories.
          </p>

        </div>

      </section>

      {/* PROFILE + ACTIONS */}

      <section className="top-grid">

        <div className="profile-card">

          <div className="profile-header">

            <label className="avatar-wrapper">

              <img
                src={
                  userData?.avatar ||
                  "https://api.dicebear.com/7.x/adventurer/png?seed=TravelBuddy"
                }
                alt="Profile"
                className="profile-avatar"
              />

              <div className="edit-avatar">
                📷
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />

            </label>

            <div>

              <h2>
                {userData?.name || "Traveler"}
              </h2>

              <span>
                Travel Explorer ✈️
              </span>

            </div>

          </div>

          <div className="profile-details">

            <div className="detail-box">

              <span>📍 Destination</span>

              <h4>
                {userData?.destination || "Not Selected"}
              </h4>

            </div>

            <div className="detail-box">

              <span>💰 Budget</span>

              <h4>
                {userData?.budget || "Not Selected"}
              </h4>

            </div>

            <div className="detail-box">

              <span>🎒 Travel Style</span>

              <h4>
                {userData?.travelStyle || "Not Selected"}
              </h4>

            </div>

          </div>

        </div>

        <div className="quick-actions">

          <h2>⚡ Quick Actions</h2>

          <div className="action-buttons">

            <button
              onClick={() => navigate("/matching")}
            >
              🌍 Find Buddy
            </button>

            <button
              onClick={() => navigate("/explore")}
            >
              🗺 Explore
            </button>

            <button>
              💬 Messages
            </button>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>

      </section>

      {/* DESTINATIONS */}

      <section className="section">

        <h2 className="section-heading">
          🔥 Trending Destinations
        </h2>

        <div className="destination-grid">

          <div className="destination-card">
            <img src={travelImg} alt="Goa" />
            <h3>Goa</h3>
          </div>

          <div className="destination-card">
            <img src={exploreImg} alt="Bali" />
            <h3>Bali</h3>
          </div>

          <div className="destination-card">
            <img src={Front} alt="Dubai" />
            <h3>Dubai</h3>
          </div>

        </div>

      </section>

      {/* RECOMMENDED USERS */}

      <section className="section">

        <h2 className="section-heading">
          🤝 Travelers Matching Your Preferences
        </h2>

        <p className="section-subtitle">

          Based on your interests:

          <strong>
            {" "}
            {userData?.destination || "Destination"}
          </strong>

          {" • "}

          <strong>
            {userData?.budget || "Budget"}
          </strong>

          {" • "}

          <strong>
            {userData?.travelStyle || "Travel Style"}
          </strong>

        </p>

        <div className="traveler-grid">

          {travelers.length > 0 ? (

            travelers.map((traveler) => (

              <div
                className="traveler-card"
                key={traveler._id}
              >

                <img
                  src={
                    traveler.avatar ||
                    "https://api.dicebear.com/7.x/adventurer/png?seed=Traveler"
                  }
                  alt={traveler.name}
                  className="traveler-avatar"
                />

                <div className="traveler-content">

                  <h3>
                    {traveler.name}
                  </h3>

                  <div className="match-badge">
                    Perfect Match
                  </div>

                  <p>
                    📍 {traveler.destination}
                  </p>

                  <p>
                    💰 {traveler.budget}
                  </p>

                  <p>
                    🎒 {traveler.travelStyle}
                  </p>

                </div>

                <button
                  className="connect-btn"
                  onClick={() =>
                    navigate("/matching")
                  }
                >
                  Connect
                </button>

              </div>

            ))

          ) : (

            <div className="no-users">

              <h3>
                No matching travelers found
              </h3>

              <p>
                Try registering another user
                with the same destination,
                budget and travel style.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>

  );

}

export default Dashboard;
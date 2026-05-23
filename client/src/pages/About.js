import "./About.css";

function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>🌍 About TravelBuddy Finder</h1>

        <p>
          Connecting travelers, creating friendships,
          and making every journey unforgettable.
        </p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>🚀 Our Mission</h2>

          <p>
            TravelBuddy Finder helps people find
            trustworthy travel companions who share
            similar destinations, budgets, and travel
            styles.
          </p>
        </div>

        <div className="about-card">
          <h2>🌟 Our Vision</h2>

          <p>
            We believe travel should never feel lonely.
            Our vision is to build a global community
            where travelers connect, explore, and create
            lifelong memories together.
          </p>
        </div>

        <div className="about-card">
          <h2>✈️ What We Do</h2>

          <p>
            TravelBuddy Finder matches travelers based
            on destination, budget, and preferences.
            Users can connect, plan trips, and travel
            together safely.
          </p>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-box">
          <h2>🌎</h2>
          <h3>100+</h3>
          <p>Destinations</p>
        </div>

        <div className="stat-box">
          <h2>🤝</h2>
          <h3>1000+</h3>
          <p>Travel Connections</p>
        </div>

        <div className="stat-box">
          <h2>⭐</h2>
          <h3>4.9</h3>
          <p>User Rating</p>
        </div>
      </section>

      <section className="team-section">
        <h2>💙 Why Choose TravelBuddy?</h2>

        <div className="team-grid">
          <div className="team-card">
            <h3>🌍 Destination Matching</h3>
            <p>
              Find travelers heading to the same place.
            </p>
          </div>

          <div className="team-card">
            <h3>🎒 Travel Preferences</h3>
            <p>
              Match based on budget and travel style.
            </p>
          </div>

          <div className="team-card">
            <h3>🔒 Safe & Secure</h3>
            <p>
              Verified users and secure authentication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
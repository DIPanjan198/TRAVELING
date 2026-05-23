import "./FindTravelBuddies.css";
import { Link } from "react-router-dom";
function FindTravelBuddies() {
  return (
    <div className="finder-bg">
      <div className="finder-header">
        <h1>
          ✈️ Travel Buddy Finder
        </h1>
        <p>Find your perfect travel companion and explore the world together 🌍</p>
      </div>

      <div className="features-grid">
       <Link to="/matching" className="feature-card">
        <div className="feature-card">
          <h3>🌍 Destination Matching</h3>
          <p>Connect with travelers going to the same destination as you.</p>
        </div></Link>

        <div className="feature-card">
          <h3>🧭 Travel Preferences</h3>
          <p>Find buddies based on budget, dates, and travel style.</p>
        </div>

        <div className="feature-card">
          <h3>🤝 Verified Profiles</h3>
          <p>Meet genuine travelers with secure and verified accounts.</p>
        </div>

        <div className="feature-card disabled">
          <h3>💬 Live Chat</h3>
          <p>Coming soon — chat instantly with your travel buddy.</p>
        </div>
      </div>
    </div>
  );
}

export default FindTravelBuddies;



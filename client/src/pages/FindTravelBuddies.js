import React from "react";
import { Link } from "react-router-dom";
import TiltCard from "../components/TiltCard";
import ScrollReveal from "../components/ScrollReveal";
import "./FindTravelBuddies.css";

function FindTravelBuddies() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="finder-container">
      {/* Background Blobs */}
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <ScrollReveal className="finder-header">
        <span className="badge badge-emerald">Match Hub</span>
        <h1>Find Travel Companions</h1>
        <p>Connect with explorers heading to the same destinations or sharing your budget and travel vibe.</p>
      </ScrollReveal>

      <ScrollReveal className="finder-grid">
        {/* Card 1: Destination Matching */}
        <TiltCard maxTilt={8}>
          <Link to="/matching" className="finder-card-link">
            <div className="finder-card glass-panel" style={{ height: "100%" }}>
              <div className="finder-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3>Destination Matching</h3>
              <p>Connect with users heading to <strong>{user.destination || "your selected spot"}</strong> directly. Compare schedules and chat.</p>
              <span className="finder-card-action">Launch Matcher →</span>
            </div>
          </Link>
        </TiltCard>

        {/* Card 2: Preference Filter */}
        <TiltCard maxTilt={8}>
          <Link to="/" className="finder-card-link">
            <div className="finder-card glass-panel" style={{ height: "100%" }}>
              <div className="finder-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Quick Search Wizard</h3>
              <p>Filter travelers by budget range, preferred travel style, and custom keywords on our home match board.</p>
              <span className="finder-card-action">Open Search →</span>
            </div>
          </Link>
        </TiltCard>

        {/* Card 3: Destination Explorer */}
        <TiltCard maxTilt={8}>
          <Link to="/explore" className="finder-card-link">
            <div className="finder-card glass-panel" style={{ height: "100%" }}>
              <div className="finder-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
              </div>
              <h3>Explore Trends</h3>
              <p>Don't have a plan yet? Browse our global destinations feed and choose a trip to join others.</p>
              <span className="finder-card-action">Browse Destinations →</span>
            </div>
          </Link>
        </TiltCard>
      </ScrollReveal>

      {/* Trust banner */}
      <ScrollReveal className="finder-info-banner-wrapper">
        <TiltCard maxTilt={5}>
          <div className="finder-info-banner glass-panel">
            <div className="banner-badge">🔐 Safety Protocol</div>
            <h4>All profiles listed on AeroTravel are subject to identity check validation.</h4>
            <p>Always communicate using the in-app chat until you establish mutual travel trust. Keep details secure.</p>
          </div>
        </TiltCard>
      </ScrollReveal>
    </div>
  );
}

export default FindTravelBuddies;

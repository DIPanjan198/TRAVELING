import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";
import "./DestinationMatching.css";

const DestinationMatching = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Wanderer",
    destination: "Goa",
    budget: "Medium",
    travelStyle: "Adventure"
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`);

        if (!res.ok) throw new Error("Could not load users list");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Could not retrieve traveler directory. Utilizing local offline list.");
        // Fallback local list in case backend is sleeping/offline
        setUsers([
          { _id: "1", name: "Rahul", destination: "Goa", travelStyle: "Adventure", budget: "Medium", avatar: "" },
          { _id: "2", name: "Priya", destination: "Manali", travelStyle: "Luxury", budget: "High", avatar: "" },
          { _id: "3", name: "Amit", destination: "Goa", travelStyle: "Backpacking", budget: "Low", avatar: "" },
          { _id: "4", name: "Sara", destination: "Goa", travelStyle: "Adventure", budget: "Medium", avatar: "" },
          { _id: "5", name: "Deepak", destination: "Paris", travelStyle: "Backpacking", budget: "Medium", avatar: "" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Compute matches based on currentUser preferences
  const matches = users
    .filter(u => u.email !== currentUser.email && u._id !== currentUser._id)
    .map(traveler => {
      let score = 0;
      let breakdown = [];

      // Destination check (case-insensitive)
      if (
        traveler.destination &&
        currentUser.destination &&
        traveler.destination.toLowerCase().trim() === currentUser.destination.toLowerCase().trim()
      ) {
        score += 50;
        breakdown.push("Destination Match");
      }

      // Budget check
      if (
        traveler.budget &&
        currentUser.budget &&
        traveler.budget.toLowerCase() === currentUser.budget.toLowerCase()
      ) {
        score += 25;
        breakdown.push("Budget Alignment");
      }

      // Travel style check
      if (
        traveler.travelStyle &&
        currentUser.travelStyle &&
        traveler.travelStyle.toLowerCase() === currentUser.travelStyle.toLowerCase()
      ) {
        score += 25;
        breakdown.push("Vibe Match");
      }

      return { ...traveler, score, breakdown };
    })
    .filter(m => m.score > 0) // Only show travelers with at least one matching parameter
    .sort((a, b) => b.score - a.score);

  return (
    <div className="matching-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <header className="matching-header">
        <span className="badge badge-indigo">Dynamic AI Matching</span>
        <h1>Perfect Match Finder</h1>
        <p>AeroTravel matches you dynamically based on destination targets, budget sizes, and travel styles.</p>
      </header>

      {/* Preferences Profile Panel */}
      <div className="preference-profile glass-panel">
        <h3>Your Current Targets</h3>
        <div className="preference-tags">
          <span className="pref-tag">📍 Destination: <strong>{currentUser.destination || "Not Selected"}</strong></span>
          <span className="pref-tag">💰 Budget: <strong>{currentUser.budget || "Not Selected"}</strong></span>
          <span className="pref-tag">🎒 Vibe: <strong>{currentUser.travelStyle || "Not Selected"}</strong></span>
        </div>
        <p className="pref-note">Need to update this? Go to your <span onClick={() => navigate("/dashboard")} className="link-span">Dashboard Preferences</span>.</p>
      </div>

      {loading ? (
        <div className="matching-loader">
          <div className="spinner"></div>
          <p>Analyzing matching database...</p>
        </div>
      ) : error ? (
        <div className="auth-alert error" style={{ width: "100%", textAlign: "center" }}>{error}</div>
      ) : null}

      {!loading && (
        <div className="matches-section">
          <h2>Active Matches ({matches.length})</h2>
          {matches.length > 0 ? (
            <div className="matches-grid">
              {matches.map((traveler, idx) => (
                <div className="match-user-card glass-panel" key={traveler._id || idx}>
                  <div className="match-score-radial">
                    <span>{traveler.score}%</span>
                    <p>Match</p>
                  </div>

                  <div className="match-card-avatar">
                    {traveler.avatar && traveler.avatar.startsWith("data:") ? (
                      <img 
                        src={traveler.avatar} 
                        alt={traveler.name} 
                      />
                    ) : (
                      <div className="match-avatar-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h3>{traveler.name}</h3>

                  <div className="match-card-meta">
                    <span>📍 {traveler.destination || "Anywhere"}</span>
                    <span>💰 {traveler.budget || "Medium"} Budget</span>
                    <span>🎒 {traveler.travelStyle || "Backpacker"}</span>
                  </div>

                  <div className="match-breakdown">
                    {traveler.breakdown.map((item, id) => (
                      <span key={id} className="badge badge-emerald">{item}</span>
                    ))}
                  </div>

                  <button className="btn btn-primary match-connect-btn" onClick={() => navigate(`/chat/${traveler._id}`)}>
                    Plan Journey Chat
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-matches-panel glass-panel">
              <h3>No Perfect Matches Yet</h3>
              <p>We couldn't find other members matches for your exact combo. Try registering a matching companion user or broadening your destination scope on the dashboard!</p>
              <button className="btn btn-glass" onClick={() => navigate("/dashboard")}>Update Dashboard Profiles</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationMatching;
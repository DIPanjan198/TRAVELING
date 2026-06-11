import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";
import "./DestinationMatching.css";

const DestinationMatching = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Wanderer",
    destination: "Goa",
    budget: "Medium",
    travelStyle: "Adventure"
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`);
        if (!res.ok) throw new Error("Could not load users list");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Could not retrieve traveler directory. Showing offline demo data.");
        setUsers([
          { _id: "1", name: "Rahul", destination: "Goa", travelStyle: "Adventure", budget: "Medium", avatar: "" },
          { _id: "2", name: "Priya", destination: "Manali", travelStyle: "Luxury", budget: "High", avatar: "" },
          { _id: "3", name: "Amit", destination: "Goa", travelStyle: "Backpacking", budget: "Low", avatar: "" },
          { _id: "4", name: "Sara", destination: "Goa", travelStyle: "Adventure", budget: "Medium", avatar: "" },
          { _id: "5", name: "Deepak", destination: "Paris", travelStyle: "Backpacking", budget: "Medium", avatar: "" }
        ]);
      }

      // Fetch connections separately
      if (currentUser?._id) {
        try {
          const cRes = await fetch(`${API_BASE}/api/connections/${currentUser._id}`);
          const cData = await cRes.json();
          if (Array.isArray(cData)) setConnections(cData);
        } catch (e) {
          console.error("Could not load connections:", e);
        }
      }

      setLoading(false);
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Compute matches: MUST have matching destination ---
  const matches = users
    .filter(u => u.email !== currentUser.email && u._id !== currentUser._id)
    .map(traveler => {
      const destMatch =
        traveler.destination &&
        currentUser.destination &&
        traveler.destination.toLowerCase().trim() === currentUser.destination.toLowerCase().trim();

      // Destination is mandatory — skip users who don't match
      if (!destMatch) return null;

      let score = 50; // base for destination match
      const breakdown = [{ label: "📍 Destination", matched: true }];

      if (
        traveler.budget &&
        currentUser.budget &&
        traveler.budget.toLowerCase() === currentUser.budget.toLowerCase()
      ) {
        score += 25;
        breakdown.push({ label: "💰 Budget", matched: true });
      } else {
        breakdown.push({ label: "💰 Budget", matched: false });
      }

      if (
        traveler.travelStyle &&
        currentUser.travelStyle &&
        traveler.travelStyle.toLowerCase() === currentUser.travelStyle.toLowerCase()
      ) {
        score += 25;
        breakdown.push({ label: "🎒 Travel Style", matched: true });
      } else {
        breakdown.push({ label: "🎒 Travel Style", matched: false });
      }

      return { ...traveler, score, breakdown };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  // --- Connection helpers ---
  const getConnectionState = (travelerId) => {
    if (!currentUser?._id) return { status: "none" };
    const conn = connections.find(c =>
      (c.sender._id === currentUser._id && c.receiver._id === travelerId) ||
      (c.sender._id === travelerId && c.receiver._id === currentUser._id)
    );
    if (!conn) return { status: "none" };
    return {
      status: conn.status,
      isSender: conn.sender._id === currentUser._id,
      connectionId: conn._id
    };
  };

  const handleConnect = async (receiverId) => {
    if (!currentUser?._id) { navigate("/login"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/connections/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUser._id, receiverId })
      });
      if (res.ok) {
        const cRes = await fetch(`${API_BASE}/api/connections/${currentUser._id}`);
        const cData = await cRes.json();
        if (Array.isArray(cData)) setConnections(cData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      const res = await fetch(`${API_BASE}/api/connections/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId })
      });
      if (res.ok) {
        const cRes = await fetch(`${API_BASE}/api/connections/${currentUser._id}`);
        const cData = await cRes.json();
        if (Array.isArray(cData)) setConnections(cData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (connectionId) => {
    try {
      const res = await fetch(`${API_BASE}/api/connections/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId })
      });
      if (res.ok) {
        const cRes = await fetch(`${API_BASE}/api/connections/${currentUser._id}`);
        const cData = await cRes.json();
        if (Array.isArray(cData)) setConnections(cData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderActionButton = (traveler) => {
    const connState = getConnectionState(traveler._id);

    if (connState.status === "accepted") {
      return (
        <button className="btn btn-secondary match-connect-btn" onClick={() => navigate(`/chat/${traveler._id}`)}>
          💬 Chat &amp; Plan
        </button>
      );
    }

    if (connState.status === "pending") {
      if (connState.isSender) {
        return (
          <button className="btn btn-glass match-connect-btn" disabled style={{ opacity: 0.65, cursor: "not-allowed" }}>
            ⏳ Request Sent
          </button>
        );
      } else {
        return (
          <div className="match-accept-decline-row">
            <button className="btn btn-emerald" onClick={() => handleAccept(connState.connectionId)}>
              ✓ Accept
            </button>
            <button className="btn btn-red" onClick={() => handleDecline(connState.connectionId)}>
              ✕ Decline
            </button>
          </div>
        );
      }
    }

    return (
      <button className="btn btn-primary match-connect-btn" onClick={() => handleConnect(traveler._id)}>
        🤝 Connect
      </button>
    );
  };

  const scoreColor = (score) => {
    if (score === 100) return "score-perfect";
    if (score >= 75) return "score-high";
    return "score-base";
  };

  return (
    <div className="matching-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <header className="matching-header">
        <span className="badge badge-indigo">Dynamic AI Matching</span>
        <h1>Perfect Match Finder</h1>
        <p>
          Only showing travelers heading to <strong>{currentUser.destination || "your destination"}</strong>.
          Match percentage increases when budget &amp; travel style also align.
        </p>
      </header>

      {/* Your Targets Profile */}
      <div className="preference-profile glass-panel">
        <h3>Your Current Targets</h3>
        <div className="preference-tags">
          <span className="pref-tag">📍 Destination: <strong>{currentUser.destination || "Not Set"}</strong></span>
          <span className="pref-tag">💰 Budget: <strong>{currentUser.budget || "Not Set"}</strong></span>
          <span className="pref-tag">🎒 Vibe: <strong>{currentUser.travelStyle || "Not Set"}</strong></span>
        </div>
        <p className="pref-note">
          Need to update?{" "}
          <span onClick={() => navigate("/dashboard")} className="link-span">
            Go to Dashboard Preferences
          </span>
        </p>
      </div>

      {loading ? (
        <div className="matching-loader">
          <div className="spinner" />
          <p>Analyzing matching database...</p>
        </div>
      ) : error ? (
        <div className="match-error-banner">{error}</div>
      ) : null}

      {!loading && (
        <div className="matches-section">
          <div className="matches-section-title">
            <h2>
              {matches.length > 0
                ? `${matches.length} Traveler${matches.length > 1 ? "s" : ""} Heading to ${currentUser.destination}`
                : "No Matches Found"}
            </h2>
            {matches.length > 0 && (
              <p className="matches-hint">
                Sorted by compatibility score — connect first to unlock chat.
              </p>
            )}
          </div>

          {matches.length > 0 ? (
            <div className="matches-grid">
              {matches.map((traveler, idx) => (
                <div className="match-user-card glass-panel" key={traveler._id || idx}>

                  {/* Score Badge */}
                  <div className={`match-score-badge ${scoreColor(traveler.score)}`}>
                    <div className="score-ring">
                      <svg viewBox="0 0 36 36" className="score-svg">
                        <path
                          className="score-track"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="score-fill"
                          strokeDasharray={`${traveler.score}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="score-number">{traveler.score}%</span>
                    </div>
                    <p className="score-label">Match</p>
                  </div>

                  {/* Avatar */}
                  <div className="match-card-avatar">
                    {traveler.avatar && traveler.avatar.startsWith("data:") ? (
                      <img src={traveler.avatar} alt={traveler.name} />
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

                  {/* Meta info */}
                  <div className="match-card-meta">
                    <span>📍 {traveler.destination}</span>
                    <span>💰 {traveler.budget || "Medium"} Budget</span>
                    <span>🎒 {traveler.travelStyle || "Backpacker"}</span>
                  </div>

                  {/* Match breakdown bars */}
                  <div className="match-breakdown-bars">
                    {traveler.breakdown.map((item, id) => (
                      <div key={id} className={`breakdown-bar-item ${item.matched ? "matched" : "unmatched"}`}>
                        <span className="breakdown-label">{item.label}</span>
                        <span className="breakdown-status">
                          {item.matched ? "✓" : "✕"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action button */}
                  {renderActionButton(traveler)}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-matches-panel glass-panel">
              <div className="no-match-icon">🔍</div>
              <h3>No Travelers Found for {currentUser.destination || "your destination"}</h3>
              <p>
                No other members have set <strong>{currentUser.destination}</strong> as their destination yet.
                Try changing your destination on the Dashboard or invite friends to join!
              </p>
              <button className="btn btn-glass" onClick={() => navigate("/dashboard")}>
                Update Preferences
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationMatching;
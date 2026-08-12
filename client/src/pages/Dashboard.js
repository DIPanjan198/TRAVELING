import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";
import TiltCard from "../components/TiltCard";
import ScrollReveal from "../components/ScrollReveal";
import AestheticConsole from "../components/AestheticConsole";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");

  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {
      name: "Adventurer",
      email: "wanderer@domain.com",
      destination: "Goa",
      budget: "Medium",
      travelStyle: "Adventure",
      avatar: ""
    };
  });

  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);

  // Preference fields state
  const [prefDest, setPrefDest] = useState(userData.destination || "");
  const [prefBudget, setPrefBudget] = useState(userData.budget || "");
  const [prefStyle, setPrefStyle] = useState(userData.travelStyle || "");

  // Custom alert banners state
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // Itinerary items list with categories
  const [itinerary, setItinerary] = useState([
    { id: 1, text: "Book flight tickets", done: true, category: "flights" },
    { id: 2, text: "Check hotel bookings & ratings", done: false, category: "booking" },
    { id: 3, text: "Pack hiking boots & rain jackets", done: false, category: "packing" },
    { id: 4, text: "Convert currency & activate card", done: false, category: "general" }
  ]);
  const [newItineraryItem, setNewItineraryItem] = useState("");
  const [newItineraryCategory, setNewItineraryCategory] = useState("general");

  // Fetch match recommendations
  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      try {
        if (!userData?._id) {
          // If no user ID, load fallback data
          setTravelers([
            { _id: "1", name: "Rahul", destination: userData.destination || "Goa", travelStyle: "Adventure", budget: "Medium", score: 100 },
            { _id: "4", name: "Sara", destination: userData.destination || "Goa", travelStyle: "Adventure", budget: "Medium", score: 100 }
          ]);
          return;
        }
        const res = await fetch(`${API_BASE}/api/users`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const matchedTravelers = data
            .filter(u => u._id !== userData._id && u.email !== userData.email)
            .filter(u => {
              if (!u.destination || !userData.destination) return false;
              return u.destination.toLowerCase().trim() === userData.destination.toLowerCase().trim();
            })
            .map(traveler => {
              let score = 50; // Base 50% for destination match
              if (
                traveler.budget &&
                userData.budget &&
                traveler.budget.toLowerCase() === userData.budget.toLowerCase()
              ) {
                score += 25;
              }
              if (
                traveler.travelStyle &&
                userData.travelStyle &&
                traveler.travelStyle.toLowerCase() === userData.travelStyle.toLowerCase()
              ) {
                score += 25;
              }
              return { ...traveler, score };
            })
            .sort((a, b) => b.score - a.score);
          setTravelers(matchedTravelers);
        } else {
          setTravelers([]);
        }
      } catch (err) {
        console.error(err);
        setTravelers([
          { _id: "10", name: "Alex Rover", destination: userData.destination, travelStyle: userData.travelStyle, budget: userData.budget, score: 75 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id, userData.destination, userData.travelStyle, userData.budget]);

  // Sync avatar updates
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const updatedUser = {
        ...userData,
        avatar: reader.result
      };

      if (userData?._id) {
        try {
          await fetch(`${API_BASE}/api/users/${userData._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: userData.name,
              destination: userData.destination,
              budget: userData.budget,
              travelStyle: userData.travelStyle,
              avatar: reader.result
            })
          });
        } catch (err) {
          console.error("Database sync error:", err);
        }
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  // Save travel preferences and trigger dynamic success banner
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setAlertMsg(null);

    const updatedUser = {
      ...userData,
      destination: prefDest,
      budget: prefBudget,
      travelStyle: prefStyle
    };

    if (userData?._id) {
      try {
        const res = await fetch(`${API_BASE}/api/users/${userData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            destination: prefDest,
            budget: prefBudget,
            travelStyle: prefStyle,
            avatar: userData.avatar
          })
        });
        if (res.ok) {
          setAlertType("success");
          setAlertMsg("Preferences updated successfully! Match recommendations refreshed. ✅");
        } else {
          setAlertType("error");
          setAlertMsg("Failed to save preference settings. Try again later.");
        }
      } catch (err) {
        console.error("Database sync error:", err);
        setAlertType("error");
        setAlertMsg("Connection failed. Local updates saved.");
      }
    } else {
      setAlertType("success");
      setAlertMsg("Offline mode: Preferences updated in local state successfully.");
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserData(updatedUser);

    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  // Itinerary items checklist handlers
  const addItineraryItem = (e) => {
    e.preventDefault();
    if (!newItineraryItem.trim()) return;
    setItinerary([
      ...itinerary,
      { 
        id: Date.now(), 
        text: newItineraryItem.trim(), 
        done: false, 
        category: newItineraryCategory 
      }
    ]);
    setNewItineraryItem("");
  };

  const toggleItineraryItem = (id) => {
    setItinerary(itinerary.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteItineraryItem = (id) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // Connections logic
  const fetchConnections = async () => {
    if (!userData?._id) return;
    try {
      const res = await fetch(`${API_BASE}/api/connections/${userData._id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setConnections(data);
      }
    } catch (err) {
      console.error("Failed to load connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);

  const handleConnectRequest = async (receiverId) => {
    try {
      const res = await fetch(`${API_BASE}/api/connections/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: userData._id, receiverId })
      });
      if (res.ok) {
        fetchConnections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    try {
      const res = await fetch(`${API_BASE}/api/connections/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId })
      });
      if (res.ok) {
        fetchConnections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineConnection = async (connectionId) => {
    try {
      const res = await fetch(`${API_BASE}/api/connections/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId })
      });
      if (res.ok) {
        fetchConnections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getConnectionState = (travelerId) => {
    if (!userData?._id || !connections) return { status: "none" };

    const conn = connections.find(c => {
      const sId = c.sender?._id || c.sender;
      const rId = c.receiver?._id || c.receiver;
      return (sId === userData._id && rId === travelerId) ||
             (sId === travelerId && rId === userData._id);
    });

    if (!conn) return { status: "none" };

    const sId = conn.sender?._id || conn.sender;
    return {
      status: conn.status,
      isSender: sId === userData._id,
      connectionId: conn._id
    };
  };

  const renderConnectButton = (traveler) => {
    const connState = getConnectionState(traveler._id);

    if (connState.status === "none") {
      return (
        <button className="btn btn-primary" onClick={() => handleConnectRequest(traveler._id)}>
          Connect
        </button>
      );
    }

    if (connState.status === "pending") {
      if (connState.isSender) {
        return (
          <button className="btn btn-glass" style={{ opacity: 0.7, cursor: "not-allowed" }} disabled>
            Sent Pending
          </button>
        );
      } else {
        return (
          <span className="badge badge-purple" style={{ padding: "8px 16px", textTransform: "none", fontSize: "0.85rem", fontWeight: "700" }}>
            🔔 Request Pending
          </span>
        );
      }
    }

    return (
      <button className="btn btn-primary" onClick={() => navigate(`/chat/${traveler._id}`)}>
        Chat & Plan
      </button>
    );
  };

  // Dynamic statistics calculations
  const calculateProfileStrength = () => {
    let score = 40; // Base details (Name, Email, password registered)
    if (userData?.avatar) score += 20;
    if (userData?.destination) score += 20;
    if (userData?.budget) score += 10;
    if (userData?.travelStyle) score += 10;
    return score;
  };

  const profileStrength = calculateProfileStrength();
  const acceptedBuddiesCount = connections.filter(c => c.status === "accepted").length;
  const doneTasksCount = itinerary.filter(item => item.done).length;
  const checklistCompletionPercent = itinerary.length > 0 ? Math.round((doneTasksCount / itinerary.length) * 100) : 0;

  return (
    <div className="dashboard-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      {/* Profile Header Banner */}
      <section className="profile-banner-card glass-panel">
        <div className="profile-cover-photo">
          <div className="profile-cover-grid"></div>
          <div className="profile-cover-glow"></div>
        </div>
        <div className="profile-banner-header">
          <label className="profile-avatar-wrapper">
            {userData?.avatar && userData.avatar.startsWith("data:") ? (
              <img
                src={userData.avatar}
                alt="Profile Avatar"
                className="dashboard-avatar"
              />
            ) : (
              <div className="dashboard-avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            <div className="edit-avatar-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>

          <div className="profile-banner-text">
            <h2>{userData?.name || "Explorer"}</h2>
            <p>Member Status: <span className="badge badge-emerald">Verified Explorer</span></p>
          </div>

          <div className="profile-banner-actions">
            <button className="btn btn-glass" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Global overview tags */}
        <div className="profile-overview-row">
          <div className="overview-item">
            <span>📍 Destination</span>
            <h4>{userData.destination || "None"}</h4>
          </div>
          <div className="overview-item">
            <span>💰 Budget</span>
            <h4>{userData.budget || "None"}</h4>
          </div>
          <div className="overview-item">
            <span>🎒 Travel Vibe</span>
            <h4>{userData.travelStyle || "None"}</h4>
          </div>
        </div>
      </section>

      {/* Interactive Summary Metrics Cards Row */}
      <ScrollReveal className="dashboard-metrics-grid">
        {/* Metric 1 */}
        <TiltCard maxTilt={8}>
          <div className="metric-card glass-panel" style={{ height: "100%" }}>
            <div className="metric-icon-box primary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-title">Profile Strength</span>
              <span className="metric-value">{profileStrength}%</span>
            </div>
          </div>
        </TiltCard>

        {/* Metric 2 */}
        <TiltCard maxTilt={8}>
          <div className="metric-card glass-panel" style={{ height: "100%" }}>
            <div className="metric-icon-box secondary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-title">Shared Matches</span>
              <span className="metric-value">{travelers.length}</span>
            </div>
          </div>
        </TiltCard>

        {/* Metric 3 */}
        <TiltCard maxTilt={8}>
          <div className="metric-card glass-panel" style={{ height: "100%" }}>
            <div className="metric-icon-box purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-title">Active Buddies</span>
              <span className="metric-value">{acceptedBuddiesCount}</span>
            </div>
          </div>
        </TiltCard>

        {/* Metric 4 */}
        <TiltCard maxTilt={8}>
          <div className="metric-card glass-panel" style={{ height: "100%" }}>
            <div className="metric-icon-box yellow">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 00-2 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-title">Planner Tasks</span>
              <span className="metric-value">{doneTasksCount}/{itinerary.length}</span>
            </div>
          </div>
        </TiltCard>
      </ScrollReveal>

      {/* Tabs Navigation */}
      <div className="tabs-navigation glass-panel">
        <button
          className={`tab-link ${activeTab === "matches" ? "active" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          My Matches
        </button>
        <button
          className={`tab-link ${activeTab === "preferences" ? "active" : ""}`}
          onClick={() => setActiveTab("preferences")}
        >
          My Preferences
        </button>
        <button
          className={`tab-link ${activeTab === "itinerary" ? "active" : ""}`}
          onClick={() => setActiveTab("itinerary")}
        >
          Trip Planner
        </button>
      </div>

      {/* Tab Contents */}
      <div className="tab-content-panel">
        
        {/* Tab 1: Matches */}
        {activeTab === "matches" && (
          <div className="tab-matches">
            <h3>Travelers Matching Your Vibe</h3>
            <p className="tab-subtitle">Based on your shared destination, budget limit, and backpacking styles.</p>

            {/* Connection Requests Banner */}
            {(() => {
              const incomingRequests = connections.filter(c => c.receiver?._id === userData?._id && c.status === "pending");
              if (incomingRequests.length === 0) return null;
              return (
                <div className="incoming-requests-section glass-panel" style={{ marginBottom: "24px", padding: "20px" }}>
                  <h4 style={{ color: "var(--secondary-light)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🔔</span> Connection Requests ({incomingRequests.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {incomingRequests.map((req) => (
                      <div key={req._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", background: "var(--primary-glow)", border: "1px solid var(--border-focus)", display: "flex", alignItems: "center", justifycontent: "center" }}>
                            {req.sender?.avatar && req.sender.avatar.startsWith("data:") ? (
                              <img src={req.sender.avatar} alt={req.sender.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", color: "var(--text-secondary)" }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <strong style={{ color: "var(--text-primary)" }}>{req.sender?.name || "Explorer"}</strong>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "8px" }}>
                              Matching in {req.sender?.destination}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="btn btn-emerald" onClick={() => handleAcceptConnection(req._id)} style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                            Accept
                          </button>
                          <button className="btn btn-red" onClick={() => handleDeclineConnection(req._id)} style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {loading ? (
              <div className="loader-box">
                <div className="spinner"></div>
                <p>Retrieving matching users...</p>
              </div>
            ) : travelers.length > 0 ? (
              <div className="matches-list-grid">
                {travelers.map((traveler) => (
                  <div className="match-card-detailed glass-panel" key={traveler._id}>
                    <div className="match-avatar">
                      {traveler.avatar && traveler.avatar.startsWith("data:") ? (
                        <img src={traveler.avatar} alt={traveler.name} />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                    <div className="match-body">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h4>{traveler.name}</h4>
                        <span className="badge badge-indigo" style={{ fontSize: "0.75rem", padding: "2px 6px" }}>{traveler.score}% Match</span>
                      </div>
                      <div className="match-tags">
                        <span className="badge badge-indigo">📍 {traveler.destination || "Anywhere"}</span>
                        <span className="badge badge-emerald">💰 {traveler.budget || "Medium"}</span>
                        <span className="badge badge-purple">🎒 {traveler.travelStyle || "Flexible"}</span>
                      </div>
                    </div>
                    {renderConnectButton(traveler)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-matches-box glass-panel">
                <h4>No matching users found for this filter combination.</h4>
                <p>Adjust your preference targets under the "My Preferences" tab.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Preferences Form */}
        {activeTab === "preferences" && (
          <form onSubmit={handleSavePreferences} className="preferences-form glass-panel">
            <h3>Update Your Travel Targets</h3>
            <p className="tab-subtitle">Adjusting these fields will immediately change your recommended match list.</p>

            {alertMsg && (
              <div className={`dashboard-alert-banner ${alertType}`}>
                <svg className="dashboard-alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{alertMsg}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">📍 Dream Destination</label>
                <input
                  type="text"
                  className="form-input"
                  value={prefDest}
                  onChange={(e) => setPrefDest(e.target.value)}
                  placeholder="e.g. Goa, Bali, Paris"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">💰 Budget Size</label>
                <select className="form-input" value={prefBudget} onChange={(e) => setPrefBudget(e.target.value)} required>
                  <option value="">Select Budget</option>
                  <option value="Low">Low Budget (Backpacking)</option>
                  <option value="Medium">Medium Budget (Standard)</option>
                  <option value="High">High Budget (Premium)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">🎒 Adventure Style</label>
                <select className="form-input" value={prefStyle} onChange={(e) => setPrefStyle(e.target.value)} required>
                  <option value="">Select Vibe</option>
                  <option value="Adventure">Adventure & Hiking</option>
                  <option value="Backpacking">Culture & Backpacking</option>
                  <option value="Luxury">Luxury & Leisure</option>
                  <option value="Family">Family Trips</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-secondary save-pref-btn">
              Apply Preferences
            </button>
          </form>
        )}

        {/* Tab 3: Trip Planner */}
        {activeTab === "itinerary" && (
          <div className="itinerary-builder glass-panel">
            <h3>Interactive Trip Planner</h3>
            <p className="tab-subtitle">Keep track of flight bookings, check-ins, and pack checklists.</p>

            {/* Visual Checklist Progress Bar */}
            <div className="planner-progress-container">
              <div className="planner-progress-header">
                <span>Trip Preparation Progress</span>
                <span>{checklistCompletionPercent}% Complete ({doneTasksCount} of {itinerary.length} items)</span>
              </div>
              <div className="planner-progress-bar-bg">
                <div 
                  className="planner-progress-fill" 
                  style={{ width: `${checklistCompletionPercent}%` }} 
                />
              </div>
            </div>

            <form onSubmit={addItineraryItem} className="itinerary-form">
              <input
                type="text"
                className="form-input"
                placeholder="Add checklist item (e.g. Apply for visa, pack solar bank)..."
                value={newItineraryItem}
                onChange={(e) => setNewItineraryItem(e.target.value)}
                required
              />
              <select
                className="form-input"
                value={newItineraryCategory}
                onChange={(e) => setNewItineraryCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="flights">Flights</option>
                <option value="booking">Booking</option>
                <option value="packing">Packing</option>
              </select>
              <button type="submit" className="btn btn-primary">Add Item</button>
            </form>

            <div className="itinerary-list">
              {itinerary.length > 0 ? (
                itinerary.map(item => (
                  <div className={`itinerary-item ${item.done ? "done" : ""}`} key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleItineraryItem(item.id)}
                    />
                    <span>{item.text}</span>
                    
                    {/* Category badge */}
                    {item.category && (
                      <span className={`category-pill ${item.category}`}>
                        {item.category}
                      </span>
                    )}

                    <button className="delete-item-btn" onClick={() => deleteItineraryItem(item.id)}>
                      🗑
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-items-msg">No items in your checklist. Add one above to get started!</p>
              )}
            </div>
          </div>
        )}

      </div>

      <AestheticConsole />
    </div>
  );
}

export default Dashboard;
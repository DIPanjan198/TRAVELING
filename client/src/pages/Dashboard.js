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
    { id: 1, text: "Book flight tickets ✈️", done: true, category: "flights" },
    { id: 2, text: "Check hotel bookings & ratings 🏨", done: false, category: "booking" },
    { id: 3, text: "Pack hiking boots & rain jackets 🎒", done: false, category: "packing" },
    { id: 4, text: "Convert currency & activate travel card 💱", done: false, category: "general" }
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
            { _id: "1", name: "Rahul Sharma", destination: userData.destination || "Goa", travelStyle: "Adventure", budget: "Medium", score: 98 },
            { _id: "4", name: "Sara Jenkins", destination: userData.destination || "Goa", travelStyle: "Adventure", budget: "Medium", score: 95 },
            { _id: "5", name: "Michael Chen", destination: userData.destination || "Goa", travelStyle: "Backpacking", budget: "Medium", score: 88 },
            { _id: "6", name: "Chloe Bennett", destination: userData.destination || "Goa", travelStyle: "Luxury", budget: "High", score: 82 }
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
                score += 23;
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
          { _id: "10", name: "Alex Rover", destination: userData.destination || "Bali", travelStyle: userData.travelStyle || "Adventure", budget: userData.budget || "Medium", score: 92 }
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
          setAlertMsg("Preferences updated! Matches refreshed. ✨");
        } else {
          setAlertType("error");
          setAlertMsg("Failed to save preference settings. Try again.");
        }
      } catch (err) {
        console.error("Database sync error:", err);
        setAlertType("error");
        setAlertMsg("Connection issue. Local preferences updated.");
      }
    } else {
      setAlertType("success");
      setAlertMsg("Preferences updated successfully! ✨");
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
        <button className="genz-btn genz-btn-primary" onClick={() => handleConnectRequest(traveler._id)}>
          Connect ⚡
        </button>
      );
    }

    if (connState.status === "pending") {
      if (connState.isSender) {
        return (
          <button className="genz-btn genz-btn-disabled" disabled>
            Sent ⏳
          </button>
        );
      } else {
        return (
          <span className="genz-badge genz-badge-purple">
            🔔 Request Pending
          </span>
        );
      }
    }

    return (
      <button className="genz-btn genz-btn-emerald" onClick={() => navigate(`/chat/${traveler._id}`)}>
        Chat & Plan 💬
      </button>
    );
  };

  // Dynamic statistics calculations
  const calculateProfileStrength = () => {
    let score = 40;
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

  const quickTools = [
    { title: "Expense Splitter", icon: "💸", desc: "Split costs & bills", path: "/expense-splitter", color: "emerald" },
    { title: "Weather Check", icon: "☀️", desc: "Live forecast vibe", path: "/weather-check", color: "yellow" },
    { title: "Currency Swap", icon: "💱", desc: "Live exchange rate", path: "/currency-converter", color: "indigo" },
    { title: "AI Trip Planner", icon: "🤖", desc: "Generate custom itinerary", path: "/ai-trip-planner", color: "purple" },
    { title: "Packing List", icon: "🎒", desc: "Smart gear checklist", path: "/packing-list", color: "rose" },
    { title: "Travel Journal", icon: "📖", desc: "Capture trip memories", path: "/travel-journal", color: "cyan" }
  ];

  return (
    <div className="genz-dashboard-container">
      {/* Gen-Z Profile Vibe Hero Card */}
      <section className="genz-hero-card">
        <div className="genz-hero-header">
          <label className="genz-avatar-wrapper" title="Click to upload profile photo">
            {userData?.avatar && userData.avatar.startsWith("data:") ? (
              <img src={userData.avatar} alt="Profile Avatar" className="genz-avatar-img" />
            ) : (
              <div className="genz-avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            <div className="genz-avatar-edit-overlay">📷</div>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>

          <div className="genz-hero-info">
            <div className="genz-hero-title-row">
              <h2>Hey, {userData?.name || "Explorer"}! 👋</h2>
              <span className="genz-status-badge">🟢 Online & Ready</span>
            </div>
            <p className="genz-hero-subtitle">Targeting <strong>{userData.destination || "Anywhere"}</strong> with a <strong>{userData.budget || "Flexible"}</strong> budget and <strong>{userData.travelStyle || "Adventure"}</strong> vibe.</p>
            <div className="genz-tags-row">
              <span className="genz-tag tag-indigo">📍 {userData.destination || "Goa"}</span>
              <span className="genz-tag tag-emerald">💰 {userData.budget || "Medium"}</span>
              <span className="genz-tag tag-purple">🎒 {userData.travelStyle || "Adventure"}</span>
            </div>
          </div>

          <div className="genz-hero-actions">
            <button className="genz-btn genz-btn-glass" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Vibe Stats Grid */}
      <ScrollReveal className="genz-stats-grid">
        <TiltCard maxTilt={6}>
          <div className="genz-stat-card">
            <div className="genz-stat-icon icon-indigo">⚡</div>
            <div className="genz-stat-info">
              <span className="genz-stat-label">Profile Strength</span>
              <span className="genz-stat-val">{profileStrength}%</span>
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="genz-stat-card">
            <div className="genz-stat-icon icon-emerald">🔥</div>
            <div className="genz-stat-info">
              <span className="genz-stat-label">Vibe Matches</span>
              <span className="genz-stat-val">{travelers.length}</span>
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="genz-stat-card">
            <div className="genz-stat-icon icon-purple">💬</div>
            <div className="genz-stat-info">
              <span className="genz-stat-label">Active Buddies</span>
              <span className="genz-stat-val">{acceptedBuddiesCount}</span>
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="genz-stat-card">
            <div className="genz-stat-icon icon-rose">📝</div>
            <div className="genz-stat-info">
              <span className="genz-stat-label">Hype Checklist</span>
              <span className="genz-stat-val">{doneTasksCount}/{itinerary.length}</span>
            </div>
          </div>
        </TiltCard>
      </ScrollReveal>

      {/* Gen-Z Bento Grid Layout */}
      <div className="genz-bento-layout">
        {/* Left Column: Matches & Checklist */}
        <div className="genz-bento-main">
          
          {/* Tab Selection */}
          <div className="genz-tabs-bar">
            <button
              className={`genz-tab-btn ${activeTab === "matches" ? "active" : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              🔥 Top Vibe Matches ({travelers.length})
            </button>
            <button
              className={`genz-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
              onClick={() => setActiveTab("itinerary")}
            >
              ✨ Trip Hype Checklist ({doneTasksCount}/{itinerary.length})
            </button>
            <button
              className={`genz-tab-btn ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              🎯 Update Vibe Targets
            </button>
          </div>

          {/* Incoming Connection Requests Banner */}
          {(() => {
            const incomingRequests = connections.filter(c => c.receiver?._id === userData?._id && c.status === "pending");
            if (incomingRequests.length === 0) return null;
            return (
              <div className="genz-card genz-requests-card">
                <div className="genz-card-header">
                  <h4>🔔 Connection Requests ({incomingRequests.length})</h4>
                </div>
                <div className="genz-requests-list">
                  {incomingRequests.map((req) => (
                    <div key={req._id} className="genz-request-item">
                      <div className="genz-request-user">
                        <div className="genz-req-avatar">
                          {req.sender?.avatar && req.sender.avatar.startsWith("data:") ? (
                            <img src={req.sender.avatar} alt={req.sender.name} />
                          ) : (
                            <div className="genz-avatar-placeholder-sm">👤</div>
                          )}
                        </div>
                        <div>
                          <strong>{req.sender?.name || "Explorer"}</strong>
                          <p>Matching for {req.sender?.destination || "Trip"}</p>
                        </div>
                      </div>
                      <div className="genz-request-actions">
                        <button className="genz-btn genz-btn-emerald" onClick={() => handleAcceptConnection(req._id)}>
                          Accept
                        </button>
                        <button className="genz-btn genz-btn-rose" onClick={() => handleDeclineConnection(req._id)}>
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* TAB 1: MATCHES */}
          {activeTab === "matches" && (
            <div className="genz-card">
              <div className="genz-card-header">
                <div>
                  <h3>Recommended Travel Buddies</h3>
                  <p className="genz-card-subtitle">Matched based on your target location ({userData.destination}) and travel vibe.</p>
                </div>
              </div>

              {loading ? (
                <div className="genz-loader-box">
                  <div className="genz-spinner"></div>
                  <p>Finding your travel matches...</p>
                </div>
              ) : travelers.length > 0 ? (
                <div className="genz-matches-grid">
                  {travelers.map((traveler) => (
                    <div className="genz-match-card" key={traveler._id}>
                      <div className="genz-match-top">
                        <div className="genz-match-avatar">
                          {traveler.avatar && traveler.avatar.startsWith("data:") ? (
                            <img src={traveler.avatar} alt={traveler.name} />
                          ) : (
                            <div className="genz-avatar-placeholder-md">👤</div>
                          )}
                        </div>
                        <div className="genz-match-meta">
                          <h4>{traveler.name}</h4>
                          <span className="genz-score-badge">⚡ {traveler.score}% Vibe Match</span>
                        </div>
                      </div>

                      <div className="genz-match-tags">
                        <span className="genz-pill pill-indigo">📍 {traveler.destination || "Anywhere"}</span>
                        <span className="genz-pill pill-emerald">💰 {traveler.budget || "Medium"}</span>
                        <span className="genz-pill pill-purple">🎒 {traveler.travelStyle || "Flexible"}</span>
                      </div>

                      <div className="genz-match-footer">
                        {renderConnectButton(traveler)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="genz-empty-state">
                  <span className="empty-icon">🌍</span>
                  <h4>No matching travelers found yet.</h4>
                  <p>Try adjusting your destination or travel vibe under 'Update Vibe Targets'.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRIP CHECKLIST */}
          {activeTab === "itinerary" && (
            <div className="genz-card">
              <div className="genz-card-header">
                <div>
                  <h3>Trip Preparation Checklist</h3>
                  <p className="genz-card-subtitle">Keep track of flights, stays, gear, and travel documents.</p>
                </div>
              </div>

              {/* Progress gauge */}
              <div className="genz-progress-box">
                <div className="genz-progress-text">
                  <span>Task Completion</span>
                  <span><strong>{checklistCompletionPercent}%</strong> ({doneTasksCount} of {itinerary.length} items)</span>
                </div>
                <div className="genz-progress-track">
                  <div className="genz-progress-bar" style={{ width: `${checklistCompletionPercent}%` }}></div>
                </div>
              </div>

              {/* Add Task Form */}
              <form onSubmit={addItineraryItem} className="genz-add-task-form">
                <input
                  type="text"
                  className="genz-input"
                  placeholder="Add a task (e.g. Book flights, pack solar powerbank)..."
                  value={newItineraryItem}
                  onChange={(e) => setNewItineraryItem(e.target.value)}
                  required
                />
                <select
                  className="genz-select"
                  value={newItineraryCategory}
                  onChange={(e) => setNewItineraryCategory(e.target.value)}
                >
                  <option value="general">🛂 General</option>
                  <option value="flights">✈️ Flights</option>
                  <option value="booking">🏨 Booking</option>
                  <option value="packing">🎒 Packing</option>
                </select>
                <button type="submit" className="genz-btn genz-btn-primary">Add Task</button>
              </form>

              {/* Tasks List */}
              <div className="genz-checklist">
                {itinerary.map((item) => (
                  <div key={item.id} className={`genz-task-item ${item.done ? "done" : ""}`}>
                    <label className="genz-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleItineraryItem(item.id)}
                      />
                      <span className="genz-checkmark"></span>
                    </label>

                    <span className="genz-task-text">{item.text}</span>

                    <span className={`genz-category-tag cat-${item.category || "general"}`}>
                      {item.category || "general"}
                    </span>

                    <button
                      className="genz-task-delete"
                      onClick={() => deleteItineraryItem(item.id)}
                      title="Delete task"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES FORM */}
          {activeTab === "preferences" && (
            <div className="genz-card">
              <div className="genz-card-header">
                <div>
                  <h3>Update Your Travel Targets</h3>
                  <p className="genz-card-subtitle">Adjust your destination or budget to instantly refresh matching buddies.</p>
                </div>
              </div>

              {alertMsg && (
                <div className={`genz-alert-banner ${alertType}`}>
                  <span>{alertMsg}</span>
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="genz-pref-form">
                <div className="genz-form-group">
                  <label className="genz-label">📍 Target Destination</label>
                  <input
                    type="text"
                    className="genz-input"
                    value={prefDest}
                    onChange={(e) => setPrefDest(e.target.value)}
                    placeholder="e.g. Goa, Bali, Paris"
                    required
                  />
                </div>

                <div className="genz-form-group">
                  <label className="genz-label">💰 Budget Range</label>
                  <select
                    className="genz-select"
                    value={prefBudget}
                    onChange={(e) => setPrefBudget(e.target.value)}
                    required
                  >
                    <option value="">Select Budget</option>
                    <option value="Low">Low Budget (Backpacking)</option>
                    <option value="Medium">Medium Budget (Standard)</option>
                    <option value="High">High Budget (Premium)</option>
                  </select>
                </div>

                <div className="genz-form-group">
                  <label className="genz-label">🎒 Adventure Style</label>
                  <select
                    className="genz-select"
                    value={prefStyle}
                    onChange={(e) => setPrefStyle(e.target.value)}
                    required
                  >
                    <option value="">Select Vibe</option>
                    <option value="Adventure">Adventure & Hiking</option>
                    <option value="Backpacking">Culture & Backpacking</option>
                    <option value="Luxury">Luxury & Leisure</option>
                    <option value="Family">Family Trips</option>
                  </select>
                </div>

                <button type="submit" className="genz-btn genz-btn-primary genz-btn-full">
                  Save & Refresh Matches ✨
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right Sidebar: Quick Tools Widget */}
        <div className="genz-bento-sidebar">
          <div className="genz-card">
            <div className="genz-card-header">
              <h3>Quick Travel Tools 🛠️</h3>
            </div>
            <div className="genz-tools-grid">
              {quickTools.map((tool, idx) => (
                <div
                  key={idx}
                  className={`genz-tool-item tool-${tool.color}`}
                  onClick={() => navigate(tool.path)}
                >
                  <span className="genz-tool-icon">{tool.icon}</span>
                  <h4>{tool.title}</h4>
                  <p>{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <AestheticConsole />
    </div>
  );
}

export default Dashboard;
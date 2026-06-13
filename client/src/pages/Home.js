import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";
import "./Home.css";

/* Animated counter hook */
function useCounter(target, duration = 2000, triggered = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, triggered]);
  return count;
}

/* Stat Card */
function StatCard({ value, suffix, label, triggered }) {
  const count = useCounter(value, 2000, triggered);
  return (
    <div className="stat-card glass-panel">
      <h2>{count.toLocaleString()}{suffix}</h2>
      <p>{label}</p>
    </div>
  );
}



function Home() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Scroll Progress and States
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Premium Theme and Customizer States
  const [theme, setTheme] = useState(() => localStorage.getItem("aero-theme") || "default");
  const [gridEnabled, setGridEnabled] = useState(() => {
    const saved = localStorage.getItem("aero-grid-enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [themeConsoleOpen, setThemeConsoleOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Apply theme to document element
  useEffect(() => {
    if (theme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("aero-theme", theme);
  }, [theme]);

  // Apply grid toggle to document element
  useEffect(() => {
    document.documentElement.style.setProperty("--grid-opacity", gridEnabled ? "1" : "0");
    localStorage.setItem("aero-grid-enabled", String(gridEnabled));
  }, [gridEnabled]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.1 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Set Scroll Listener for progress indicator and parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setShowScrollTop(scrollY > 300);

      // Set CSS variables for ultra-smooth rendering without React rendering overhead
      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Setup intersection observer for scroll reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.08 }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);


  const handleFindBuddy = async () => {
    if (!destination || !budget || !travelStyle) {
      alert("Please choose a destination, budget, and travel style!");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/api/match-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, budget, travelStyle }),
      });
      const data = await res.json();
      setMatchedUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const coreFeatures = [
    {
      icon: "🌍",
      title: "Destination Matches",
      desc: "Instantly coordinate with travelers heading to the exact locations you are interested in. Compare dates, sights, and bookings."
    },
    {
      icon: "🎒",
      title: "Preference Matching",
      desc: "Match based on custom budgets and travel style tags like Adventure, Backpacking, Luxury, or Family style."
    },
    {
      icon: "💰",
      title: "Cost Splitting",
      desc: "Connect with others to share expenses on accommodation, taxi rentals, local tour guides, and meals."
    },
    {
      icon: "🤝",
      title: "Verified Directory",
      desc: "Review profiles with complete identity checks, social validations, and trust reviews for worry-free travel plans."
    },
    {
      icon: "💬",
      title: "Interactive Chat Rooms",
      desc: "Discuss flight plans and detail daily checklists in live chat rooms before booking packages or flights."
    },
    {
      icon: "🗺️",
      title: "Curated Escapes Feed",
      desc: "Browse our hand-picked selections of top trending cities, pristine beaches, and alpine mountain getaways."
    }
  ];

  return (
    <div className="home-container">
      {/* Scroll Progress Bar at the top of the screen */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />





      {/* Hero Section */}
      <header className="hero scroll-reveal">
        <div className="hero-content">
          <span className="badge badge-indigo animate-pulse">🌍 Find Your Ultimate Travel Partner</span>
          <h1>
            Your Next Adventure<br />
            Is Better <span className="gradient-text">Together</span>
          </h1>
          <p className="hero-desc">
            Connect with verified global travelers matching your exact destination, budget, and adventure style. Split costs, share experiences, and stay safe.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              Create Free Account
            </button>
            <button className="btn btn-glass" onClick={() => navigate("/explore")}>
              Explore Destinations
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-container scroll-reveal" ref={statsRef}>
        <StatCard value={500} suffix="+" label="Verified Members" triggered={statsVisible} />
        <StatCard value={45} suffix="+" label="Destinations Covered" triggered={statsVisible} />
        <StatCard value={48} suffix="+" label="Trips Completed" triggered={statsVisible} />
        <StatCard value={100} suffix="%" label="Safety Score" triggered={statsVisible} />
      </section>

      {/* Matching Form Section */}
      <section className="matcher-section scroll-reveal">
        <div className="matcher-card glass-panel">
          <h2>Quick Match Wizard</h2>
          <p className="matcher-subtitle">Input your preferences to search the real-time traveler database</p>

          <div className="matcher-inputs">
            <div className="form-group">
              <label className="form-label">📍 Destination</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Goa, Bali, Paris"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">💰 Budget Range</label>
              <select className="form-input" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="">Choose Budget</option>
                <option value="Low">Low Budget (Backpacking)</option>
                <option value="Medium">Medium Budget (Standard)</option>
                <option value="High">High Budget (Premium)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">🎒 Travel Vibe</label>
              <select className="form-input" value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)}>
                <option value="">Choose Vibe</option>
                <option value="Adventure">Adventure & Hiking</option>
                <option value="Backpacking">Culture & Sightseeing</option>
                <option value="Luxury">Relaxing & Beach</option>
                <option value="Family">Food & Nightlife</option>
              </select>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={handleFindBuddy} disabled={searching}>
            {searching ? "Searching database..." : "Find My Match ✨"}
          </button>
        </div>
      </section>

      {/* Live Matches Grid */}
      <section className="matches-results scroll-reveal">
        {matchedUsers.length > 0 ? (
          <div className="results-wrapper">
            <h3>Matched Buddies Found</h3>
            <div className="results-grid">
              {matchedUsers.map((user) => (
                <div className="user-match-card glass-panel" key={user._id}>
                  <div className="user-match-header">
                    <div className="user-match-avatar">
                      {user.avatar && user.avatar.startsWith("data:") ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4>{user.name}</h4>
                      <p>Prefers {user.travelStyle}</p>
                    </div>
                  </div>
                  <div className="user-match-body">
                    <p>📍 {user.destination}</p>
                    <p>💰 {user.budget} Budget</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const loggedIn = localStorage.getItem("isLoggedIn");
                      if (!loggedIn) {
                        navigate("/register");
                      } else {
                        navigate(`/chat/${user._id}`);
                      }
                    }}
                  >
                    Send Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          destination && !searching && (
            <p className="no-results-msg">No current travelers found matching that exact filter combination. Try another search!</p>
          )
        )}
      </section>

      {/* Rebuilt Features Grid */}
      <section className="features-grid-section scroll-reveal">
        <div className="features-header">
          <span className="badge badge-emerald">Key Features</span>
          <h2>Platform Capabilities</h2>
          <p>Everything you need to find, connect, and travel with verified people safely.</p>
        </div>

        <div className="features-container">
          {coreFeatures.map((f, i) => (
            <div className="feature-card glass-panel" key={i}>
              <div className="feature-icon-wrapper">
                <span style={{ fontSize: "1.5rem" }}>{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rebuilt About Section */}
      <section className="about-section-integrated scroll-reveal">
        <div className="about-header">
          <span className="badge badge-indigo">About AeroTravel</span>
          <h2>Redefining Group Adventures</h2>
        </div>

        <div className="about-grid-integrated">
          <div className="about-col-left glass-panel">
            <h3>Our Core Values</h3>
            <div className="value-item">
              <h4>🚀 Safety Protocols First</h4>
              <p>Every profile undergoes strict validation check rules to verify identity before coordinating trips.</p>
            </div>
            <div className="value-item">
              <h4>💰 Cost Democratization</h4>
              <p>Splitting transport, rooms, and guides saves up to 50% on travel expenses.</p>
            </div>
          </div>

          <div className="about-col-right glass-panel">
            <h3>The Aero Concept</h3>
            <p>
              We believe adventure should never be halted by the lack of companions. AeroTravel creates a dynamic community where you can find buddies matching your exact financial targets, location plans, and vacation tempos.
            </p>
            <p>
              Whether you are checking out remote mountain trails, surfing beaches, exploring historic cities, or taking relaxing retreats, we simplify coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="team-section scroll-reveal">
        <div className="team-header">
          <span className="badge badge-emerald">The Creators</span>
          <h2>Meet Our Team</h2>
          <p>The visionaries behind AeroTravel</p>
        </div>

        <div className="team-grid">
          {[
            "Dipanjan Choudhuri",
            "Shuvodip Hazra",
            "Avijit Mandal",
            "Rajat Kantal",
            "Dibyendu Chowdhury"
          ].map((name, idx) => (
            <div className="team-member-card glass-panel" key={idx}>
              <div className="team-member-avatar">
                <span className="team-initials">{name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <h3 className="team-member-name">{name}</h3>
              <p className="team-member-role">Developer</p>
              <div className="team-socials">
                <div className="social-circle"></div>
                <div className="social-circle"></div>
                <div className="social-circle"></div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Floating Scroll-to-Top Gauge */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <svg className="scroll-progress-ring" width="48" height="48">
            <circle
              className="scroll-progress-ring-bg"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
            />
            <circle
              className="scroll-progress-ring-fill"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 - (scrollProgress / 100) * (2 * Math.PI * 20)}`}
              strokeLinecap="round"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
            />
          </svg>
          <span className="scroll-arrow">↑</span>
        </button>
      )}

      {/* Floating Theme Customizer Console */}
      <div className={`theme-console-wrapper ${themeConsoleOpen ? "open" : ""}`}>
        <button 
          className="theme-console-trigger-btn"
          onClick={() => setThemeConsoleOpen(!themeConsoleOpen)}
          title="Customize Aesthetics"
          aria-label="Customize aesthetics"
        >
          <span className="trigger-icon">🎛️</span>
          <span className="trigger-text">Aesthetics</span>
        </button>

        <div className="theme-console-panel glass-panel">
          <div className="console-header">
            <h4>AeroTravel Console</h4>
            <button className="console-close-btn" onClick={() => setThemeConsoleOpen(false)}>&times;</button>
          </div>
          
          <div className="console-body">
            <div className="console-section">
              <span className="console-section-title">Color Theme</span>
              <div className="theme-options-grid">
                <button 
                  className={`theme-opt-btn ${theme === "default" ? "active" : ""}`}
                  onClick={() => setTheme("default")}
                >
                  <div className="theme-opt-preview default-preview">
                    <span className="dot-p"></span><span className="dot-s"></span>
                  </div>
                  <span>Cyberpunk</span>
                </button>
                <button 
                  className={`theme-opt-btn ${theme === "volcano" ? "active" : ""}`}
                  onClick={() => setTheme("volcano")}
                >
                  <div className="theme-opt-preview volcano-preview">
                    <span className="dot-p"></span><span className="dot-s"></span>
                  </div>
                  <span>Volcano</span>
                </button>
                <button 
                  className={`theme-opt-btn ${theme === "emerald" ? "active" : ""}`}
                  onClick={() => setTheme("emerald")}
                >
                  <div className="theme-opt-preview emerald-preview">
                    <span className="dot-p"></span><span className="dot-s"></span>
                  </div>
                  <span>Emerald</span>
                </button>
                <button 
                  className={`theme-opt-btn ${theme === "cosmic" ? "active" : ""}`}
                  onClick={() => setTheme("cosmic")}
                >
                  <div className="theme-opt-preview cosmic-preview">
                    <span className="dot-p"></span><span className="dot-s"></span>
                  </div>
                  <span>Cosmic</span>
                </button>
              </div>
            </div>

            <div className="console-section console-toggle-row">
              <div>
                <span className="console-section-title" style={{ marginBottom: 0 }}>Cyber-Grid Overlay</span>
                <p className="console-section-desc">Toggle background tech grid</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={gridEnabled} 
                  onChange={(e) => setGridEnabled(e.target.checked)} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
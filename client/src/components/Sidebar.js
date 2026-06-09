import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Dynamically select menu links based on login state
  const navLinks = isLoggedIn ? [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"/>
          <rect x="14" y="3" width="7" height="5"/>
          <rect x="14" y="12" width="7" height="9"/>
          <rect x="3" y="16" width="7" height="5"/>
        </svg>
      )
    },
    {
      to: "/budget-estimator",
      label: "Budget Planner",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      )
    },
    {
      to: "/matching",
      label: "AI Matcher",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17 11 19 13 23 9"/>
        </svg>
      )
    },
    {
      to: "/chat/1",
      label: "Conversations",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    }
  ] : [
    {
      to: "/",
      label: "Home Hub",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      to: "/budget-estimator",
      label: "Budget Planner",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <span className="logo-text">AeroTravel.</span>
        <button className="menu-toggle-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? <line x1="18" y1="6" x2="6" y2="18"/> : <line x1="3" y1="12" x2="21" y2="12"/>}
            {mobileOpen ? <line x1="6" y1="6" x2="18" y2="18"/> : <line x1="3" y1="6" x2="21" y2="6"/>}
            {!mobileOpen && <line x1="3" y1="18" x2="21" y2="18"/>}
          </svg>
        </button>
      </div>

      {/* Main Sidebar Container */}
      <aside className={`sidebar-container glass-panel ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.6.1-2 .5-.3.3-.4.8-.2 1.3l5 3.5-3.5 3.5-3-1-1.5 1.5 4 1 1 4 1.5-1.5-1-3 3.5-3.5 3.5 5c.5.2 1 .1 1.3-.2.4-.4.7-1.1.5-2z"/>
            </svg>
          </div>
          <span className="logo-text">AeroTravel<span className="logo-dot">.</span></span>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <span className="section-title">{isLoggedIn ? "Workspace" : "Directory"}</span>
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item.to) ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* New Features Showcase Widget */}
        <div className="features-showcase-card glass-panel">
          <div className="card-badge">HIGHLIGHTS</div>
          <h4>New Aero Features</h4>
          <div className="feature-announcement-list">
            <div className="announcement-item">
              <span className="item-icon">🧠</span>
              <div>
                <h5>AI Trip Planner</h5>
                <p>Generate smart travel checklists instantly.</p>
              </div>
            </div>
            <div className="announcement-item">
              <span className="item-icon">💸</span>
              <div>
                <h5>Expense Splitter</h5>
                <p>Share travel budget costs cleanly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Profile Details / Login Button */}
        <div className="sidebar-footer">
          {isLoggedIn ? (
            <div className="profile-chip">
              <div className="profile-chip-avatar">
                {userData.avatar && userData.avatar.startsWith("data:") ? (
                  <img src={userData.avatar} alt="Avatar" />
                ) : (
                  <div className="sidebar-avatar-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="profile-chip-info">
                <h4>{userData.name || "Explorer"}</h4>
                <p>{userData.destination || "Roaming"}</p>
              </div>
              <button className="logout-btn-icon" onClick={handleLogout} title="Log Out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <button className="btn btn-primary login-nav-btn" onClick={() => { setMobileOpen(false); navigate("/login"); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Sign In
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

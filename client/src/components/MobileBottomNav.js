import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileBottomNav.css";

function MobileBottomNav({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const myUserId = userData._id || null;

  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      const senders = JSON.parse(localStorage.getItem("unreadSenders") || "[]");
      return senders.length;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const senders = JSON.parse(localStorage.getItem("unreadSenders") || "[]");
        setUnreadCount(senders.length);
      } catch {
        setUnreadCount(0);
      }
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    if (path.startsWith("/chat")) {
      return location.pathname.startsWith("/chat");
    }
    return location.pathname === path;
  };

  const primaryTo = isLoggedIn ? "/dashboard" : "/";
  const chatTo = `/chat/${myUserId || "start"}`;

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-container">
        {/* Home / Dashboard */}
        <Link
          to={primaryTo}
          className={`mobile-nav-item ${isActive(primaryTo) ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="nav-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="nav-label">{isLoggedIn ? "Dashboard" : "Home"}</span>
        </Link>

        {/* AI Matcher */}
        <Link
          to={isLoggedIn ? "/matching" : "/find-buddies"}
          className={`mobile-nav-item ${isActive("/matching") || isActive("/find-buddies") ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="nav-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <polyline points="17 11 19 13 23 9"/>
            </svg>
          </div>
          <span className="nav-label">AI Match</span>
        </Link>

        {/* AI Planner */}
        <Link
          to={isLoggedIn ? "/ai-trip-planner" : "/features"}
          className={`mobile-nav-item ${isActive("/ai-trip-planner") || isActive("/features") ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="nav-icon-wrapper highlight-nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M18 2l4 4-4 4"/><path d="M22 2l-4 4"/>
            </svg>
          </div>
          <span className="nav-label">AI Planner</span>
        </Link>

        {/* Chat / Conversations */}
        <Link
          to={chatTo}
          className={`mobile-nav-item ${isActive(chatTo) ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="nav-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {unreadCount > 0 && (
              <span className="mobile-unread-badge">{unreadCount}</span>
            )}
          </div>
          <span className="nav-label">Chat</span>
        </Link>

        {/* Toggle Menu Drawer */}
        <button
          className={`mobile-nav-item ${sidebarOpen ? "active" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          type="button"
          aria-label="Toggle navigation menu"
        >
          <div className="nav-icon-wrapper">
            {sidebarOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </div>
          <span className="nav-label">Menu</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomNav;

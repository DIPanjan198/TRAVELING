import React, { useState, useEffect } from "react";
import "./AestheticConsole.css";

function AestheticConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("aero-theme") || "indigo";
  });
  const [gridEnabled, setGridEnabled] = useState(() => {
    const saved = localStorage.getItem("aero-grid-enabled");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    if (theme === "default" || theme === "indigo") {
      document.documentElement.setAttribute("data-theme", "indigo");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("aero-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--grid-opacity", gridEnabled ? "1" : "0");
    localStorage.setItem("aero-grid-enabled", String(gridEnabled));
  }, [gridEnabled]);

  return (
    <div className="aesthetic-console-wrapper">
      <button
        className="console-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Aesthetics"
        aria-label="Customize aesthetics"
      >
        <span className="trigger-icon">🎨</span>
        <span className="trigger-text">Aesthetics</span>
      </button>

      {isOpen && (
        <div className="console-panel">
          <div className="console-header">
            <h4>AeroTravel Console</h4>
            <button className="console-close-btn" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          <div className="console-body">
            <div className="console-section">
              <span className="console-section-title">Color Theme</span>
              <div className="theme-options-grid">
                <button
                  className={`theme-opt-btn ${theme === "indigo" || theme === "default" ? "active" : ""}`}
                  onClick={() => setTheme("indigo")}
                >
                  <div className="theme-opt-preview indigo-preview">
                    <span className="dot-p"></span>
                    <span className="dot-s"></span>
                  </div>
                  <span>Indigo</span>
                </button>

                <button
                  className={`theme-opt-btn ${theme === "volcano" ? "active" : ""}`}
                  onClick={() => setTheme("volcano")}
                >
                  <div className="theme-opt-preview volcano-preview">
                    <span className="dot-p"></span>
                    <span className="dot-s"></span>
                  </div>
                  <span>Volcano</span>
                </button>

                <button
                  className={`theme-opt-btn ${theme === "emerald" ? "active" : ""}`}
                  onClick={() => setTheme("emerald")}
                >
                  <div className="theme-opt-preview emerald-preview">
                    <span className="dot-p"></span>
                    <span className="dot-s"></span>
                  </div>
                  <span>Emerald</span>
                </button>

                <button
                  className={`theme-opt-btn ${theme === "cosmic" ? "active" : ""}`}
                  onClick={() => setTheme("cosmic")}
                >
                  <div className="theme-opt-preview cosmic-preview">
                    <span className="dot-p"></span>
                    <span className="dot-s"></span>
                  </div>
                  <span>Cosmic</span>
                </button>
              </div>
            </div>

            <div className="console-section console-toggle-row">
              <div>
                <span className="console-section-title" style={{ marginBottom: 0 }}>
                  Grid Overlay
                </span>
                <p className="console-section-desc">Toggle tech grid pattern</p>
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
      )}
    </div>
  );
}

export default AestheticConsole;

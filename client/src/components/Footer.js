import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="aero-footer">
      <div className="aero-footer-container">
        
        {/* Top Creator Showcase Card */}
        <div className="creator-card glass-panel fade-up">
          <div className="creator-badge">Creator & Lead Architect</div>
          <div className="creator-content">
            <div className="creator-avatar">
              <span>DC</span>
            </div>
            <div className="creator-details">
              <h3>Dipanjan Choudhuri</h3>
              <p className="creator-title">Full-Stack Engineer & Creator of AeroTravel</p>
              <p className="creator-bio">
                Crafted with passion to help solo explorers and group travelers connect seamlessly, plan trips with AI, split expenses effortlessly, and travel the world together.
              </p>
            </div>
            <div className="creator-links">
              <a href="tel:9064753890" className="creator-link-btn">
                <span>📞 +91 9064753890</span>
              </a>
              <a href="mailto:dipanjanchoudhuri2024@gmail.com" className="creator-link-btn">
                <span>✉️ dipanjanchoudhuri2024@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Directory Columns */}
        <div className="footer-grid">
          
          {/* Column 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="logo-icon">✈️</span>
              <span className="logo-text">AeroTravel</span>
            </div>
            <p className="footer-brand-desc">
              The premier social travel platform connecting adventurers, split-cost partners, and global explorers with AI-powered itinerary intelligence.
            </p>
            <div className="footer-system-status">
              <span className="status-dot"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Smart Travel Tools */}
          <div className="footer-col">
            <h4>Smart Travel Tools</h4>
            <ul>
              <li><Link to="/ai-trip-planner">🤖 AI Trip Planner</Link></li>
              <li><Link to="/trip-cost-estimator">🧮 Trip Cost Estimator</Link></li>
              <li><Link to="/expense-splitter">💸 Expense Splitter</Link></li>
              <li><Link to="/currency-converter">💱 Currency Converter</Link></li>
              <li><Link to="/weather-check">🌤️ Real-Time Weather</Link></li>
              <li><Link to="/packing-list">🎒 Packing List Generator</Link></li>
              <li><Link to="/travel-quiz">🧭 Travel Personality Quiz</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom">
          <p>© 2026 AeroTravel. Designed & Created with ❤️ by <strong>Dipanjan Choudhuri</strong>. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

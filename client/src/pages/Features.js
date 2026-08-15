import { useNavigate } from "react-router-dom";
import TiltCard from "../components/TiltCard";
import ScrollReveal from "../components/ScrollReveal";
import "./Features.css";

const featureCards = [
  {
    icon: "🌍",
    colorClass: "icon-indigo",
    tag: "Core",
    tagClass: "tag-indigo",
    title: "Smart Destination Matching",
    desc: "Our algorithm instantly pairs you with verified travelers heading to the exact same cities, beaches, or mountains — filtered by dates, sights, and booking status."
  },
  {
    icon: "🎒",
    colorClass: "icon-emerald",
    tag: "Personalized",
    tagClass: "tag-emerald",
    title: "Travel Style Alignment",
    desc: "Choose your vibe — Adventure, Backpacking, Luxury, or Family. We match based on your travel personality for a compatible journey together."
  },
  {
    icon: "💰",
    colorClass: "icon-purple",
    tag: "Finance",
    tagClass: "tag-purple",
    title: "Cost Splitting Engine",
    desc: "Split accommodation, taxi rentals, local tour guides, and dining costs with matched travel companions. Save up to 50% on shared expenses."
  },
  {
    icon: "🔐",
    colorClass: "icon-pink",
    tag: "Safety",
    tagClass: "tag-pink",
    title: "Verified Profile Directory",
    desc: "Every profile undergoes strict identity checks, social validations, and community trust reviews — so you travel only with people you can trust."
  },
  {
    icon: "💬",
    colorClass: "icon-amber",
    tag: "Communication",
    tagClass: "tag-amber",
    title: "Real-Time Chat Rooms",
    desc: "Live Socket.IO-powered messaging so you can coordinate flight plans, share itineraries, and stay in sync with your travel buddy from day one."
  },
  {
    icon: "🗺️",
    colorClass: "icon-cyan",
    tag: "Discovery",
    tagClass: "tag-cyan",
    title: "Curated Destination Feed",
    desc: "Hand-picked selections of trending cities, pristine beaches, and alpine getaways. Discover hidden gems and join existing group trips with one click."
  }
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    desc: "Register in under 60 seconds. Set your destination, travel dates, budget range, and adventure vibe to get started."
  },
  {
    num: "02",
    title: "Get Matched Instantly",
    desc: "Our engine scans verified profiles and surfaces the best compatible travel companions for your specific trip parameters."
  },
  {
    num: "03",
    title: "Connect & Plan Together",
    desc: "Send a connection request, jump into the live chat, and start coordinating itineraries, costs, and activities."
  },
  {
    num: "04",
    title: "Travel & Save",
    desc: "Hit the road with your travel buddy. Share costs, cover more experiences, and make memories that last forever."
  }
];

const comparisonRows = [
  { feature: "Destination-Based Matching", solo: false, aero: true },
  { feature: "Real-Time In-App Chat", solo: false, aero: true },
  { feature: "Cost Splitting Calculator", solo: false, aero: true },
  { feature: "Verified Safety Profiles", solo: false, aero: true },
  { feature: "Trip Planner Checklist", solo: false, aero: true },
  { feature: "Budget Estimation Tool", solo: false, aero: true }
];

function Features() {
  const navigate = useNavigate();

  return (
    <div className="features-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      {/* Hero Section */}
      <ScrollReveal className="features-hero">
        <span className="badge badge-indigo hero-badge animate-pulse">
          ✨ Platform Features
        </span>
        <h1>
          Everything You Need to<br />
          <span className="gradient-text">Travel Smarter Together</span>
        </h1>
        <p>
          AeroTravel is built from the ground up for group travel discovery —
          packed with smart matching, real-time communication, and financial tools
          to make every adventure cost-effective and safe.
        </p>
        <div className="features-hero-cta">
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Get Started Free
          </button>
          <button className="btn btn-glass" onClick={() => navigate("/explore")}>
            Explore Destinations
          </button>
        </div>
      </ScrollReveal>

      {/* Core Feature Cards */}
      <ScrollReveal className="features-main-section">
        <div className="features-section-label">
          <span className="badge badge-emerald">Core Capabilities</span>
          <h2>What AeroTravel Offers</h2>
          <p>Six powerful modules that work together to transform how you find, connect, and travel with companions.</p>
        </div>

        <div className="features-cards-grid">
          {featureCards.map((f, i) => (
            <TiltCard key={i} maxTilt={8}>
              <div className="feature-detail-card glass-panel" style={{ height: "100%" }}>
                <div className={`feature-card-icon-wrap ${f.colorClass}`}>
                  <span>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className={`feature-card-tag ${f.tagClass}`}>
                  {f.tag}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </ScrollReveal>

      {/* How It Works */}
      <ScrollReveal className="how-it-works-section">
        <div className="features-section-label">
          <span className="badge badge-purple">Process</span>
          <h2>How It Works</h2>
          <p>From sign-up to trip departure in 4 simple steps.</p>
        </div>

        <div className="steps-timeline">
          {steps.map((step, i) => (
            <TiltCard key={i} maxTilt={6}>
              <div className="step-item glass-panel" style={{ height: "100%" }}>
                <div className="step-number">{step.num}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </ScrollReveal>

      {/* Comparison Table */}
      <ScrollReveal className="comparison-section">
        <div className="features-section-label">
          <span className="badge badge-indigo">Comparison</span>
          <h2>AeroTravel vs. Solo Travel</h2>
          <p>See why traveling with AeroTravel is a smarter, richer experience.</p>
        </div>

        <TiltCard maxTilt={4}>
          <div className="comparison-table-wrapper glass-panel">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Solo Booking</th>
                  <th className="highlight-col">AeroTravel ✈️</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td className="row-label">{row.feature}</td>
                    <td>
                      {row.solo
                        ? <span className="check-icon">✅</span>
                        : <span className="cross-icon">✕</span>}
                    </td>
                    <td className="highlight-col">
                      {row.aero
                        ? <span className="check-icon">✅</span>
                        : <span className="cross-icon">✕</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TiltCard>
      </ScrollReveal>

      {/* CTA Banner */}
      <ScrollReveal className="features-cta-banner-wrapper">
        <div className="features-cta-banner">
          <h2>Ready to Find Your Travel Buddy?</h2>
          <p>
            Join thousands of explorers who have already found their perfect
            companion through AeroTravel. Your next adventure is waiting.
          </p>
          <div className="cta-btn-group">
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              Create Free Account
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/budget-estimator")}>
              Try Budget Estimator
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default Features;

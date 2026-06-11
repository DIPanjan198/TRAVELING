import { useState } from "react";
import "./AiTripPlanner.css";

const CHECKLIST_TEMPLATES = {
  Adventure: [
    "Book flight tickets & confirm layovers",
    "Research trekking permits & park entry fees",
    "Pack waterproof hiking boots and rain gear",
    "Download offline maps (Maps.me / OsmAnd)",
    "Get travel insurance covering adventure sports",
    "Arrange accommodation near trail heads",
    "Pack first-aid kit and emergency whistle",
    "Notify emergency contact of itinerary",
    "Check weather forecast for destination",
    "Exchange currency / load travel card",
  ],
  Backpacking: [
    "Book flexible / refundable hostel beds",
    "Research local transport passes & routes",
    "Pack light — max 30L backpack rule",
    "Scan all documents to cloud storage",
    "Plan a daily spending budget",
    "Research free walking tours & museums",
    "Download offline translation app",
    "Carry a universal power adapter",
    "Book first & last night accommodation",
    "Join traveler communities for tips",
  ],
  Luxury: [
    "Book 5-star hotel or resort well in advance",
    "Reserve restaurant tables & spa treatments",
    "Arrange private airport transfer",
    "Pack formal attire for dinner venues",
    "Set up travel credit card for rewards",
    "Purchase comprehensive travel insurance",
    "Pre-arrange guided city tours",
    "Research dress codes for attractions",
    "Book business / first class flights early",
    "Prepare concierge request list",
  ],
  Family: [
    "Research family-friendly accommodation",
    "Pack snacks and entertainment for kids",
    "Carry all medical records / prescriptions",
    "Book child-friendly activities in advance",
    "Arrange travel insurance for all members",
    "Pack a small first-aid and fever kit",
    "Plan rest-day buffers in the itinerary",
    "Research kid-friendly restaurants",
    "Bring familiar comfort items for children",
    "Save local emergency numbers offline",
  ],
};

const DESTINATIONS = [
  { name: "Goa, India", emoji: "🏖️", tag: "Beach" },
  { name: "Manali, India", emoji: "🏔️", tag: "Mountains" },
  { name: "Bali, Indonesia", emoji: "🌺", tag: "Culture" },
  { name: "Paris, France", emoji: "🗼", tag: "Luxury" },
  { name: "Queenstown, NZ", emoji: "🎿", tag: "Adventure" },
  { name: "Bangkok, Thailand", emoji: "🛕", tag: "Budget" },
];

export default function AiTripPlanner() {
  const [destination, setDestination] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [days, setDays] = useState(7);
  const [checklist, setChecklist] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!destination || !travelStyle) {
      alert("Please enter a destination and travel style!");
      return;
    }
    setLoading(true);
    setChecked({});
    setTimeout(() => {
      const base = CHECKLIST_TEMPLATES[travelStyle] || CHECKLIST_TEMPLATES.Backpacking;
      const extras = [
        `Research top ${days <= 3 ? "3" : days <= 7 ? "5" : "7"} must-see spots in ${destination}`,
        `Plan a day-by-day ${days}-day itinerary for ${destination}`,
        `Check visa requirements for ${destination}`,
      ];
      setChecklist([...extras, ...base]);
      setGenerated(true);
      setLoading(false);
    }, 1200);
  };

  const toggleCheck = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  const progress = checklist.length ? Math.round((Object.values(checked).filter(Boolean).length / checklist.length) * 100) : 0;

  return (
    <div className="atp-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="atp-container">
        {/* Header */}
        <div className="atp-header fade-up">
          <span className="badge badge-indigo">🧠 AI Powered</span>
          <h1>AI Trip Planner</h1>
          <p>Generate a smart, personalised travel checklist for your next adventure in seconds.</p>
        </div>

        {/* Quick Destination Picks */}
        <div className="atp-destinations fade-up fade-up-1">
          <p className="atp-section-label">Popular Destinations</p>
          <div className="atp-dest-grid">
            {DESTINATIONS.map((d) => (
              <button
                key={d.name}
                className={`atp-dest-chip glass-panel ${destination === d.name ? "selected" : ""}`}
                onClick={() => setDestination(d.name)}
              >
                <span className="dest-emoji">{d.emoji}</span>
                <span className="dest-name">{d.name.split(",")[0]}</span>
                <span className="dest-tag">{d.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generator Form */}
        <div className="atp-form glass-panel fade-up fade-up-2">
          <div className="atp-form-grid">
            <div className="form-group">
              <label className="form-label">📍 Destination</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Goa, Bali, Paris..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">🎒 Travel Style</label>
              <select className="form-input" value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)}>
                <option value="">Choose style</option>
                <option value="Adventure">Adventure & Hiking</option>
                <option value="Backpacking">Culture & Sightseeing</option>
                <option value="Luxury">Luxury & Comfort</option>
                <option value="Family">Family Trip</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">📅 Duration: <strong>{days} days</strong></label>
              <input
                type="range"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="atp-range"
              />
              <div className="atp-range-labels"><span>1 day</span><span>30 days</span></div>
            </div>
          </div>
          <button className="btn btn-primary atp-generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <><span className="atp-spinner" /> Generating...</>
            ) : (
              <>{generated ? "🔄 Regenerate" : "✨ Generate Checklist"}</>
            )}
          </button>
        </div>

        {/* Checklist */}
        {generated && (
          <div className="atp-checklist-wrap glass-panel fade-up">
            <div className="atp-checklist-header">
              <div>
                <h3>📋 Your Trip Checklist</h3>
                <p>{destination} · {days} days · {travelStyle}</p>
              </div>
              <div className="atp-progress-ring">
                <svg viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                  <circle
                    cx="22" cy="22" r="18" fill="none"
                    stroke="url(#pg)" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "center" }}
                  />
                  <defs>
                    <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="atp-progress-text">{progress}%</span>
              </div>
            </div>

            <div className="atp-checklist">
              {checklist.map((item, i) => (
                <div
                  key={i}
                  className={`atp-check-item ${checked[i] ? "done" : ""}`}
                  onClick={() => toggleCheck(i)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="atp-checkbox">{checked[i] ? "✓" : ""}</span>
                  <span className="atp-check-text">{item}</span>
                </div>
              ))}
            </div>

            <p className="atp-tip">💡 Tip: Click each item to mark it complete. Track your progress with the ring above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

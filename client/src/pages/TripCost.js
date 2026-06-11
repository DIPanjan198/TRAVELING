import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripCost.css";

/* Per-day cost estimates in INR by category and city */
const CITIES = {
  "Goa, India":         { hotel: [800, 2500, 6000],   food: [300, 700, 1500],  transport: [200, 400, 800],  activity: [300, 600, 1500] },
  "Manali, India":      { hotel: [600, 1800, 5000],   food: [250, 600, 1200],  transport: [300, 500, 1000], activity: [500, 1000, 2000] },
  "Bali, Indonesia":    { hotel: [1200, 3500, 9000],  food: [400, 900, 2000],  transport: [300, 600, 1500], activity: [600, 1200, 2500] },
  "Bangkok, Thailand":  { hotel: [900, 2800, 7000],   food: [300, 700, 1800],  transport: [200, 450, 1000], activity: [400, 800, 2000] },
  "Singapore":          { hotel: [3000, 7000, 15000], food: [600, 1400, 3000], transport: [300, 600, 1200], activity: [800, 1600, 3500] },
  "Paris, France":      { hotel: [4000, 10000, 22000],food: [800, 2000, 4500], transport: [600, 1000, 2000], activity: [1000, 2500, 5000] },
  "Tokyo, Japan":       { hotel: [3500, 8000, 18000], food: [700, 1800, 4000], transport: [500, 900, 2000], activity: [900, 2000, 4500] },
  "Dubai, UAE":         { hotel: [4500, 11000, 25000],food: [900, 2200, 5000], transport: [500, 1000, 2500], activity: [1200, 2800, 6000] },
  "London, UK":         { hotel: [5000, 12000, 28000],food: [1000, 2500, 5500], transport: [700, 1200, 2500], activity: [1200, 3000, 6500] },
  "Colombo, Sri Lanka": { hotel: [700, 2000, 5500],   food: [250, 550, 1300],  transport: [150, 350, 800],  activity: [300, 700, 1800] },
  "Kathmandu, Nepal":   { hotel: [500, 1500, 4000],   food: [200, 450, 1100],  transport: [150, 300, 700],  activity: [400, 800, 2000] },
  "Phuket, Thailand":   { hotel: [1000, 3000, 8000],  food: [350, 800, 2000],  transport: [250, 500, 1200], activity: [500, 1000, 2500] },
};

const STYLES = ["Budget 🎒", "Standard 🏨", "Luxury 💎"];

export default function TripCost() {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [days, setDays] = useState(7);
  const [style, setStyle] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!dest) { alert("Please select a destination!"); return; }
    const c = CITIES[dest];
    const hotel = c.hotel[style] * days;
    const food = c.food[style] * days * travelers;
    const transport = c.transport[style] * days * travelers;
    const activity = c.activity[style] * days * travelers;
    const flight = Math.round((style === 0 ? 4000 : style === 1 ? 8000 : 18000) * travelers);
    const total = hotel + food + transport + activity + flight;
    const perPerson = Math.round(total / travelers);
    setResult({ hotel, food, transport, activity, flight, total, perPerson, dest, days, travelers, style });
  };

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="tc-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />
      <div className="tc-container">
        <div className="tc-header fade-up">
          <span className="badge badge-emerald">🧮 Smart Budget</span>
          <h1>Trip Cost Estimator</h1>
          <p>Get a realistic budget breakdown for your trip — hotel, food, transport, activities, and flights. Plan smarter, spend less.</p>
        </div>

        <div className="tc-form glass-panel fade-up fade-up-1">
          <div className="tc-grid">
            <div className="form-group">
              <label className="form-label">🌍 Destination</label>
              <select className="form-input" value={dest} onChange={(e) => setDest(e.target.value)}>
                <option value="">Select destination</option>
                {Object.keys(CITIES).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">📅 Duration: <strong>{days} days</strong></label>
              <input type="range" min={1} max={30} value={days} onChange={(e) => setDays(+e.target.value)} className="atp-range" />
              <div className="atp-range-labels"><span>1 day</span><span>30 days</span></div>
            </div>
            <div className="form-group">
              <label className="form-label">👥 Travelers: <strong>{travelers}</strong></label>
              <input type="range" min={1} max={8} value={travelers} onChange={(e) => setTravelers(+e.target.value)} className="atp-range" />
              <div className="atp-range-labels"><span>1</span><span>8 people</span></div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">✨ Travel Style</label>
            <div className="tc-styles">
              {STYLES.map((s, i) => (
                <button key={s} className={`tc-style-btn ${style === i ? "selected" : ""}`} onClick={() => setStyle(i)}>{s}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary tc-calc-btn" onClick={calculate}>🧮 Calculate Budget</button>
        </div>

        {result && (
          <div className="tc-result fade-up">
            <div className="tc-result-header glass-panel">
              <div>
                <h3>Trip to {result.dest}</h3>
                <p>{result.days} days · {result.travelers} traveler{result.travelers > 1 ? "s" : ""} · {STYLES[result.style]}</p>
              </div>
              <div className="tc-total-box">
                <span className="tc-total-label">Total Budget</span>
                <span className="tc-total-val">{fmt(result.total)}</span>
                <span className="tc-per-person">{fmt(result.perPerson)} / person</span>
              </div>
            </div>

            <div className="tc-breakdown">
              {[
                { label: "✈️ Flights", val: result.flight, pct: result.flight / result.total },
                { label: "🏨 Hotel / Stay", val: result.hotel, pct: result.hotel / result.total },
                { label: "🍜 Food & Dining", val: result.food, pct: result.food / result.total },
                { label: "🚌 Transport", val: result.transport, pct: result.transport / result.total },
                { label: "🎯 Activities", val: result.activity, pct: result.activity / result.total },
              ].map((row) => (
                <div key={row.label} className="tc-row glass-panel">
                  <span className="tc-row-label">{row.label}</span>
                  <div className="tc-bar-wrap">
                    <div className="tc-bar" style={{ width: `${Math.round(row.pct * 100)}%` }} />
                  </div>
                  <span className="tc-row-val">{fmt(row.val)}</span>
                  <span className="tc-row-pct">{Math.round(row.pct * 100)}%</span>
                </div>
              ))}
            </div>

            <div className="tc-tip glass-panel fade-up">
              <h4>💡 Smart Tip</h4>
              <p>Split costs with a travel buddy and save <strong>{fmt(Math.round(result.total * 0.35))}</strong> on hotels and transport alone. Find a verified travel partner on AeroTravel!</p>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>Find Travel Buddy →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

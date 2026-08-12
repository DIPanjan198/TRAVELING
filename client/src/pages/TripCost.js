import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripCost.css";

const STYLES = [
  { name: "Budget 🎒", label: "Backpacker", factor: 0.65, flightFactor: 0.7 },
  { name: "Standard 🏨", label: "Comfort", factor: 1.0, flightFactor: 1.0 },
  { name: "Luxury 💎", label: "Premium", factor: 2.4, flightFactor: 2.2 }
];

// Robust & Intelligent Cost Engine for ANY destination name entered by user
function estimateDestinationCosts(destName, styleIdx, days, travelers) {
  const cleanDest = destName.trim().toLowerCase();
  let tier = null;

  // Comprehensive keyword matcher for ANY place entered
  const tier1Keywords = [
    "switzerland", "japan", "tokyo", "kyoto", "usa", "us", "united states", "uk", "london", 
    "paris", "france", "iceland", "reykjavik", "norway", "singapore", "dubai", "uae", 
    "zermatt", "new york", "hawaii", "monaco", "maldives", "australia", "sydney", "canada", 
    "amsterdam", "netherlands", "san francisco", "los angeles", "munich", "berlin", 
    "frankfurt", "vienna", "stockholm", "copenhagen", "zurich", "geneva"
  ];

  const tier2Keywords = [
    "italy", "rome", "greece", "santorini", "athens", "spain", "barcelona", "madrid", 
    "portugal", "lisbon", "turkey", "istanbul", "korea", "seoul", "brazil", "rio", 
    "cape town", "south africa", "argentina", "croatia", "prague", "czech", "budapest", 
    "mexico", "cancun", "new zealand", "queenstown", "auckland"
  ];

  const tier3Keywords = [
    "thailand", "bangkok", "phuket", "bali", "indonesia", "vietnam", "hanoi", "ho chi minh", 
    "nepal", "kathmandu", "lanka", "sri lanka", "colombo", "malaysia", "kuala lumpur", 
    "philippines", "manila", "egypt", "cairo", "cambodia", "georgia", "tbilisi", "baku", 
    "azerbaijan", "uzbekistan", "pattaya", "krabi", "chiang mai"
  ];

  const tier4Keywords = [
    "india", "goa", "manali", "kerala", "ladakh", "jaipur", "ooty", "coorg", "rishikesh", 
    "shimla", "mumbai", "delhi", "bangalore", "bengaluru", "hyderabad", "kolkata", "chennai", 
    "pune", "udaipur", "jaisalmer", "darjeeling", "gangtok", "sikkim", "nainital", "mussoorie", 
    "kasol", "spiti", "kashmir", "srinagar", "alleppey", "munnar", "kodaikanal", "gokarna", 
    "pondicherry", "hampi", "varanasi", "agra", "amritsar", "mysore", "guwahati", "shillong"
  ];

  if (tier1Keywords.some(k => cleanDest.includes(k))) {
    tier = 1;
  } else if (tier2Keywords.some(k => cleanDest.includes(k))) {
    tier = 2;
  } else if (tier3Keywords.some(k => cleanDest.includes(k))) {
    tier = 3;
  } else if (tier4Keywords.some(k => cleanDest.includes(k))) {
    tier = 4;
  } else {
    // Deterministic fallback hashing algorithm for any custom place name
    let hash = 0;
    for (let i = 0; i < cleanDest.length; i++) {
      hash = cleanDest.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);
    tier = (absHash % 3) + 2; // Tier 2, 3, or 4
  }

  // Base daily rates per tier (in INR)
  const baseRatesByTier = {
    1: { hotelPerRoom: 7500, foodPerPerson: 1800, transportPerPerson: 900, activityPerPerson: 1800, flightPerPerson: 35000 },
    2: { hotelPerRoom: 4500, foodPerPerson: 1100, transportPerPerson: 600, activityPerPerson: 1200, flightPerPerson: 22000 },
    3: { hotelPerRoom: 2500, foodPerPerson: 650,  transportPerPerson: 350, activityPerPerson: 800,  flightPerPerson: 12000 },
    4: { hotelPerRoom: 1800, foodPerPerson: 450,  transportPerPerson: 250, activityPerPerson: 450,  flightPerPerson: 4500 }
  };

  const styleObj = STYLES[styleIdx] || STYLES[1];
  const rates = baseRatesByTier[tier] || baseRatesByTier[2];

  // Room count scaling: 1 room per 2 travelers
  const roomsNeeded = Math.ceil(travelers / 2);

  // Apply style multiplier
  const dailyHotel = Math.round(rates.hotelPerRoom * styleObj.factor);
  const dailyFood = Math.round(rates.foodPerPerson * styleObj.factor);
  const dailyTransport = Math.round(rates.transportPerPerson * styleObj.factor);
  const dailyActivity = Math.round(rates.activityPerPerson * styleObj.factor);
  const flightPerPerson = Math.round(rates.flightPerPerson * styleObj.flightFactor);

  // Totals over entire trip
  const hotelTotal = dailyHotel * days * roomsNeeded;
  const foodTotal = dailyFood * days * travelers;
  const transportTotal = dailyTransport * days * travelers;
  const activityTotal = dailyActivity * days * travelers;
  const flightTotal = flightPerPerson * travelers;

  const total = hotelTotal + foodTotal + transportTotal + activityTotal + flightTotal;
  const perPerson = Math.round(total / travelers);

  const tierLabels = {
    1: "Tier 1 (Premium / International High-Cost Destination)",
    2: "Tier 2 (Mid-High Cost Destination)",
    3: "Tier 3 (Budget International Destination)",
    4: "Tier 4 (Domestic / Regional Destination)"
  };

  return {
    tier,
    tierLabel: tierLabels[tier],
    dailyHotel,
    dailyFood,
    dailyTransport,
    dailyActivity,
    flightPerPerson,
    roomsNeeded,
    hotelTotal,
    foodTotal,
    transportTotal,
    activityTotal,
    flightTotal,
    total,
    perPerson
  };
}

export default function TripCost() {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [days, setDays] = useState(7);
  const [style, setStyle] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const [result, setResult] = useState(null);

  const calculate = (customDest) => {
    const targetDest = (typeof customDest === "string" ? customDest : dest).trim();
    if (!targetDest) {
      alert("Please enter any destination of your choice!");
      return;
    }
    const breakdown = estimateDestinationCosts(targetDest, style, days, travelers);
    setResult({
      ...breakdown,
      dest: targetDest,
      days,
      travelers,
      style
    });
  };

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="tc-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />
      <div className="tc-container">
        <div className="tc-header fade-up">
          <span className="badge badge-emerald">🧮 Any-Destination Estimator</span>
          <h1>Trip Cost Estimator</h1>
          <p>Type <strong>any destination</strong> in the world you want to check — whether it's a city, country, island, or hill station. Get an intelligent budget breakdown.</p>
        </div>

        <div className="tc-form glass-panel fade-up fade-up-1">
          {/* Main Destination Input Field */}
          <div className="form-group">
            <label className="form-label">📍 Enter Any Destination You Want to Check</label>
            <div className="tc-dest-input-wrap">
              <input
                type="text"
                className="form-input tc-dest-input"
                placeholder="e.g. Kyoto, Shimla, Paris, Hawaii, Ladakh, Zermatt..."
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") calculate(); }}
              />
            </div>
            
            {/* Quick Ideas Chips */}
            <div className="tc-chips-container">
              <span className="tc-chips-label">Popular Examples (or type your own above):</span>
              <div className="tc-chips-grid">
                {["Goa, India", "Manali, India", "Bali, Indonesia", "Tokyo, Japan", "Swiss Alps", "Paris, France", "Dubai, UAE", "Reykjavik, Iceland"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`tc-chip-btn ${dest.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
                    onClick={() => {
                      setDest(c);
                      calculate(c);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tc-grid">
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
            <div className="form-group">
              <label className="form-label">✨ Travel Style</label>
              <div className="tc-styles">
                {STYLES.map((s, i) => (
                  <button key={s.name} className={`tc-style-btn ${style === i ? "selected" : ""}`} onClick={() => setStyle(i)}>{s.name}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="tc-actions">
            <button className="btn btn-primary tc-calc-btn" onClick={() => calculate()}>
              🧮 Calculate Budget for "{dest || "Entered Destination"}"
            </button>
          </div>
        </div>

        {result && (
          <div className="tc-result fade-up">
            <div className="tc-result-header glass-panel">
              <div>
                <span className="tc-tier-badge">{result.tierLabel}</span>
                <h3>Trip to {result.dest}</h3>
                <p>{result.days} days · {result.travelers} traveler{result.travelers > 1 ? "s" : ""} ({result.roomsNeeded} room{result.roomsNeeded > 1 ? "s" : ""}) · {STYLES[result.style].name}</p>
              </div>
              <div className="tc-total-box">
                <span className="tc-total-label">Total Estimated Budget</span>
                <span className="tc-total-val">{fmt(result.total)}</span>
                <span className="tc-per-person">{fmt(result.perPerson)} / person</span>
              </div>
            </div>

            {/* Daily Rates Highlight Cards */}
            <div className="tc-daily-grid">
              <div className="tc-daily-card glass-panel">
                <span>🏨 Hotel per Night</span>
                <strong>{fmt(result.dailyHotel)}</strong>
                <small>for {result.roomsNeeded} room(s)</small>
              </div>
              <div className="tc-daily-card glass-panel">
                <span>🍜 Food per Person/Day</span>
                <strong>{fmt(result.dailyFood)}</strong>
                <small>dining & snacks</small>
              </div>
              <div className="tc-daily-card glass-panel">
                <span>🚌 Local Transport/Day</span>
                <strong>{fmt(result.dailyTransport)}</strong>
                <small>per person</small>
              </div>
              <div className="tc-daily-card glass-panel">
                <span>✈️ Flight / Person</span>
                <strong>{fmt(result.flightPerPerson)}</strong>
                <small>est. round-trip</small>
              </div>
            </div>

            <div className="tc-breakdown">
              {[
                { label: "✈️ Round-trip Flights", val: result.flightTotal, pct: result.flightTotal / result.total },
                { label: "🏨 Hotel / Accommodation", val: result.hotelTotal, pct: result.hotelTotal / result.total },
                { label: "🍜 Food & Dining", val: result.foodTotal, pct: result.foodTotal / result.total },
                { label: "🚌 Local Transport", val: result.transportTotal, pct: result.transportTotal / result.total },
                { label: "🎯 Sightseeing & Activities", val: result.activityTotal, pct: result.activityTotal / result.total },
              ].map((row) => (
                <div key={row.label} className="tc-row glass-panel">
                  <span className="tc-row-label">{row.label}</span>
                  <div className="tc-bar-wrap">
                    <div className="tc-bar" style={{ width: `${Math.max(5, Math.round(row.pct * 100))}%` }} />
                  </div>
                  <span className="tc-row-val">{fmt(row.val)}</span>
                  <span className="tc-row-pct">{Math.round(row.pct * 100)}%</span>
                </div>
              ))}
            </div>

            <div className="tc-tip glass-panel fade-up">
              <div className="tc-tip-content">
                <div>
                  <h4>💡 Split & Save with a Travel Buddy</h4>
                  <p>Splitting lodging and transport costs for <strong>{result.dest}</strong> with a verified partner saves up to <strong>{fmt(Math.round((result.hotelTotal + result.transportTotal) * 0.5))}</strong> per person!</p>
                </div>
                <div className="tc-tip-btns">
                  <button className="btn btn-primary" onClick={() => navigate("/register")}>Find Travel Buddy →</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

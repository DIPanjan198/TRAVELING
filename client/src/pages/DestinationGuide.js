import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TravelQuiz.css";

const DESTINATIONS = [
  {
    name: "Goa", country: "India", emoji: "🏖️", tag: "Beach", bestTime: "Nov–Feb",
    budget: "₹1,500–4,000/day", language: "Konkani / English", currency: "INR (₹)",
    visa: "No visa for Indians", safetyRating: 4, crowdLevel: "High",
    desc: "India's party capital with golden beaches, Portuguese heritage, seafood feasts, and vibrant nightlife. A year-round favourite.",
    highlights: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Anjuna Flea Market"],
    temp: "25–35°C", type: "Beach"
  },
  {
    name: "Manali", country: "India", emoji: "🏔️", tag: "Mountains", bestTime: "Mar–Jun, Oct–Nov",
    budget: "₹1,200–3,500/day", language: "Hindi / Manali dialect", currency: "INR (₹)",
    visa: "No visa for Indians", safetyRating: 4, crowdLevel: "Medium",
    desc: "Snow-capped peaks, adventure sports, and hippie culture. Gateway to Spiti and Ladakh. Perfect for trekkers and bikers.",
    highlights: ["Rohtang Pass", "Solang Valley", "Old Manali", "Hadimba Temple"],
    temp: "-5 to 25°C", type: "Adventure"
  },
  {
    name: "Bali", country: "Indonesia", emoji: "🌺", tag: "Culture", bestTime: "Apr–Oct",
    budget: "₹2,500–8,000/day", language: "Balinese / Indonesian", currency: "IDR (Rp)",
    visa: "Visa on arrival for Indians (30 days)", safetyRating: 4, crowdLevel: "High",
    desc: "The Island of the Gods. Lush rice terraces, Hindu temples, world-class surf, and incredible food in every warung.",
    highlights: ["Uluwatu Temple", "Tegalalang Terraces", "Seminyak Beach", "Ubud Monkey Forest"],
    temp: "24–33°C", type: "Culture"
  },
  {
    name: "Bangkok", country: "Thailand", emoji: "🛕", tag: "Budget", bestTime: "Nov–Feb",
    budget: "₹1,800–5,000/day", language: "Thai", currency: "THB (฿)",
    visa: "Visa on arrival for Indians (15 days)", safetyRating: 3, crowdLevel: "Very High",
    desc: "A sensory overload of street food, golden temples, sky bars, and rooftop parties. Incredibly affordable and endlessly entertaining.",
    highlights: ["Grand Palace", "Chatuchak Market", "Khao San Road", "Floating Markets"],
    temp: "25–35°C", type: "Budget"
  },
  {
    name: "Tokyo", country: "Japan", emoji: "🗼", tag: "Modern", bestTime: "Mar–May, Sep–Nov",
    budget: "₹5,000–15,000/day", language: "Japanese", currency: "JPY (¥)",
    visa: "Required for Indians (apply in advance)", safetyRating: 5, crowdLevel: "High",
    desc: "The future is here. Flawless trains, Michelin-starred ramen, neon-lit alleys, and cherry blossoms. The safest mega-city on Earth.",
    highlights: ["Shibuya Crossing", "Mount Fuji Day Trip", "Shinjuku", "Asakusa Temple"],
    temp: "5–35°C", type: "Modern"
  },
  {
    name: "Dubai", country: "UAE", emoji: "🌆", tag: "Luxury", bestTime: "Oct–Apr",
    budget: "₹7,000–25,000/day", language: "Arabic / English", currency: "AED (د.إ)",
    visa: "Visa on arrival for Indians (30 days)", safetyRating: 5, crowdLevel: "High",
    desc: "Superlatives define Dubai — tallest building, largest mall, most ambitious architecture. A city that refuses to think small.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Desert Safari", "Palm Jumeirah"],
    temp: "18–42°C", type: "Luxury"
  },
  {
    name: "Paris", country: "France", emoji: "🗼", tag: "Romance", bestTime: "Apr–Jun, Sep–Oct",
    budget: "₹8,000–22,000/day", language: "French", currency: "EUR (€)",
    visa: "Schengen Visa required for Indians", safetyRating: 3, crowdLevel: "Very High",
    desc: "The City of Light never disappoints. Art, fashion, croissants, and the world's most photographed tower await.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River Cruise"],
    temp: "5–30°C", type: "Culture"
  },
  {
    name: "Singapore", country: "Singapore", emoji: "🦁", tag: "Clean", bestTime: "Feb–Apr",
    budget: "₹5,000–15,000/day", language: "English / Mandarin / Tamil", currency: "SGD (S$)",
    visa: "No visa for Indians (30 days)", safetyRating: 5, crowdLevel: "High",
    desc: "A tiny city-state punching way above its weight. World-class food, immaculate streets, Gardens by the Bay, and incredible efficiency.",
    highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Hawker Centres"],
    temp: "25–33°C", type: "Modern"
  },
];

const TYPES = ["All", "Beach", "Mountains", "Culture", "Budget", "Luxury", "Modern", "Adventure"];

export default function DestinationGuide() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const shown = DESTINATIONS.filter((d) => {
    const matchType = filter === "All" || d.type === filter || d.tag === filter;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const stars = (n) => "⭐".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="dg-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />
      <div className="dg-container">
        <div className="dg-header fade-up">
          <span className="badge badge-indigo">🌍 Explore the World</span>
          <h1>Destination Guide</h1>
          <p>Detailed travel info for top global destinations — best time to visit, visa, budget, safety rating, and local highlights.</p>
        </div>

        {/* Filter + Search */}
        <div className="dg-controls fade-up fade-up-1">
          <input className="form-input dg-search" placeholder="🔍 Search destination..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="dg-filters">
            {TYPES.map((t) => (
              <button key={t} className={`dg-filter-btn ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="dg-grid fade-up fade-up-2">
          {shown.map((d) => (
            <div
              key={d.name}
              className={`dg-card glass-panel ${expanded === d.name ? "expanded" : ""}`}
              onClick={() => setExpanded(expanded === d.name ? null : d.name)}
            >
              <div className="dg-card-top">
                <span className="dg-emoji">{d.emoji}</span>
                <div className="dg-card-title">
                  <h3>{d.name}</h3>
                  <p>{d.country}</p>
                </div>
                <span className="dg-tag">{d.tag}</span>
              </div>

              <p className="dg-desc">{d.desc}</p>

              <div className="dg-quick-stats">
                <span>📅 {d.bestTime}</span>
                <span>💰 {d.budget}</span>
                <span>🌡️ {d.temp}</span>
              </div>

              {expanded === d.name && (
                <div className="dg-details">
                  <div className="dg-details-grid">
                    <div className="dg-detail-item"><span>🗣️ Language</span><strong>{d.language}</strong></div>
                    <div className="dg-detail-item"><span>💱 Currency</span><strong>{d.currency}</strong></div>
                    <div className="dg-detail-item"><span>🛂 Visa (India)</span><strong>{d.visa}</strong></div>
                    <div className="dg-detail-item"><span>👥 Crowds</span><strong>{d.crowdLevel}</strong></div>
                    <div className="dg-detail-item"><span>🛡️ Safety</span><strong>{stars(d.safetyRating)}</strong></div>
                  </div>
                  <div className="dg-highlights">
                    <p className="dg-hl-label">Must-See</p>
                    <div className="dg-hl-chips">
                      {d.highlights.map((h) => <span key={h} className="dg-hl-chip">{h}</span>)}
                    </div>
                  </div>
                  <button className="btn btn-primary dg-buddy-btn" onClick={(e) => { e.stopPropagation(); navigate("/register"); }}>
                    Find a Buddy for {d.name} →
                  </button>
                </div>
              )}

              <p className="dg-expand-hint">{expanded === d.name ? "▲ Show less" : "▼ View full details"}</p>
            </div>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="tj-empty glass-panel fade-up">
            <span>🌍</span>
            <h3>No destinations found</h3>
            <p>Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

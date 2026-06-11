import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TravelQuiz.css";

const QUESTIONS = [
  {
    q: "Where would your dream holiday be?",
    options: [
      { text: "High-altitude mountain trek 🏔️", scores: { A: 3, B: 0, C: 0, D: 0 } },
      { text: "Pristine beach resort 🏖️", scores: { A: 0, B: 0, C: 3, D: 1 } },
      { text: "Historic cities & museums 🏛️", scores: { A: 0, B: 3, C: 0, D: 0 } },
      { text: "Local street food markets 🍜", scores: { A: 0, B: 1, C: 0, D: 3 } },
    ]
  },
  {
    q: "What's your daily travel budget per person?",
    options: [
      { text: "Under ₹1,500 — Keep it super cheap 💸", scores: { D: 3, B: 1 } },
      { text: "₹1,500–5,000 — Comfortable balance 🎒", scores: { A: 1, B: 2, D: 1 } },
      { text: "₹5,000–15,000 — Enjoy nicely 🌟", scores: { C: 2, B: 1 } },
      { text: "₹15,000+ — Only the best 💎", scores: { C: 3 } },
    ]
  },
  {
    q: "What's your ideal accommodation?",
    options: [
      { text: "Camping or dormitory hostel 🏕️", scores: { A: 2, D: 2 } },
      { text: "Cozy boutique guesthouse 🏡", scores: { B: 2, D: 1 } },
      { text: "Standard 3-star hotel 🏨", scores: { A: 1, C: 1, B: 1 } },
      { text: "5-star resort with pool & spa 🌊", scores: { C: 3 } },
    ]
  },
  {
    q: "How do you prefer exploring a new place?",
    options: [
      { text: "No plan — just wander freely 🗺️", scores: { D: 3, A: 1 } },
      { text: "Guided tours & structured itinerary 📋", scores: { B: 3, C: 1 } },
      { text: "Research everything in advance 🔍", scores: { B: 2, C: 1 } },
      { text: "Follow locals and skip tourist spots 🤫", scores: { D: 3, A: 1 } },
    ]
  },
  {
    q: "What's a non-negotiable travel essential for you?",
    options: [
      { text: "Adrenaline & physical challenge 🧗", scores: { A: 3 } },
      { text: "Learning local history & culture 📚", scores: { B: 3 } },
      { text: "Instagram-worthy luxury photos 📸", scores: { C: 3 } },
      { text: "Trying 10 new street foods a day 🍛", scores: { D: 3 } },
    ]
  },
  {
    q: "Pick your ideal travel companion:",
    options: [
      { text: "Fellow trekker who hates crowds 🧗", scores: { A: 2 } },
      { text: "History nerd with great playlists 🎵", scores: { B: 2 } },
      { text: "Well-connected socialite who knows everyone 🥂", scores: { C: 2 } },
      { text: "Spontaneous foodie who speaks the local language 🌶️", scores: { D: 2 } },
    ]
  },
];

const RESULTS = {
  A: {
    type: "The Adventure Seeker 🧗",
    desc: "You crave raw nature, physical challenge, and untouched paths. Crowds bore you — you want trails, peaks, and the satisfaction of reaching places most people never see.",
    destinations: ["Manali", "Rishikesh", "Coorg", "Queenstown NZ", "Nepal Everest Base"],
    buddyStyle: "Adventure",
    color: "#f59e0b",
    emoji: "🏔️",
  },
  B: {
    type: "The Culture Explorer 🏛️",
    desc: "History, architecture, art, and local stories fuel you. You plan carefully, visit every museum, and always return home knowing the destination's soul deeply.",
    destinations: ["Paris", "Kyoto", "Istanbul", "Jaipur", "Rome"],
    buddyStyle: "Backpacking",
    color: "#818cf8",
    emoji: "🏛️",
  },
  C: {
    type: "The Luxury Traveler 💎",
    desc: "You believe travel is meant to be savoured. Premium hotels, fine dining, private transfers, and curated experiences are your standard. You inspire others to live well.",
    destinations: ["Dubai", "Maldives", "Bali Ubud", "Monaco", "Santorini"],
    buddyStyle: "Luxury",
    color: "#ec4899",
    emoji: "💎",
  },
  D: {
    type: "The Backpacker Foodie 🌶️",
    desc: "You travel with a light bag, a big appetite, and zero plan. You eat where locals eat, sleep anywhere, make friends everywhere, and always find the hidden gem.",
    destinations: ["Bangkok", "Hanoi", "Mumbai", "Mexico City", "Marrakech"],
    buddyStyle: "Backpacking",
    color: "#34d399",
    emoji: "🎒",
  },
};

export default function TravelQuiz() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleAnswer = (optScores) => {
    const newScores = { ...scores };
    Object.entries(optScores).forEach(([k, v]) => { newScores[k] = (newScores[k] || 0) + v; });
    setSelected(optScores);
    setTimeout(() => {
      setScores(newScores);
      setSelected(null);
      if (current + 1 >= QUESTIONS.length) {
        const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
        setResult(RESULTS[winner]);
      } else {
        setCurrent(current + 1);
      }
    }, 350);
  };

  const restart = () => { setCurrent(0); setScores({ A: 0, B: 0, C: 0, D: 0 }); setResult(null); setSelected(null); };

  const progress = ((current) / QUESTIONS.length) * 100;

  return (
    <div className="tq-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />
      <div className="tq-container">
        <div className="tq-header fade-up">
          <span className="badge badge-purple">🎯 Personality Quiz</span>
          <h1>What Type of Traveler Are You?</h1>
          <p>Answer 6 quick questions and discover your travel personality — and which destinations suit you best.</p>
        </div>

        {!result ? (
          <div className="tq-quiz glass-panel fade-up fade-up-1">
            {/* Progress */}
            <div className="tq-progress-bar-bg">
              <div className="tq-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="tq-step">Question {current + 1} of {QUESTIONS.length}</p>
            <h2 className="tq-question">{QUESTIONS[current].q}</h2>
            <div className="tq-options">
              {QUESTIONS[current].options.map((opt, i) => (
                <button
                  key={i}
                  className={`tq-option ${selected === opt.scores ? "selected" : ""}`}
                  onClick={() => handleAnswer(opt.scores)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="tq-result fade-up">
            <div className="tq-result-hero glass-panel" style={{ borderColor: result.color + "55" }}>
              <div className="tq-result-emoji" style={{ background: result.color + "20", borderColor: result.color + "44" }}>
                {result.emoji}
              </div>
              <h2 style={{ color: result.color }}>{result.type}</h2>
              <p>{result.desc}</p>
            </div>

            <div className="tq-result-dests glass-panel fade-up">
              <h3>🌍 Perfect Destinations for You</h3>
              <div className="tq-dest-chips">
                {result.destinations.map((d) => (
                  <span key={d} className="tq-dest-chip" style={{ borderColor: result.color + "55", color: result.color }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="tq-cta glass-panel fade-up">
              <h3>🤝 Find Your Perfect Travel Buddy</h3>
              <p>Connect with fellow <strong>{result.type.split(" ").slice(2).join(" ")}</strong> travelers who match your style, destination, and budget!</p>
              <div className="tq-cta-btns">
                <button className="btn btn-primary" onClick={() => navigate("/register")}>Find My Buddy →</button>
                <button className="btn btn-glass" onClick={restart}>Retake Quiz 🔄</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

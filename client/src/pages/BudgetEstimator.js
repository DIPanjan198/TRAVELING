import React, { useState, useEffect } from "react";
import "./BudgetEstimator.css";

// Rates in USD per day (Module-level Constants)
const baseRates = {
  Goa: { Backpacking: 15, Standard: 40, Luxury: 180 },
  Bali: { Backpacking: 18, Standard: 50, Luxury: 220 },
  Paris: { Backpacking: 45, Standard: 120, Luxury: 450 },
  "Swiss Alps": { Backpacking: 55, Standard: 160, Luxury: 550 },
  Dubai: { Backpacking: 40, Standard: 110, Luxury: 420 },
  Kyoto: { Backpacking: 35, Standard: 95, Luxury: 350 }
};

const currencySymbols = { USD: "$", EUR: "€", INR: "₹" };
const conversionRates = { USD: 1, EUR: 0.92, INR: 83.5 };

function BudgetEstimator() {
  const [destination, setDestination] = useState("Goa");
  const [duration, setDuration] = useState(7);
  const [vibe, setVibe] = useState("Standard");
  const [currency, setCurrency] = useState("USD");
  const [splitWithBuddy, setSplitWithBuddy] = useState(true);

  const [costs, setCosts] = useState({
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    total: 0,
    buddySaving: 0
  });

  useEffect(() => {
    const rates = baseRates[destination] || baseRates["Goa"];
    const dailyAcc = rates[vibe === "Backpacking" ? "Backpacking" : vibe === "Luxury" ? "Luxury" : "Standard"];
    
    // Food daily average
    const dailyFood = vibe === "Backpacking" ? 12 : vibe === "Luxury" ? 80 : 30;
    // Transport daily average
    const dailyTrans = vibe === "Backpacking" ? 8 : vibe === "Luxury" ? 60 : 20;
    // Activities daily average
    const dailyAct = vibe === "Backpacking" ? 10 : vibe === "Luxury" ? 100 : 25;

    // Split logic: accommodation and transport can be split with a travel buddy
    const accommodationTotal = dailyAcc * duration;
    const transportTotal = dailyTrans * duration;
    const foodTotal = dailyFood * duration;
    const activitiesTotal = dailyAct * duration;

    let finalAcc = accommodationTotal;
    let finalTrans = transportTotal;
    let buddySaving = 0;

    if (splitWithBuddy) {
      finalAcc = accommodationTotal / 2;
      finalTrans = transportTotal / 2;
      buddySaving = (accommodationTotal / 2) + (transportTotal / 2);
    }

    const total = finalAcc + finalTrans + foodTotal + activitiesTotal;

    // Convert values
    const conv = conversionRates[currency];
    setCosts({
      accommodation: Math.round(finalAcc * conv),
      food: Math.round(foodTotal * conv),
      transport: Math.round(finalTrans * conv),
      activities: Math.round(activitiesTotal * conv),
      total: Math.round(total * conv),
      buddySaving: Math.round(buddySaving * conv)
    });
  }, [destination, duration, vibe, currency, splitWithBuddy]);

  return (
    <div className="budget-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <header className="budget-header">
        <span className="badge badge-indigo">Aero Wallet</span>
        <h1>AI Expense Estimator</h1>
        <p>Calculate travel costs based on style, duration, and see how much you save by finding a travel buddy.</p>
      </header>

      <div className="budget-calculator-grid">
        {/* Left Inputs panel */}
        <div className="calc-inputs-panel glass-panel">
          <h3>Planner Parameters</h3>
          
          <div className="form-group">
            <label className="form-label">📍 Destination</label>
            <select className="form-input" value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="Goa">Goa, India</option>
              <option value="Bali">Bali, Indonesia</option>
              <option value="Paris">Paris, France</option>
              <option value="Swiss Alps">Swiss Alps, Switzerland</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Kyoto">Kyoto, Japan</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">📅 Trip Duration: <strong>{duration} Days</strong></label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              className="slider-input" 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">🎒 Adventure Vibe</label>
            <div className="vibe-selectors">
              {["Backpacking", "Standard", "Luxury"].map(v => (
                <button
                  key={v}
                  type="button"
                  className={`vibe-btn ${vibe === v ? "active" : ""}`}
                  onClick={() => setVibe(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">💱 Display Currency</label>
            <div className="currency-selectors">
              {["USD", "EUR", "INR"].map(c => (
                <button
                  key={c}
                  type="button"
                  className={`currency-btn ${currency === c ? "active" : ""}`}
                  onClick={() => setCurrency(c)}
                >
                  {c} ({currencySymbols[c]})
                </button>
              ))}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={splitWithBuddy} 
                onChange={(e) => setSplitWithBuddy(e.target.checked)} 
              />
              <span>Split lodging & transport with a buddy</span>
            </label>
          </div>
        </div>

        {/* Right Output panel */}
        <div className="calc-outputs-panel glass-panel">
          <h3>Estimated Budget</h3>
          
          <div className="total-display">
            <span className="total-label">Total Estimated Cost</span>
            <h2>{currencySymbols[currency]} {costs.total.toLocaleString()}</h2>
            {splitWithBuddy && costs.buddySaving > 0 && (
              <span className="saving-alert">
                🎉 Saving <strong>{currencySymbols[currency]} {costs.buddySaving.toLocaleString()}</strong> by sharing!
              </span>
            )}
          </div>

          <div className="cost-breakdown-list">
            <div className="breakdown-item">
              <span>🏨 Accommodation</span>
              <strong>{currencySymbols[currency]} {costs.accommodation.toLocaleString()}</strong>
            </div>
            <div className="breakdown-item">
              <span>🍔 Food & Dining</span>
              <strong>{currencySymbols[currency]} {costs.food.toLocaleString()}</strong>
            </div>
            <div className="breakdown-item">
              <span>🚕 Local Transport</span>
              <strong>{currencySymbols[currency]} {costs.transport.toLocaleString()}</strong>
            </div>
            <div className="breakdown-item">
              <span>🎟 Activities & Tickets</span>
              <strong>{currencySymbols[currency]} {costs.activities.toLocaleString()}</strong>
            </div>
          </div>

          <div className="calc-footer-note">
            <p>Estimates are calculated using seasonal averages. Renting rooms and sharing cabs with travel partners dynamically halves lodging & transit values.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetEstimator;

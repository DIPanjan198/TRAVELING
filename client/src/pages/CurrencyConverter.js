import { useState } from "react";
import "./CurrencyConverter.css";

/* Static exchange rates relative to USD (updated periodically) */
const RATES = {
  USD: 1,      INR: 83.47,  EUR: 0.92,   GBP: 0.79,
  JPY: 155.3,  AUD: 1.53,   CAD: 1.37,   SGD: 1.35,
  THB: 36.2,   IDR: 16230,  MYR: 4.72,   AED: 3.67,
  CHF: 0.90,   KRW: 1355,   NZD: 1.63,   ZAR: 18.7,
  BRL: 5.16,   MXN: 17.15,  HKD: 7.82,   TRY: 32.4,
};

const FLAGS = {
  USD:"🇺🇸", INR:"🇮🇳", EUR:"🇪🇺", GBP:"🇬🇧", JPY:"🇯🇵",
  AUD:"🇦🇺", CAD:"🇨🇦", SGD:"🇸🇬", THB:"🇹🇭", IDR:"🇮🇩",
  MYR:"🇲🇾", AED:"🇦🇪", CHF:"🇨🇭", KRW:"🇰🇷", NZD:"🇳🇿",
  ZAR:"🇿🇦", BRL:"🇧🇷", MXN:"🇲🇽", HKD:"🇭🇰", TRY:"🇹🇷",
};

const QUICK_PAIRS = [
  { from: "INR", to: "USD", label: "India → USA" },
  { from: "INR", to: "EUR", label: "India → Europe" },
  { from: "INR", to: "THB", label: "India → Thailand" },
  { from: "INR", to: "IDR", label: "India → Bali" },
  { from: "INR", to: "SGD", label: "India → Singapore" },
  { from: "USD", to: "JPY", label: "USA → Japan" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [history, setHistory] = useState([]);

  const convert = () => {
    const inUSD = parseFloat(amount) / RATES[from];
    return (inUSD * RATES[to]).toFixed(4);
  };

  const result = amount && !isNaN(amount) ? convert() : "—";

  const handleConvert = () => {
    if (!amount || isNaN(amount)) return;
    const entry = {
      id: Date.now(),
      from, to, amount: parseFloat(amount),
      result: parseFloat(result),
      rate: (RATES[to] / RATES[from]).toFixed(6),
      time: new Date().toLocaleTimeString(),
    };
    setHistory((h) => [entry, ...h].slice(0, 10));
  };

  const swap = () => { setFrom(to); setTo(from); };

  const setQuick = (pair) => { setFrom(pair.from); setTo(pair.to); };

  return (
    <div className="cc-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="cc-container">
        <div className="cc-header fade-up">
          <span className="badge badge-indigo">💱 Real Rates</span>
          <h1>Currency Converter</h1>
          <p>Instantly convert between 20 travel currencies. Know exactly what you're spending abroad.</p>
        </div>

        {/* Quick pairs */}
        <div className="cc-quick-pairs fade-up fade-up-1">
          <p className="cc-section-label">Popular Travel Routes</p>
          <div className="cc-pairs-grid">
            {QUICK_PAIRS.map((p) => (
              <button
                key={p.label}
                className={`cc-pair-chip glass-panel ${from === p.from && to === p.to ? "selected" : ""}`}
                onClick={() => setQuick(p)}
              >
                {FLAGS[p.from]} → {FLAGS[p.to]}
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main converter */}
        <div className="cc-card glass-panel fade-up fade-up-2">
          <div className="cc-inputs">
            <div className="cc-field">
              <label className="form-label">Amount</label>
              <input
                className="form-input cc-amount-input"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="cc-field">
              <label className="form-label">From</label>
              <select className="form-input" value={from} onChange={(e) => setFrom(e.target.value)}>
                {Object.keys(RATES).map((c) => (
                  <option key={c} value={c}>{FLAGS[c]} {c}</option>
                ))}
              </select>
            </div>

            <button className="cc-swap-btn" onClick={swap} title="Swap currencies">⇌</button>

            <div className="cc-field">
              <label className="form-label">To</label>
              <select className="form-input" value={to} onChange={(e) => setTo(e.target.value)}>
                {Object.keys(RATES).map((c) => (
                  <option key={c} value={c}>{FLAGS[c]} {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="cc-result-box">
            <div className="cc-result-label">
              {FLAGS[from]} {parseFloat(amount || 0).toLocaleString()} {from} =
            </div>
            <div className="cc-result-value">
              {FLAGS[to]} <span>{parseFloat(result || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span> {to}
            </div>
            <div className="cc-rate-info">
              1 {from} = {(RATES[to] / RATES[from]).toFixed(4)} {to}
              &nbsp;·&nbsp;
              1 {to} = {(RATES[from] / RATES[to]).toFixed(4)} {from}
            </div>
          </div>

          <button className="btn btn-primary cc-convert-btn" onClick={handleConvert}>
            💾 Save to History
          </button>
        </div>

        {/* Conversion history */}
        {history.length > 0 && (
          <div className="cc-history glass-panel fade-up">
            <h3>📋 Conversion History</h3>
            <div className="cc-history-list">
              {history.map((h) => (
                <div key={h.id} className="cc-history-row">
                  <span className="cc-hist-pair">{FLAGS[h.from]}{h.from} → {FLAGS[h.to]}{h.to}</span>
                  <span className="cc-hist-amounts">{h.amount.toLocaleString()} → <strong>{h.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
                  <span className="cc-hist-time">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

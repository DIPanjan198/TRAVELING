import { useState } from "react";
import "./ExpenseSplitter.css";

export default function ExpenseSplitter() {
  const [members, setMembers] = useState(["", ""]);
  const [expenses, setExpenses] = useState([]);
  const [expForm, setExpForm] = useState({ desc: "", amount: "", paidBy: "", splitWith: [] });
  const [settled, setSettled] = useState({});

  const addMember = () => setMembers([...members, ""]);
  const updateMember = (i, val) => {
    const m = [...members]; m[i] = val; setMembers(m);
  };
  const removeMember = (i) => setMembers(members.filter((_, idx) => idx !== i));

  const validMembers = members.filter((m) => m.trim());

  const handleAddExpense = () => {
    const { desc, amount, paidBy, splitWith } = expForm;
    if (!desc || !amount || !paidBy || splitWith.length === 0) {
      alert("Fill all fields and select who to split with!"); return;
    }
    const share = parseFloat(amount) / (splitWith.length + 1);
    setExpenses([...expenses, { desc, amount: parseFloat(amount), paidBy, splitWith, share: +share.toFixed(2) }]);
    setExpForm({ desc: "", amount: "", paidBy: "", splitWith: [] });
  };

  const toggleSplit = (name) => {
    const sw = expForm.splitWith;
    setExpForm({ ...expForm, splitWith: sw.includes(name) ? sw.filter((n) => n !== name) : [...sw, name] });
  };

  // Calculate net balances
  const balances = {};
  validMembers.forEach((m) => { balances[m] = 0; });
  expenses.forEach(({ amount, paidBy, splitWith }) => {
    const total = splitWith.length + 1;
    const share = amount / total;
    balances[paidBy] = (balances[paidBy] || 0) + amount - share;
    splitWith.forEach((p) => { balances[p] = (balances[p] || 0) - share; });
  });

  // Simplify debts
  const settlements = [];
  const pos = Object.entries(balances).filter(([, v]) => v > 0.01).sort((a, b) => b[1] - a[1]);
  const neg = Object.entries(balances).filter(([, v]) => v < -0.01).sort((a, b) => a[1] - b[1]);
  const p = pos.map(([n, v]) => ({ name: n, val: v }));
  const n = neg.map(([n, v]) => ({ name: n, val: Math.abs(v) }));
  let pi = 0, ni = 0;
  while (pi < p.length && ni < n.length) {
    const amount = Math.min(p[pi].val, n[ni].val);
    settlements.push({ from: n[ni].name, to: p[pi].name, amount: +amount.toFixed(2) });
    p[pi].val -= amount; n[ni].val -= amount;
    if (p[pi].val < 0.01) pi++;
    if (n[ni].val < 0.01) ni++;
  }

  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="es-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="es-container">
        {/* Header */}
        <div className="es-header fade-up">
          <span className="badge badge-emerald">💸 Smart Splitter</span>
          <h1>Expense Splitter</h1>
          <p>Add trip members, log shared expenses, and instantly see who owes whom — zero confusion.</p>
        </div>

        <div className="es-grid">
          {/* Left: Members + Add Expense */}
          <div className="es-left">

            {/* Members */}
            <div className="es-card glass-panel fade-up fade-up-1">
              <h3>👥 Trip Members</h3>
              <div className="es-members">
                {members.map((m, i) => (
                  <div className="es-member-row" key={i}>
                    <input
                      className="form-input es-member-input"
                      placeholder={`Member ${i + 1} name`}
                      value={m}
                      onChange={(e) => updateMember(i, e.target.value)}
                    />
                    {members.length > 2 && (
                      <button className="es-remove-btn" onClick={() => removeMember(i)}>✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn btn-glass es-add-member-btn" onClick={addMember}>
                + Add Member
              </button>
            </div>

            {/* Add Expense */}
            <div className="es-card glass-panel fade-up fade-up-2">
              <h3>➕ Add Expense</h3>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="e.g. Hotel, Dinner, Taxi..." value={expForm.desc} onChange={(e) => setExpForm({ ...expForm, desc: e.target.value })} />
              </div>
              <div className="es-row2">
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="form-input" type="number" placeholder="0.00" value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Paid by</label>
                  <select className="form-input" value={expForm.paidBy} onChange={(e) => setExpForm({ ...expForm, paidBy: e.target.value })}>
                    <option value="">Select</option>
                    {validMembers.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Split with</label>
                <div className="es-split-chips">
                  {validMembers
                    .filter((m) => m !== expForm.paidBy)
                    .map((m) => (
                      <button
                        key={m}
                        className={`es-split-chip ${expForm.splitWith.includes(m) ? "selected" : ""}`}
                        onClick={() => toggleSplit(m)}
                      >
                        {m}
                      </button>
                    ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleAddExpense}>Add Expense</button>
            </div>
          </div>

          {/* Right: Summary + Settlements */}
          <div className="es-right">
            {/* Summary */}
            <div className="es-card glass-panel fade-up fade-up-1">
              <h3>📊 Summary</h3>
              <div className="es-total-row">
                <span>Total Spent</span>
                <strong className="es-total">₹{totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="es-balances">
                {validMembers.map((m) => {
                  const bal = balances[m] || 0;
                  return (
                    <div key={m} className={`es-balance-row ${bal > 0 ? "gets" : bal < 0 ? "owes" : "even"}`}>
                      <span className="es-balance-name">{m}</span>
                      <span className="es-balance-val">
                        {bal > 0 ? `+₹${bal.toFixed(2)} gets back` : bal < 0 ? `-₹${Math.abs(bal).toFixed(2)} owes` : "✓ Settled"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlements */}
            <div className="es-card glass-panel fade-up fade-up-2">
              <h3>🤝 Settlements</h3>
              {settlements.length === 0 ? (
                <p className="es-empty">{expenses.length === 0 ? "Add expenses to see settlements." : "✅ Everyone is settled!"}</p>
              ) : (
                <div className="es-settlements">
                  {settlements.map((s, i) => (
                    <div key={i} className={`es-settlement-row ${settled[i] ? "done" : ""}`}>
                      <div className="es-settlement-info">
                        <strong>{s.from}</strong>
                        <span className="es-arrow">→</span>
                        <strong>{s.to}</strong>
                        <span className="es-amount">₹{s.amount.toFixed(2)}</span>
                      </div>
                      <button
                        className={`es-settle-btn ${settled[i] ? "settled" : ""}`}
                        onClick={() => setSettled((prev) => ({ ...prev, [i]: !prev[i] }))}
                      >
                        {settled[i] ? "✓ Done" : "Mark Paid"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expense Log */}
            {expenses.length > 0 && (
              <div className="es-card glass-panel fade-up fade-up-3">
                <h3>🧾 Expense Log</h3>
                <div className="es-log">
                  {expenses.map((e, i) => (
                    <div key={i} className="es-log-row">
                      <div className="es-log-desc">
                        <span>{e.desc}</span>
                        <span className="es-log-sub">Paid by {e.paidBy} · Split ÷{e.splitWith.length + 1}</span>
                      </div>
                      <span className="es-log-amount">₹{e.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

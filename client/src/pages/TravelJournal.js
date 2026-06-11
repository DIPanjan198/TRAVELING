import { useState, useEffect } from "react";
import "./TravelJournal.css";

const MOODS = ["😄 Amazing", "😊 Good", "😐 Okay", "😔 Tough", "🤩 Epic"];
const STORAGE_KEY = "aerotravel_journal_entries";

export default function TravelJournal() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });
  const [form, setForm] = useState({ title: "", location: "", mood: "", body: "", date: new Date().toISOString().split("T")[0] });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [viewEntry, setViewEntry] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const save = () => {
    if (!form.title || !form.body) { alert("Title and journal entry are required!"); return; }
    const entry = { ...form, id: Date.now(), createdAt: new Date().toLocaleString() };
    setEntries([entry, ...entries]);
    setForm({ title: "", location: "", mood: "", body: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const deleteEntry = (id) => setEntries(entries.filter((e) => e.id !== id));

  const filtered = entries.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase()) ||
           e.location.toLowerCase().includes(search.toLowerCase()) ||
           e.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tj-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="tj-container">
        <div className="tj-header fade-up">
          <span className="badge badge-purple">📔 Personal Diary</span>
          <h1>Travel Journal</h1>
          <p>Chronicle every adventure, mood, and memory from your travels. All entries are saved privately on your device.</p>
        </div>

        {/* Toolbar */}
        <div className="tj-toolbar fade-up fade-up-1">
          <input
            className="form-input tj-search"
            placeholder="🔍 Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setViewEntry(null); }}>
            {showForm ? "✕ Cancel" : "+ New Entry"}
          </button>
        </div>

        {/* New Entry Form */}
        {showForm && (
          <div className="tj-form glass-panel fade-up">
            <h3>✍️ Write New Entry</h3>
            <div className="tj-form-grid">
              <div className="form-group">
                <label className="form-label">📌 Title</label>
                <input className="form-input" placeholder="e.g. Sunrise at Himalayas" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">📍 Location</label>
                <input className="form-input" placeholder="e.g. Manali, India" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">📅 Date</label>
                <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">😊 Mood</label>
              <div className="tj-moods">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    className={`tj-mood-chip ${form.mood === m ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, mood: m })}
                  >{m}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">📝 Journal Entry</label>
              <textarea
                className="form-input tj-textarea"
                placeholder="What happened today? How did it feel? What will you remember forever?"
                rows={6}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" onClick={save}>💾 Save Entry</button>
          </div>
        )}

        {/* View entry modal */}
        {viewEntry && (
          <div className="tj-modal-overlay" onClick={() => setViewEntry(null)}>
            <div className="tj-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <button className="tj-modal-close" onClick={() => setViewEntry(null)}>✕</button>
              <div className="tj-modal-meta">
                <span className="badge badge-purple">{viewEntry.mood || "No mood"}</span>
                <span className="tj-modal-date">{viewEntry.date}</span>
                {viewEntry.location && <span className="tj-modal-loc">📍 {viewEntry.location}</span>}
              </div>
              <h2>{viewEntry.title}</h2>
              <p className="tj-modal-body">{viewEntry.body}</p>
              <span className="tj-modal-created">Created: {viewEntry.createdAt}</span>
            </div>
          </div>
        )}

        {/* Entries grid */}
        {filtered.length === 0 ? (
          <div className="tj-empty glass-panel fade-up">
            <span>📔</span>
            <h3>{entries.length === 0 ? "No journal entries yet" : "No results found"}</h3>
            <p>{entries.length === 0 ? "Start writing your first travel memory!" : "Try a different search term."}</p>
          </div>
        ) : (
          <div className="tj-grid fade-up fade-up-2">
            {filtered.map((e) => (
              <div key={e.id} className="tj-card glass-panel" onClick={() => setViewEntry(e)}>
                <div className="tj-card-top">
                  {e.mood && <span className="tj-card-mood">{e.mood.split(" ")[0]}</span>}
                  <button className="tj-delete-btn" onClick={(ev) => { ev.stopPropagation(); deleteEntry(e.id); }}>🗑</button>
                </div>
                <h4 className="tj-card-title">{e.title}</h4>
                {e.location && <p className="tj-card-loc">📍 {e.location}</p>}
                <p className="tj-card-date">📅 {e.date}</p>
                <p className="tj-card-preview">{e.body.slice(0, 120)}{e.body.length > 120 ? "..." : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

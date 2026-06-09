import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../utils/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          name,
          email,
          password,
          destination,
          budget,
          travelStyle,
          avatar: "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account Created Successfully! Let's sign in. ✅");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed. Try using a different email address.");
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="auth-card glass-panel register-card">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.6.1-2 .5-.3.3-.4.8-.2 1.3l5 3.5-3.5 3.5-3-1-1.5 1.5 4 1 1 4 1.5-1.5-1-3 3.5-3.5 3.5 5c.5.2 1 .1 1.3-.2.4-.4.7-1.1.5-2z"/>
            </svg>
          </div>
          <span>AeroTravel</span>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Join 5,000+ explorers worldwide and find compatible adventure buddies.</p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. wanderer@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dream Destination</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bali, Goa, Paris"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Budget Range</label>
              <select className="form-input" value={budget} onChange={(e) => setBudget(e.target.value)} required>
                <option value="">Select Budget</option>
                <option value="Low">Low Budget</option>
                <option value="Medium">Medium Budget</option>
                <option value="High">High Budget</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Travel Style</label>
              <select className="form-input" value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} required>
                <option value="">Select Vibe</option>
                <option value="Adventure">Adventure</option>
                <option value="Backpacking">Backpacking</option>
                <option value="Luxury">Luxury</option>
                <option value="Family">Family</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? "Creating Profile..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
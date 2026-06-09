import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../utils/api";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Invalid credentials! Double check your email and password.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="auth-card glass-panel">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.6.1-2 .5-.3.3-.4.8-.2 1.3l5 3.5-3.5 3.5-3-1-1.5 1.5 4 1 1 4 1.5-1.5-1-3 3.5-3.5 3.5 5c.5.2 1 .1 1.3-.2.4-.4.7-1.1.5-2z"/>
            </svg>
          </div>
          <span>AeroTravel</span>
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to coordinate with your active travel partners.</p>

        <form onSubmit={handleLogin} className="auth-form">
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
            <div className="form-label-row">
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ color: "var(--primary-light)", fontSize: "0.8rem", textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer-text">
          New to AeroTravel? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

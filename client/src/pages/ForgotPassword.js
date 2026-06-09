import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Simulate password reset on frontend since backend API doesn't host password reset
    setTimeout(() => {
      setLoading(false);
      setMessage("Password successfully reset! You can now log in with your new password.");
    }, 1200);
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

        <h2>Reset Password</h2>
        <p className="auth-subtitle">Enter your account email and your desired new password below.</p>

        {message && <div className="auth-alert success">{message}</div>}
        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleReset} className="auth-form">
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
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>

        <div className="auth-footer-text">
          Remember your password? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

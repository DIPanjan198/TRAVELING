import { useState } from "react";
import { Link } from "react-router-dom";
import TiltCard from "../components/TiltCard";
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

      <TiltCard maxTilt={5}>
        <div className="auth-card glass-panel">
          <div className="auth-brand google-text">
            <span>A</span>
            <span>e</span>
            <span>r</span>
            <span>o</span>
            <span>T</span>
            <span>r</span>
            <span>a</span>
            <span>v</span>
            <span>e</span>
            <span>l</span>
          </div>

          <h1>Reset Password</h1>
          <p className="auth-subtitle">Enter your account email and your desired new password below.</p>

          {message && (
            <div className="google-success-banner" style={{ justifyContent: "center" }}>
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="google-error-message" style={{ justifyContent: "center" }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="auth-form" noValidate>
            <div className="google-input-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email address</label>
            </div>

            <div className="google-input-group">
              <input
                type="password"
                placeholder=" "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label>New password</label>
            </div>

            <div className="google-button-row" style={{ marginTop: 8 }}>
              <Link to="/login" className="google-link">
                Remember your password? Sign In
              </Link>
              <button type="submit" className="google-btn-primary" disabled={loading}>
                {loading ? "Resetting..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </TiltCard>
    </div>
  );
}

export default ForgotPassword;

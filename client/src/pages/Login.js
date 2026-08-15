import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE, fetchWithTimeout, createDemoUser } from "../utils/api";
import TiltCard from "../components/TiltCard";
import "./Auth.css";

function Login() {
  const [step, setStep] = useState(1); // 1 = Email, 2 = Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [animationClass, setAnimationClass] = useState("slide-in-right");

  const navigate = useNavigate();

  const validateEmail = (emailVal) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailVal);
  };

  const handleNextStep = (e) => {
    e?.preventDefault();
    setError(null);
    setIsConnectionError(false);
    setEmailInvalid(false);

    if (!email) {
      setError("Enter an email address");
      setEmailInvalid(true);
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      setEmailInvalid(true);
      return;
    }

    setAnimationClass("slide-in-right");
    setStep(2);
  };

  const handleBackStep = () => {
    setError(null);
    setIsConnectionError(false);
    setAnimationClass("slide-in-left");
    setStep(1);
  };

  const handleDemoLogin = () => {
    const demoUser = createDemoUser(email || "dipanjan2026@gmail.com");
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsConnectionError(false);

    if (!password) {
      setError("Enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }, 10000);

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Wrong password. Try again or click Forgot password to reset it.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setIsConnectionError(true);
      setError("Backend server is offline or waking up. Retry or continue in demo mode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <TiltCard maxTilt={5}>
        <div className="auth-card">
          {/* Playful Google logo style */}
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

          {step === 1 ? (
            <div key="step1" className={`step-container ${animationClass}`}>
              <h1>Sign in</h1>
              <p className="auth-subtitle">to continue to AeroTravel</p>

              <form onSubmit={handleNextStep} className="auth-form" noValidate>
                <div className="google-input-group">
                  <input
                    type="email"
                    className={emailInvalid ? "invalid" : ""}
                    placeholder=" "
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailInvalid) setEmailInvalid(false);
                      if (error) setError(null);
                    }}
                    autoFocus
                    required
                  />
                  <label>Email address</label>
                </div>

                {error && (
                  <div className="google-error-message">
                    <svg className="google-error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="google-button-row">
                  <button
                    type="button"
                    className="google-btn-secondary"
                    onClick={() => navigate("/register")}
                  >
                    Create account
                  </button>
                  <button type="submit" className="google-btn-primary">
                    Next
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div key="step2" className={`step-container ${animationClass}`}>
              <h1>Welcome</h1>
              
              {/* Profile email badge */}
              <div className="google-profile-badge" onClick={handleBackStep} title="Change email">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-3.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                <span className="google-profile-badge-email">{email}</span>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <form onSubmit={handleLogin} className="auth-form" noValidate>
                <div className="google-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={error ? "invalid" : ""}
                    placeholder=" "
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    autoFocus
                    required
                  />
                  <label>Enter your password</label>
                </div>

                {/* Show password check */}
                <div 
                  className="google-checkbox-row" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => {}}
                  />
                  <span>Show password</span>
                </div>

                {error && (
                  <div className="google-error-message" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg className="google-error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                    {isConnectionError && (
                      <button 
                        type="button" 
                        className="demo-fallback-btn" 
                        onClick={handleDemoLogin}
                      >
                        ⚡ Continue as Demo User
                      </button>
                    )}
                  </div>
                )}

                <div className="google-button-row">
                  <Link to="/forgot-password" className="google-link">
                    Forgot password?
                  </Link>
                  <button 
                    type="submit" 
                    className="google-btn-primary" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Next"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </TiltCard>

      {/* Authentic Google page footer */}
      <div className="google-footer">
        <div className="google-footer-left">
          <select defaultValue="en">
            <option value="en">English (United States)</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div className="google-footer-right">
          <Link to="/help">Help</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

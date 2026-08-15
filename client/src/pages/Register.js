import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE, fetchWithTimeout } from "../utils/api";
import TiltCard from "../components/TiltCard";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  // Wizard Step
  const [step, setStep] = useState(1); // 1 = Name/Credentials, 2 = Travel Vibe
  const [animationClass, setAnimationClass] = useState("slide-in-right");

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Field validation visual triggers
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Password strength logic
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "" };
    if (pass.length < 6) return { score: 1, label: "Too Short" };

    let score = 1;
    const hasNumbers = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (hasNumbers) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;

    if (score === 1) return { score: 1, label: "Weak" };
    if (score <= 3) return { score: 2, label: "Medium" };
    return { score: 3, label: "Strong" };
  };

  const strength = calculatePasswordStrength(password);

  const validateEmail = (emailVal) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailVal);
  };

  const handleNextStep = () => {
    setError(null);
    setIsConnectionError(false);
    setEmailInvalid(false);
    setPasswordMismatch(false);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter first and last names");
      return;
    }

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

    if (password.length < 6) {
      setError("Use 6 characters or more for your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Those passwords didn't match. Try again.");
      setPasswordMismatch(true);
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

  const handleDemoRegister = () => {
    const fullName = `${firstName.trim() || "Dipanjan"} ${lastName.trim() || "User"}`;
    const demoUser = {
      _id: "demo_" + Math.random().toString(36).substr(2, 9),
      name: fullName,
      email: email || "dipanjan2026@gmail.com",
      destination: destination || "Goa",
      budget: budget || "Medium",
      travelStyle: travelStyle || "Adventure",
      avatar: ""
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  const handleRegister = async () => {
    setError(null);
    setIsConnectionError(false);

    if (!destination.trim()) {
      setError("Enter your dream destination");
      return;
    }

    if (!budget) {
      setError("Select your travel budget range");
      return;
    }

    if (!travelStyle) {
      setError("Select your travel style preference");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    setLoading(true);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          destination,
          budget,
          travelStyle,
          avatar: "",
        }),
      }, 10000);

      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created successfully! Forwarding you to sign in... ✅");
        setTimeout(() => {
          navigate("/login");
        }, 2200);
      } else {
        setError(data.message || "A user with that email already exists.");
      }
    } catch (err) {
      console.error(err);
      setIsConnectionError(true);
      setError("Server connection failed or waking up. Retry or proceed in demo mode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <TiltCard maxTilt={5}>
        <div className="auth-card register-card">
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

          <h1>Create your AeroTravel Account</h1>
          <p className="auth-subtitle">to connect with adventure buddies worldwide</p>

          {/* Step indicator */}
          <div className="google-step-badge">
            Step {step} of 2
          </div>

          {success && (
            <div className="google-success-banner">
              <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: 18, height: 18 }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="auth-form" noValidate>
            {step === 1 ? (
              <div key="step1" className={`step-container ${animationClass}`}>
                {/* Names row */}
                <div className="form-grid-2">
                  <div className="google-input-group">
                    <input
                      type="text"
                      placeholder=" "
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                    />
                    <label>First name</label>
                  </div>
                  <div className="google-input-group">
                    <input
                      type="text"
                      placeholder=" "
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                    />
                    <label>Last name</label>
                  </div>
                </div>

                {/* Email Address */}
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
                    required
                  />
                  <label>Your email address</label>
                </div>

                {/* Passwords row */}
                <div className="form-grid-2">
                  <div className="google-input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                    />
                    <label>Password</label>
                  </div>
                  <div className="google-input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={passwordMismatch ? "invalid" : ""}
                      placeholder=" "
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordMismatch) setPasswordMismatch(false);
                        if (error) setError(null);
                      }}
                      required
                    />
                    <label>Confirm</label>
                  </div>
                </div>

                {/* Password strength */}
                {password && (
                  <div className="password-strength-container">
                    <div className="strength-label">
                      Password strength:{" "}
                      <span className={
                        strength.score === 1 
                          ? "weak" 
                          : strength.score === 2 
                          ? "medium" 
                          : "strong"
                      }>
                        {strength.label}
                      </span>
                    </div>
                    <div className="strength-bar-bg">
                      <div className={`strength-bar-fill ${
                        strength.score === 1 
                          ? "weak" 
                          : strength.score === 2 
                          ? "medium" 
                          : "strong"
                      }`} />
                    </div>
                  </div>
                )}

                {/* Show Password Toggle */}
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
                    onClick={() => navigate("/login")}
                  >
                    Sign in instead
                  </button>
                  <button
                    type="button"
                    className="google-btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div key="step2" className={`step-container ${animationClass}`}>
                {/* Destination */}
                <div className="google-input-group">
                  <input
                    type="text"
                    placeholder=" "
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                  />
                  <label>Dream destination (e.g. Bali, Paris)</label>
                </div>

                {/* Budget Range */}
                <div className="google-input-group">
                  <select
                    className={budget ? "has-value" : ""}
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                  >
                    <option value=""></option>
                    <option value="Low">Low Budget</option>
                    <option value="Medium">Medium Budget</option>
                    <option value="High">High Budget</option>
                  </select>
                  <label>Budget range</label>
                </div>

                {/* Travel Vibe Style */}
                <div className="google-input-group">
                  <select
                    className={travelStyle ? "has-value" : ""}
                    value={travelStyle}
                    onChange={(e) => {
                      setTravelStyle(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                  >
                    <option value=""></option>
                    <option value="Adventure">Adventure</option>
                    <option value="Backpacking">Backpacking</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Family">Family</option>
                  </select>
                  <label>Travel vibe style</label>
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
                        onClick={handleDemoRegister}
                      >
                        ⚡ Continue as Demo User
                      </button>
                    )}
                  </div>
                )}

                <div className="google-button-row">
                  <button
                    type="button"
                    className="google-btn-secondary"
                    onClick={handleBackStep}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="google-btn-primary"
                    onClick={handleRegister}
                    disabled={loading || success !== null}
                  >
                    {loading ? "Creating..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </TiltCard>

      {/* Google page footer */}
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

export default Register;
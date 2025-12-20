import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // keep your existing styles

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ FIXED: handleLogin properly defined
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Login failed");
        return;
      }

      // ✅ FIX: consume response without unused variable
      await res.json();

      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } catch (error) {
      alert("❌ Backend not running. Please start server.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ✅ FORGOT PASSWORD (WORKING) */}
          <p
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;





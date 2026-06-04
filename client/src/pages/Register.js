import "./Register.css";
import "./Auth.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://traveling-2.onrender.com/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            destination,
            budget,
            travelStyle,

           avatar:
           `https://i.pravatar.cc/300?u=${email}`
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      if (res.ok) {
        alert("Registration Successful ✅");

        navigate("/login");
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <h2>Create Account ✨</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
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

          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) =>
              setDestination(e.target.value)
            }
          />

          <div className="select-container">
            <select
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
            >
              <option value="">
                Select Budget
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>

            <select
              value={travelStyle}
              onChange={(e) =>
                setTravelStyle(e.target.value)
              }
            >
              <option value="">
                Travel Style
              </option>

              <option value="Adventure">
                Adventure
              </option>

              <option value="Backpacking">
                Backpacking
              </option>

              <option value="Luxury">
                Luxury
              </option>

              <option value="Family">
                Family
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Register
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
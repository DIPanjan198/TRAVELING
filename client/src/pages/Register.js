import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState("");
const [budget, setBudget] = useState("");
const [travelStyle, setTravelStyle] = useState("");
  const navigate = useNavigate();
const handleRegister = async (e) => {

  e.preventDefault();

  try {

    const res = await fetch(
      "https://traveling-1-41nr.onrender.com/api/match-users",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          name,
          email,
          password,
          destination,
          budget,
          travelStyle

        })

      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {

      alert("Registration Successful");

      navigate("/login");

    }

    else {

      alert(data.message);

    }

  }

  catch (err) {

    console.log(err);

    alert("Server Error");

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
  onChange={(e) => setDestination(e.target.value)}
/>
<div className="select-container">
  <select
  id="budget"
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
>
  <option value="">Select Budget</option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>

<select
id="travelStyle"
  value={travelStyle}
  onChange={(e) => setTravelStyle(e.target.value)}
>
  <option value="">Travel Style</option>
  <option value="Adventure">Adventure</option>
  <option value="Backpacking">Backpacking</option>
  <option value="Luxury">Luxury</option>
  <option value="Family">Family</option>
</select>
</div>

          <button type="submit" className="primary-btn">
            Register
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;




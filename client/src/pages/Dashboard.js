import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const comingSoon = () => {
    alert("🚧 Feature coming soon!");
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <h2>
          Welcome to <span>TravelBuddy</span> ✈️
        </h2>

        <p className="subtitle">You are logged in successfully</p>

        <div className="dashboard-actions">
          
          <button
            className="dash-btn"
            onClick={() => navigate("/find-buddies")}
          >
            🌍 Find Travel Buddies
          </button>

          <button
             className="dash-btn"
            onClick={() => navigate("/explore")}
          >
           🗺️ Explore Destinations
            </button>


          <button className="dash-btn disabled" onClick={comingSoon}>
            💬 Chat (Coming Soon)
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;




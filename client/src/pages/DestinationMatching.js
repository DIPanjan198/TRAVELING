import "./DestinationMatching.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const DestinationMatching = () => {
    const navigate = useNavigate();
  const currentUser = {
    name: "Avijit",
    destination: "Goa",
  };

  const travelers = [
    {
      id: 1,
      name: "Rahul",
      destination: "Goa",
      travelStyle: "Adventure",
      budget: "Medium",
    },
    {
      id: 2,
      name: "Priya",
      destination: "Manali",
      travelStyle: "Luxury",
      budget: "High",
    },
    {
      id: 3,
      name: "Amit",
      destination: "Goa",
      travelStyle: "Backpacking",
      budget: "Low",
    },
    {
      id: 4,
      name: "Sara",
      destination: "Goa",
      travelStyle: "Adventure",
      budget: "Medium",
    },
  ];

  const matchedTravelers = travelers.filter(
    (traveler) =>
      traveler.destination.toLowerCase() ===
        currentUser.destination.toLowerCase() &&
      traveler.name !== currentUser.name
  );

  return (
    <div className="destination-container">
      <h2>🌍 Destination Matching</h2>

      <p>
        Your Destination: <strong>{currentUser.destination}</strong>
      </p>

      {matchedTravelers.length > 0 ? (
        <div className="travelers-grid">
          {matchedTravelers.map((traveler) => (
            <div className="traveler-card" key={traveler.id}>
              <h3>{traveler.name}</h3>
              <p>📍 {traveler.destination}</p>
              <p>🎒 {traveler.travelStyle}</p>
              <p>💰 {traveler.budget}</p>

              <button className="connect-btn"
               onClick={() => navigate(`pages/chat/${traveler.id}`)}
               >
                Connect
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No travelers found for this destination.</p>
      )}
    </div>
  );
};

export default DestinationMatching;
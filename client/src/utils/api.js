// AeroTravel Shared API Client Configuration - Updated for traveling-4.onrender.com
export const API_BASE = process.env.REACT_APP_API_URL 
  || (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://traveling-4.onrender.com");

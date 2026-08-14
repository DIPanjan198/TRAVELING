// AeroTravel Shared API Client Configuration - Updated for traveling-4.onrender.com
export const API_BASE = process.env.REACT_APP_API_URL 
  || (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://traveling-4.onrender.com");

/**
 * Fetch wrapper with configurable timeout (default 12s) to handle Render backend spin-up delays gracefully
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Create a demo user session for offline / backend-unavailable fallback
 */
export function createDemoUser(email = "dipanjan2026@gmail.com") {
  const username = email ? email.split("@")[0] : "Dipanjan";
  const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
  
  return {
    _id: "demo_" + Math.random().toString(36).substr(2, 9),
    name: formattedName || "Dipanjan Explorer",
    email: email || "dipanjan2026@gmail.com",
    destination: "Goa",
    budget: "Medium",
    travelStyle: "Adventure",
    avatar: ""
  };
}


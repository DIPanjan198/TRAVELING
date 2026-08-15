// AeroTravel Shared API Client Configuration - Updated for traveling-4.onrender.com
export const API_BASE = process.env.REACT_APP_API_URL 
  || (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://traveling-4.onrender.com");

/**
 * Fetch wrapper with configurable timeout (default 40s) to handle Render/Railway backend spin-up delays gracefully
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 40000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    try {
      controller.abort(new DOMException("Request timed out", "TimeoutError"));
    } catch (e) {
      controller.abort();
    }
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err) {
    if (err.name === "AbortError" || err.name === "TimeoutError" || err.message?.includes("aborted")) {
      const customErr = new Error("Server connection timed out or waking up. Please retry or continue in demo mode.");
      customErr.name = "TimeoutError";
      customErr.isTimeout = true;
      throw customErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Create a demo user session for offline / backend-unavailable fallback
 */
export function createDemoUser(customData = {}) {
  const email = typeof customData === "string" ? customData : (customData.email || "dipanjan2026@gmail.com");
  const username = email ? email.split("@")[0] : "Dipanjan";
  const formattedName = customData.name || (username.charAt(0).toUpperCase() + username.slice(1) + " Explorer");
  
  return {
    _id: "demo_" + Math.random().toString(36).substr(2, 9),
    name: formattedName,
    email: email || "dipanjan2026@gmail.com",
    destination: customData.destination || "Manali",
    budget: customData.budget || "Low",
    travelStyle: customData.travelStyle || "Adventure",
    avatar: customData.avatar || ""
  };
}



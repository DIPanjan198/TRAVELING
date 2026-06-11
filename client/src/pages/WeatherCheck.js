import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WeatherCheck.css";

/* Uses Open-Meteo (free, no API key) + Open-Meteo geocoding */
const WMO_CODES = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Icy Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Moderate Drizzle", icon: "🌦️" },
  55: { label: "Heavy Drizzle", icon: "🌧️" },
  61: { label: "Light Rain", icon: "🌧️" },
  63: { label: "Moderate Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  71: { label: "Light Snow", icon: "🌨️" },
  73: { label: "Moderate Snow", icon: "❄️" },
  75: { label: "Heavy Snow", icon: "❄️" },
  80: { label: "Light Showers", icon: "🌦️" },
  81: { label: "Moderate Showers", icon: "🌧️" },
  82: { label: "Violent Showers", icon: "⛈️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  99: { label: "Heavy Thunderstorm", icon: "⛈️" },
};

const POPULAR_CITIES = [
  { name: "Goa", country: "India" },
  { name: "Bali", country: "Indonesia" },
  { name: "Bangkok", country: "Thailand" },
  { name: "Paris", country: "France" },
  { name: "Tokyo", country: "Japan" },
  { name: "Dubai", country: "UAE" },
  { name: "Singapore", country: "Singapore" },
  { name: "London", country: "UK" },
  { name: "New York", country: "USA" },
  { name: "Manali", country: "India" },
];

export default function WeatherCheck() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    const q = cityName || city;
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      // Geocode city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error("City not found. Try another name.");

      const { latitude, longitude, name, country } = geoData.results[0];

      // Fetch weather
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto&forecast_days=5`
      );
      const wData = await wRes.json();
      setWeather({ ...wData, cityName: name, countryName: country, lat: latitude, lon: longitude });
    } catch (err) {
      setError(err.message || "Failed to fetch weather. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const curr = weather?.current;
  const daily = weather?.daily;
  const wCode = curr ? (WMO_CODES[curr.weathercode] || { label: "Unknown", icon: "🌡️" }) : null;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="wc-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />
      <div className="wc-container">
        <div className="wc-header fade-up">
          <span className="badge badge-indigo">🌤️ Live Weather</span>
          <h1>Weather Check</h1>
          <p>Check real-time weather for any destination before you pack your bags. Powered by Open-Meteo.</p>
        </div>

        {/* Quick cities */}
        <div className="wc-quick fade-up fade-up-1">
          <p className="wc-label">Popular Destinations</p>
          <div className="wc-cities">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                className={`wc-city-chip glass-panel ${city === c.name ? "selected" : ""}`}
                onClick={() => { setCity(c.name); fetchWeather(c.name); }}
              >
                {c.name}
                <span>{c.country}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="wc-search-row fade-up fade-up-2">
          <input
            className="form-input wc-input"
            placeholder="Search any city... e.g. Kolkata, Amsterdam"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button className="btn btn-primary wc-btn" onClick={() => fetchWeather()} disabled={loading}>
            {loading ? <span className="atp-spinner" /> : "🔍 Check Weather"}
          </button>
        </div>

        {error && <div className="auth-alert error fade-up">{error}</div>}

        {/* Current weather */}
        {weather && (
          <>
            <div className="wc-main glass-panel fade-up">
              <div className="wc-city-name">
                <h2>{weather.cityName}, {weather.countryName}</h2>
                <span className="wc-coords">{weather.lat.toFixed(2)}°N {weather.lon.toFixed(2)}°E</span>
              </div>
              <div className="wc-current">
                <div className="wc-icon-big">{wCode.icon}</div>
                <div className="wc-temp-block">
                  <div className="wc-temp">{Math.round(curr.temperature_2m)}°C</div>
                  <div className="wc-feels">Feels like {Math.round(curr.apparent_temperature)}°C</div>
                  <div className="wc-desc">{wCode.label}</div>
                </div>
              </div>
              <div className="wc-stats">
                <div className="wc-stat">💧 <strong>{curr.relative_humidity_2m}%</strong><span>Humidity</span></div>
                <div className="wc-stat">💨 <strong>{curr.wind_speed_10m} km/h</strong><span>Wind</span></div>
                <div className="wc-stat">🌡️ <strong>{Math.round(daily?.temperature_2m_max?.[0])}° / {Math.round(daily?.temperature_2m_min?.[0])}°</strong><span>High / Low</span></div>
                <div className="wc-stat">🌧️ <strong>{daily?.precipitation_sum?.[0] ?? 0} mm</strong><span>Precipitation</span></div>
              </div>
            </div>

            {/* 5-day forecast */}
            {daily && (
              <div className="wc-forecast fade-up">
                <p className="wc-label">5-Day Forecast</p>
                <div className="wc-forecast-grid">
                  {daily.time.slice(0, 5).map((date, i) => {
                    const code = WMO_CODES[daily.weathercode[i]] || { icon: "🌡️", label: "" };
                    const d = new Date(date);
                    return (
                      <div key={date} className="wc-forecast-card glass-panel">
                        <span className="wc-fc-day">{i === 0 ? "Today" : days[d.getDay()]}</span>
                        <span className="wc-fc-icon">{code.icon}</span>
                        <span className="wc-fc-desc">{code.label}</span>
                        <span className="wc-fc-temps">{Math.round(daily.temperature_2m_max[i])}° / {Math.round(daily.temperature_2m_min[i])}°</span>
                        {daily.precipitation_sum[i] > 0 && <span className="wc-fc-rain">💧 {daily.precipitation_sum[i]}mm</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="wc-cta glass-panel fade-up">
              <p>Planning a trip to <strong>{weather.cityName}</strong>? Find travel buddies heading there!</p>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>Find Travel Buddies →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

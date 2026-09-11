import { useEffect, useState } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit

  useEffect(() => {
    // Phase 1: logo animates in (0–900ms)
    // Phase 2: hold for a moment (900–2200ms)
    const holdTimer = setTimeout(() => setPhase("exit"), 2200);

    // Phase 3: fade out (2200–2900ms), then unmount
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2900);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-root splash-${phase}`} aria-hidden="true">
      {/* Animated particle field */}
      <div className="splash-particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="splash-particle" style={{ "--i": i }} />
        ))}
      </div>

      {/* Glowing ring */}
      <div className="splash-ring splash-ring-outer" />
      <div className="splash-ring splash-ring-inner" />

      {/* Core logo card */}
      <div className="splash-card">
        <div className="splash-logo-wrap">
          <img
            src="/logo.jpg"
            alt="AeroTravel logo"
            className="splash-logo-img"
            draggable={false}
          />
          <div className="splash-logo-glow" />
        </div>

        <div className="splash-text-wrap">
          <h1 className="splash-brand">
            Aero<span className="splash-brand-accent">Travel</span>
          </h1>
          <p className="splash-tagline">Your next adventure begins here</p>
        </div>

        {/* Progress bar */}
        <div className="splash-progress-track">
          <div className="splash-progress-bar" />
        </div>
      </div>
    </div>
  );
}

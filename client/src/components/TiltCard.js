import React, { useRef, useState, useEffect } from "react";
import "./TiltCard.css";

function TiltCard({ children, className = "", maxTilt = 8, disabled = false, style = {}, onClick }) {
  const outerRef = useRef(null);
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const rafId = useRef(null);
  const isFinePointer = useRef(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    isFinePointer.current = mediaQuery.matches;

    const handler = (e) => {
      isFinePointer.current = e.matches;
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (disabled || !isFinePointer.current || !outerRef.current || !cardRef.current) return;
    if (e.pointerType === "touch" || e.sourceCapabilities?.firesTouchEvents) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafId.current = requestAnimationFrame(() => {
      const outerEl = outerRef.current;
      const cardEl = cardRef.current;
      if (!outerEl || !cardEl) return;

      // Measure the UNTRANSFORMED outer container to prevent bounding-box shift feedback loop!
      const rect = outerEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const px = Math.min(Math.max(x / rect.width, 0), 1);
      const py = Math.min(Math.max(y / rect.height, 0), 1);

      // Convert 0..1 to tilt degrees (-maxTilt..+maxTilt)
      const rx = ((0.5 - py) * (maxTilt * 2)).toFixed(2);
      const ry = ((px - 0.5) * (maxTilt * 2)).toFixed(2);

      const mx = (px * 100).toFixed(1);
      const my = (py * 100).toFixed(1);

      cardEl.style.setProperty("--rx", `${rx}deg`);
      cardEl.style.setProperty("--ry", `${ry}deg`);
      cardEl.style.setProperty("--mx", `${mx}%`);
      cardEl.style.setProperty("--my", `${my}%`);
    });
  };

  const handleMouseEnter = (e) => {
    if (disabled || !isFinePointer.current || e.pointerType === "touch") return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    setIsHovering(false);

    const cardEl = cardRef.current;
    if (cardEl) {
      cardEl.style.setProperty("--rx", "0deg");
      cardEl.style.setProperty("--ry", "0deg");
      cardEl.style.setProperty("--mx", "50%");
      cardEl.style.setProperty("--my", "50%");
    }
  };

  const handleTouchStart = () => {
    handleMouseLeave();
  };

  return (
    <div
      ref={outerRef}
      className="tilt-card-perspective"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div
        ref={cardRef}
        className={`tilt-card-container ${isHovering ? "is-hovering" : ""} ${className}`}
        style={style}
        onClick={onClick}
      >
        <div className="tilt-card-glare" />
        {children}
      </div>
    </div>
  );
}

export default TiltCard;

import React, { useRef, useState, useEffect } from "react";
import "./ScrollReveal.css";

function ScrollReveal({ children, className = "", delay = 0, style = {} }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const customStyle = {
    ...style,
    transitionDelay: delay ? `${delay}ms` : undefined,
  };

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal-container ${isRevealed ? "is-revealed" : ""} ${className}`}
      style={customStyle}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const rotationDegrees = (scrollY * 1.2) % 360;
        setRotation(rotationDegrees);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Link to="/" className="flex items-center gap-2 group cursor-pointer z-50">
      <div style={{ perspective: "1000px" }}>
        <svg
          viewBox="0 0 100 100"
          className="w-7 h-7 rounded-[4px] transition-transform group-hover:scale-110 duration-300 will-change-transform"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: `rotateZ(${rotation}deg)`,
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
          }}
        >
          <rect width="100" height="100" fill="#FF5C00" />
          <polygon points="50,15 80.3,68 19.7,68" fill="#1A1C1E" />
          <polygon points="16.9,73 83.1,73 90,85 10,85" fill="#1A1C1E" />
        </svg>
      </div>
      <span className="font-['DM_Sans'] font-semibold text-[15px] tracking-[0.1em] text-foreground transition-colors group-hover:text-primary">ARERA</span>
    </Link>
  );
};

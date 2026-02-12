"use client";

import { useEffect, useRef } from "react";

const HEARTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: ((i * 17 + 7) % 95) + 2,
  delay: ((i * 23 + 11) % 150) / 10,
  duration: 15 + ((i * 37 + 13) % 20),
  size: 10 + ((i * 41 + 19) % 20),
  opacity: 0.05 + ((i * 29 + 5) % 15) / 100,
}));

export default function FloatingHearts() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hearts are pure CSS animation, no JS needed after render
    return;
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
    >
      {HEARTS.map((heart) => (
        <div
          key={heart.id}
          className="absolute heart-float"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
          }}
        >
          ♥
        </div>
      ))}
    </div>
  );
}

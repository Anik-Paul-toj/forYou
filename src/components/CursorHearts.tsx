"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export default function CursorHearts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const throttle = useRef(false);

  const spawnHeart = useCallback((x: number, y: number) => {
    if (!containerRef.current) return;

    const heart = document.createElement("div");
    heart.innerHTML = "♥";
    heart.className = "fixed pointer-events-none z-[9999] text-rose-500";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${Math.random() * 14 + 8}px`;

    containerRef.current.appendChild(heart);

    gsap.to(heart, {
      y: -(Math.random() * 60 + 30),
      x: (Math.random() - 0.5) * 40,
      opacity: 0,
      scale: Math.random() * 0.5 + 0.5,
      rotation: (Math.random() - 0.5) * 60,
      duration: Math.random() * 0.8 + 0.6,
      ease: "power2.out",
      onComplete: () => heart.remove(),
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      lastPos.current = { x: e.clientX, y: e.clientY };

      // Only spawn if mouse moved enough and not throttled
      if (distance < 8 || throttle.current) return;

      throttle.current = true;
      setTimeout(() => {
        throttle.current = false;
      }, 60);

      spawnHeart(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const dx = touch.clientX - lastPos.current.x;
      const dy = touch.clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      lastPos.current = { x: touch.clientX, y: touch.clientY };

      if (distance < 8 || throttle.current) return;

      throttle.current = true;
      setTimeout(() => {
        throttle.current = false;
      }, 80);

      spawnHeart(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [spawnHeart]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
}

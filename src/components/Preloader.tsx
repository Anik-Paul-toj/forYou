"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !heartRef.current || !textRef.current || !progressRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setShow(false),
    });

    // Heart pulse
    gsap.to(heartRef.current, {
      scale: 1.2,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Progress bar fills
    tl.to(progressRef.current, {
      width: "100%",
      duration: 1.8,
      ease: "power2.inOut",
    });

    // Text fades in
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.3
    );

    // Exit animation
    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.4 }, "+=0.3");
    tl.to(heartRef.current, { scale: 30, opacity: 0, duration: 0.8, ease: "power2.in" }, "-=0.2");
    tl.to(overlayRef.current, { opacity: 0, duration: 0.4 }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#0d0608" }}
    >
      {/* Heart */}
      <div
        ref={heartRef}
        className="text-rose-500 mb-8"
        style={{ fontSize: "4rem", lineHeight: 1 }}
      >
        &#9829;
      </div>

      {/* Loading text */}
      <div
        ref={textRef}
        className="text-rose-300/70 text-sm tracking-[0.3em] uppercase mb-6 opacity-0"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        Loading our story...
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-rose-900/30 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full"
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
}

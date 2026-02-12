"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEART_SYMBOLS = ["♥", "♡", "❤"];

export default function RisingHeartsWall() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const isVisible = useRef(false);

  const spawnHeart = useCallback(() => {
    if (!wallRef.current || !isVisible.current) return;

    const heart = document.createElement("div");
    const symbol = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
    const size = Math.random() * 32 + 20;
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 150;
    const duration = Math.random() * 3 + 4;
    const targetOpacity = Math.random() * 0.5 + 0.4;

    heart.textContent = symbol;
    heart.style.cssText = `
      position: absolute;
      bottom: -20px;
      left: ${startX}%;
      font-size: ${size}px;
      color: rgba(244, 63, 94, ${targetOpacity});
      pointer-events: none;
      user-select: none;
      will-change: transform, opacity;
    `;

    wallRef.current.appendChild(heart);

    // Single timeline — no conflicting tweens
    const tl = gsap.timeline({
      onComplete: () => heart.remove(),
    });

    tl.fromTo(
      heart,
      { opacity: 0, scale: 0.3, y: 0 },
      {
        opacity: targetOpacity,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.5)",
      }
    ).to(
      heart,
      {
        y: -(window.innerHeight + 50),
        x: drift,
        rotation: (Math.random() - 0.5) * 90,
        duration: duration,
        ease: "none",
      },
      0.2
    ).to(
      heart,
      {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        ease: "power2.in",
      },
      `-=2`
    );
  }, []);

  useEffect(() => {
    // Track visibility with ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => { isVisible.current = true; },
      onLeave: () => { isVisible.current = false; },
      onEnterBack: () => { isVisible.current = true; },
      onLeaveBack: () => { isVisible.current = false; },
    });

    // Spawn loop
    let lastSpawn = 0;
    const tick = (time: number) => {
      if (isVisible.current && time - lastSpawn > 120) {
        spawnHeart();
        lastSpawn = time;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      st.kill();
      if (wallRef.current) {
        wallRef.current.innerHTML = "";
      }
    };
  }, [spawnHeart]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "70vh" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#180a10] to-[#0d0608]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.06)_0%,_transparent_60%)]" />

      {/* Hearts container */}
      <div ref={wallRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center py-24 md:py-36">
        <p
          className="text-rose-400 text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-6"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          My Heart Overflows
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-rose-500/20"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          ♥
        </h2>
        <p
          className="text-rose-200/60 text-base md:text-lg mt-6 max-w-md"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          Every heartbeat is for you
        </p>
      </div>
    </section>
  );
}

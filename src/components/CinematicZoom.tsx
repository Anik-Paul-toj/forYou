"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pre-computed particle positions to avoid hydration mismatch from Math.random()
const SPARKLES = Array.from({ length: 30 }, (_, i) => ({
  left: ((i * 31 + 17) % 97) + 1,
  top: ((i * 47 + 11) % 93) + 2,
  duration: 2 + (((i * 43 + 23) % 50) / 10),
  delay: ((i * 37 + 13) % 40) / 10,
}));

export default function CinematicZoom() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !heartRef.current ||
      !text1Ref.current ||
      !text2Ref.current ||
      !text3Ref.current ||
      !glowRef.current
    )
      return;

    // Single timeline driven by a single ScrollTrigger — no conflicts
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Phase 1: Glow appears (0 → 2)
    tl.fromTo(
      glowRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 3, opacity: 0.3, duration: 2, ease: "none" }
    );

    // Phase 2: Heart zooms from tiny to massive (0 → 4)
    tl.fromTo(
      heartRef.current,
      { scale: 0.1, opacity: 0 },
      { scale: 15, opacity: 0.15, duration: 4, ease: "none" },
      0
    );

    // Phase 3: "You're" appears (2 → 4)
    tl.fromTo(
      text1Ref.current,
      { scale: 0, opacity: 0, y: 60 },
      { scale: 1, opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      2
    );

    // "You're" holds (4 → 5) then zooms away (5 → 7)
    tl.to(
      text1Ref.current,
      { scale: 4, opacity: 0, filter: "blur(8px)", duration: 2, ease: "power2.in" },
      5
    );

    // Phase 4: "My" appears (6 → 8)
    tl.fromTo(
      text2Ref.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: "power2.out" },
      6
    );

    // "My" holds (8 → 9) then zooms away (9 → 11)
    tl.to(
      text2Ref.current,
      { scale: 4, opacity: 0, filter: "blur(8px)", duration: 2, ease: "power2.in" },
      9
    );

    // Heart fades out (8 → 10)
    tl.to(heartRef.current, { opacity: 0, duration: 2, ease: "none" }, 8);

    // Phase 5: "Everything" appears (10 → 13)
    tl.fromTo(
      text3Ref.current,
      { scale: 0, opacity: 0, letterSpacing: "0.4em" },
      { scale: 1, opacity: 1, letterSpacing: "0.05em", duration: 3, ease: "power2.out" },
      10
    );

    // "Everything" glow (13 → 15)
    tl.to(
      text3Ref.current,
      {
        textShadow:
          "0 0 60px rgba(244,63,94,0.8), 0 0 120px rgba(244,63,94,0.4)",
        duration: 2,
        ease: "none",
      },
      13
    );

    // "Everything" fades away at end (15 → 16)
    tl.to(
      text3Ref.current,
      { opacity: 0, scale: 1.5, duration: 1, ease: "power2.in" },
      15
    );

    // Glow fades (14 → 16)
    tl.to(glowRef.current, { opacity: 0, duration: 2, ease: "none" }, 14);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a12] to-[#0d0608]" />

        {/* Radial glow */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)",
          }}
        />

        {/* Giant heart */}
        <div
          ref={heartRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500/20 pointer-events-none opacity-0 will-change-transform"
        >
          <span className="text-[10rem] leading-none">&#9829;</span>
        </div>

        {/* Text layers */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div
            ref={text1Ref}
            className="absolute text-6xl md:text-8xl lg:text-9xl font-bold text-white opacity-0 will-change-transform"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            You&apos;re
          </div>

          <div
            ref={text2Ref}
            className="absolute text-6xl md:text-8xl lg:text-9xl font-bold text-rose-300 opacity-0 will-change-transform"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            My
          </div>

          <div
            ref={text3Ref}
            className="absolute text-5xl md:text-7xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 opacity-0 will-change-transform"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Everything
          </div>
        </div>

        {/* Corner sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {SPARKLES.map((s, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-rose-300/40"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                animation: `sparkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

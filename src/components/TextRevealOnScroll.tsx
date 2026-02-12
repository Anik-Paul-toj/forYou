"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Every moment with you feels like a beautiful dream I never want to wake up from.",
  "You are my today, my tomorrow, and my forever.",
];

export default function TextRevealOnScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading: scale from huge to normal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { scale: 2.5, opacity: 0, filter: "blur(15px)" },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Each line's words reveal with stagger
      linesRef.current.forEach((lineEl, lineIndex) => {
        if (!lineEl) return;
        const wordEls = lineEl.querySelectorAll(".reveal-word");

        gsap.fromTo(
          wordEls,
          {
            opacity: 0.06,
            y: 30,
            filter: "blur(6px)",
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: lineEl,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            delay: lineIndex * 0.3,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-44 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0812] to-[#0d0608]" />

      {/* Decorative giant heart */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[18rem] sm:text-[25rem] md:text-[35rem] text-rose-500/[0.02] leading-none select-none">
          ♥
        </span>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,_rgba(244,63,94,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 opacity-0">
          <p
            className="text-rose-400 text-lg md:text-xl tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            A Love Letter in Motion
          </p>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Feel Every Word
          </h2>
        </div>

        {/* Text lines */}
        {LINES.map((line, lineIndex) => (
          <div
            key={lineIndex}
            ref={(el) => {
              linesRef.current[lineIndex] = el;
            }}
            className="mb-10"
          >
            <p
              className="text-xl md:text-3xl lg:text-4xl text-rose-100/90 leading-relaxed md:leading-relaxed font-light"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {line.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="reveal-word inline-block mr-[0.3em] opacity-[0.06]"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUOTE = "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.";
const ATTRIBUTION = "— Maya Angelou";

export default function ParallaxQuote() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const attributionRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const words = QUOTE.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each word reveals on scroll
      wordsRef.current.forEach((word, index) => {
        if (!word) return;

        gsap.fromTo(
          word,
          {
            opacity: 0.08,
            y: 20,
            filter: "blur(4px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${index * 18} 60%`,
              end: () => `top+=${index * 18 + 80} 40%`,
              scrub: 1,
            },
          }
        );
      });

      // Decorative line grows
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }

      // Attribution
      if (attributionRef.current) {
        gsap.fromTo(
          attributionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: attributionRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [words.length]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0812] to-[#0d0608]" />

      {/* Large decorative heart watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[15rem] sm:text-[20rem] md:text-[28rem] text-rose-500/[0.03] leading-none select-none">
          ♥
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Decorative line top */}
        <div
          ref={lineRef}
          className="w-32 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent mx-auto mb-16 origin-center"
        />

        {/* Quote - word by word */}
        <blockquote className="mb-12">
          <p
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-relaxed md:leading-relaxed"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="inline-block mr-[0.3em] opacity-[0.08]"
              >
                {word}
              </span>
            ))}
          </p>
        </blockquote>

        {/* Attribution */}
        <p
          ref={attributionRef}
          className="text-rose-300/50 text-lg tracking-wider opacity-0"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          {ATTRIBUTION}
        </p>
      </div>
    </section>
  );
}

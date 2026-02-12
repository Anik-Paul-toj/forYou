"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Mail } from "lucide-react";
import { siteData } from "../data/siteData";

gsap.registerPlugin(ScrollTrigger);

export default function LoveLetter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  const [isOpened, setIsOpened] = useState(false);
  const { letter } = siteData;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        envelopeRef.current,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: envelopeRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openLetter = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);

    const tl = gsap.timeline();

    // Envelope flap opens
    const flap = envelopeRef.current?.querySelector(".envelope-flap");
    if (flap) {
      tl.to(flap, {
        rotateX: 180,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }

    // Envelope fades and letter emerges
    tl.to(
      envelopeRef.current,
      {
        opacity: 0,
        y: -30,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in",
      },
      "+=0.2"
    );

    // Show letter
    tl.fromTo(
      letterRef.current,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
          if (letterRef.current) {
            letterRef.current.style.display = "block";
          }
        },
      },
      "-=0.2"
    );

    // Stagger paragraphs
    tl.fromTo(
      paragraphsRef.current.filter(Boolean),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.3,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Closing and signature
    tl.fromTo(
      closingRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.1"
    );

    // Final message
    tl.fromTo(
      finalRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.5)",
      },
      "+=0.3"
    );
  }, [isOpened]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#150a0e]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Section heading */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <p
            className="text-rose-400 text-lg mb-3 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            The Grand Finale
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            A Letter For You
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Envelope */}
        <div
          ref={envelopeRef}
          onClick={openLetter}
          className={`relative mx-auto w-64 sm:w-72 h-44 sm:h-48 md:w-96 md:h-64 cursor-pointer opacity-0 ${
            isOpened ? "pointer-events-none" : ""
          }`}
          style={{ perspective: "800px" }}
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-800 to-rose-900 rounded-xl border border-rose-700/50 shadow-2xl shadow-rose-900/50 overflow-hidden">
            {/* Envelope V shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Mail className="w-16 h-16 md:w-20 md:h-20 text-rose-400/40" />
            </div>
            <p className="absolute bottom-4 w-full text-center text-rose-300/50 text-sm">
              Click to open
            </p>
          </div>

          {/* Envelope flap */}
          <div
            className="envelope-flap absolute -top-0.5 left-0 right-0 h-1/2 bg-gradient-to-b from-rose-700 to-rose-800 rounded-t-xl border border-rose-600/40 origin-top"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* Letter content */}
        <div
          ref={letterRef}
          className="hidden opacity-0"
        >
          <div className="bg-gradient-to-b from-[#fef3e2] to-[#fde8c8] rounded-2xl p-8 md:p-12 shadow-2xl shadow-rose-900/30 border border-amber-200/30">
            {/* Greeting */}
            <h3
              className="text-2xl md:text-3xl text-rose-800 mb-8"
              style={{ fontFamily: "var(--font-dancing)" }}
            >
              {letter.greeting}
            </h3>

            {/* Paragraphs */}
            <div className="space-y-5">
              {letter.paragraphs.map((text, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    paragraphsRef.current[i] = el;
                  }}
                  className="text-rose-900/80 leading-relaxed text-sm md:text-base opacity-0"
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Closing */}
            <div ref={closingRef} className="mt-10 opacity-0">
              <p
                className="text-rose-800 text-xl mb-1"
                style={{ fontFamily: "var(--font-dancing)" }}
              >
                {letter.closing}
              </p>
              <p
                className="text-rose-700 text-2xl"
                style={{ fontFamily: "var(--font-dancing)" }}
              >
                {letter.signature}
              </p>
            </div>
          </div>

          {/* Final message */}
          <div ref={finalRef} className="text-center mt-16 opacity-0">
            <Heart
              className="w-12 h-12 text-rose-500 mx-auto mb-6 animate-pulse"
              fill="currentColor"
            />
            <p
              className="text-2xl md:text-3xl text-white font-bold mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {letter.finalMessage}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className="w-5 h-5 text-rose-500/60"
                  fill="currentColor"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

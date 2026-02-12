"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Heart, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { siteData } from "../../data/siteData";

const GRADIENTS = [
  "from-rose-600 to-pink-500",
  "from-pink-600 to-fuchsia-500",
  "from-red-600 to-rose-500",
  "from-fuchsia-600 to-purple-500",
  "from-rose-500 to-red-500",
  "from-pink-500 to-rose-400",
];

export default function ReasonsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const reasons = siteData.reasons;
  const total = reasons.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headingRef.current,
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 }
      );

      tl.fromTo(
        deckRef.current,
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const flipCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isFlipped, isAnimating]);

  const nextCard = useCallback(() => {
    if (isAnimating || currentIndex >= total - 1) return;
    setIsAnimating(true);

    gsap.to(cardRef.current, {
      x: 300, opacity: 0, rotateY: 20, duration: 0.35, ease: "power2.in",
      onComplete: () => {
        setCurrentIndex((i) => i + 1);
        setIsFlipped(false);
        gsap.fromTo(
          cardRef.current,
          { x: -300, opacity: 0, rotateY: -20 },
          { x: 0, opacity: 1, rotateY: 0, duration: 0.4, ease: "power2.out", onComplete: () => setIsAnimating(false) }
        );
      },
    });
  }, [isAnimating, currentIndex, total]);

  const prevCard = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);

    gsap.to(cardRef.current, {
      x: -300, opacity: 0, rotateY: -20, duration: 0.35, ease: "power2.in",
      onComplete: () => {
        setCurrentIndex((i) => i - 1);
        setIsFlipped(false);
        gsap.fromTo(
          cardRef.current,
          { x: 300, opacity: 0, rotateY: 20 },
          { x: 0, opacity: 1, rotateY: 0, duration: 0.4, ease: "power2.out", onComplete: () => setIsAnimating(false) }
        );
      },
    });
  }, [isAnimating, currentIndex]);

  const gradient = GRADIENTS[currentIndex % GRADIENTS.length];

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608]" />

      {/* Ambient floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute heart-float"
            style={{
              left: `${((i * 17 + 5) % 90) + 5}%`,
              fontSize: `${((i * 13 + 7) % 20) + 10}px`,
              animationDelay: `${((i * 7) % 20)}s`,
              animationDuration: `${((i * 11) % 10) + 15}s`,
              opacity: ((i * 3) % 5 + 1) / 20 + 0.05,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Back button */}
      <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2 text-rose-300/60 hover:text-rose-300 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="relative z-10 max-w-2xl mx-auto px-6 w-full py-24">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <p className="text-rose-400 text-lg mb-3 tracking-widest uppercase" style={{ fontFamily: "var(--font-dancing)" }}>
            Every Single One
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Reasons I Love You
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-6 rounded-full" />
          <p className="text-rose-200/40 text-sm mt-4">
            {total} reasons and counting...
          </p>
        </div>

        {/* Card deck */}
        <div ref={deckRef} className="opacity-0">
          <div className="relative flex justify-center" style={{ perspective: "1200px" }}>
            {/* Shadow cards behind */}
            <div className="absolute w-64 sm:w-72 h-[22rem] sm:h-96 md:w-80 md:h-[26rem] rounded-2xl bg-white/5 border border-white/5 rotate-3 translate-y-2" />
            <div className="absolute w-64 sm:w-72 h-[22rem] sm:h-96 md:w-80 md:h-[26rem] rounded-2xl bg-white/5 border border-white/5 -rotate-2 translate-y-1" />

            {/* Main card */}
            <div
              ref={cardRef}
              onClick={flipCard}
              className="relative w-64 sm:w-72 h-[22rem] sm:h-96 md:w-80 md:h-[26rem] cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-8 shadow-2xl shadow-rose-900/30 transition-transform duration-500 backface-hidden ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Heart className="w-16 h-16 text-white/80 mb-6 drop-shadow-lg" fill="currentColor" />
                <p className="text-white/90 text-lg tracking-widest uppercase font-medium">
                  Reason #{currentIndex + 1}
                </p>
                <p className="text-white/50 text-sm mt-4">Tap to reveal</p>
              </div>

              {/* Back */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-8 shadow-2xl shadow-rose-900/30 transition-transform duration-500 backface-hidden ${
                  isFlipped ? "" : "[transform:rotateY(180deg)]"
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-white text-xl md:text-2xl text-center leading-relaxed font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                  &ldquo;{reasons[currentIndex]}&rdquo;
                </p>
                <Heart className="w-8 h-8 text-white/50 mt-8" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <button onClick={prevCard} disabled={currentIndex === 0 || isAnimating}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-rose-500/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-rose-300/60 text-sm tracking-wider">
              {currentIndex + 1} / {total}
            </span>
            <button onClick={nextCard} disabled={currentIndex === total - 1 || isAnimating}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-rose-500/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap max-w-xs mx-auto">
            {reasons.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-rose-500 scale-125"
                    : i < currentIndex
                    ? "bg-rose-500/40"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

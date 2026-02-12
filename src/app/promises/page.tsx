"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Star, Heart } from "lucide-react";
import { siteData } from "../../data/siteData";

gsap.registerPlugin(ScrollTrigger);

export default function PromisesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const promises = siteData.promises;

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
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.1,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608]" />

      {/* Back button */}
      <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2 text-rose-300/60 hover:text-rose-300 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <Star className="w-10 h-10 text-rose-400/60 mx-auto mb-4" />
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            My Promises To You
          </h1>
          <p className="text-rose-200/50" style={{ fontFamily: "var(--font-dancing)" }}>
            Commitments from my heart
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Promises grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {promises.map((promise, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="opacity-0 group relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-8 transition-all duration-500 hover:bg-white/[0.07] hover:border-rose-500/20 hover:shadow-[0_0_40px_rgba(244,63,94,0.08)]"
            >
              {/* Number */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="pt-4">
                <p
                  className="text-lg md:text-xl text-white/90 leading-relaxed"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {promise}
                </p>
              </div>

              {/* Decorative heart */}
              <Heart
                className="absolute bottom-4 right-4 w-6 h-6 text-rose-500/20 group-hover:text-rose-500/40 transition-colors"
                fill="currentColor"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

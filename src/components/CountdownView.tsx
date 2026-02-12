"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Heart, Sparkles } from "lucide-react";
import { siteData } from "../data/siteData";

interface TimeUnit {
  value: number;
  label: string;
}

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export default function CountdownView({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const unitsRef = useRef<(HTMLDivElement | null)[]>([]);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: "Days" },
    { value: 0, label: "Hours" },
    { value: 0, label: "Minutes" },
    { value: 0, label: "Seconds" },
  ]);
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generated);
    setMounted(true);
  }, []);

  useEffect(() => {
    const targetDate = new Date(siteData.hero.date).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      if (diff <= 0) {
        onComplete();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft([
        { value: days, label: "Days" },
        { value: hours, label: "Hours" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Seconds" },
      ]);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 }
      );

      tl.fromTo(
        unitsRef.current.filter(Boolean),
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
        },
        "-=0.5"
      );

      tl.fromTo(
        messageRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0515] via-[#1a0a20] to-[#0d0608]" />

      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white countdown-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.12)_0%,_transparent_60%)]" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-4">
          <Sparkles className="w-8 h-8 text-purple-400/60 mx-auto mb-4" />
        </div>
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Counting Every Second
        </h1>
        <p className="text-purple-200/50 mb-16 text-lg" style={{ fontFamily: "var(--font-dancing)" }}>
          Until our next Valentine&apos;s Day together
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {timeLeft.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-4 md:gap-6">
              <div
                ref={(el) => {
                  unitsRef.current[i] = el;
                }}
                className="opacity-0"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-b from-rose-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:from-rose-500/20 group-hover:to-purple-500/20 transition-all duration-500" />

                  <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 sm:p-6 md:p-8 min-w-[80px] sm:min-w-[90px] md:min-w-[120px] transition-all duration-300 hover:border-rose-500/30 hover:bg-white/[0.08]">
                    <span
                      className="block text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight tabular-nums"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span className="block text-xs md:text-sm text-rose-300/50 uppercase tracking-[0.2em] mt-2">
                      {unit.label}
                    </span>
                  </div>
                </div>
              </div>

              {i < timeLeft.length - 1 && (
                <span className="text-3xl md:text-5xl text-rose-500/30 font-light hidden sm:block countdown-pulse">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <p
          ref={messageRef}
          className="text-rose-200/40 mt-16 text-base md:text-lg max-w-md mx-auto leading-relaxed opacity-0"
        >
          Every second brings me closer to you. I&apos;m counting every heartbeat until I can hold you again.
        </p>

        <div className="mt-10">
          <Heart
            className="w-10 h-10 text-rose-500/40 mx-auto countdown-heartbeat"
            fill="currentColor"
          />
        </div>
      </div>
    </div>
  );
}

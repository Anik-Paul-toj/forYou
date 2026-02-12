"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Heart, ChevronDown } from "lucide-react";
import { siteData } from "../data/siteData";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create sparkle particles
      if (sparklesRef.current) {
        for (let i = 0; i < 50; i++) {
          const sparkle = document.createElement("div");
          sparkle.className = "sparkle";
          sparkle.style.left = `${Math.random() * 100}%`;
          sparkle.style.top = `${Math.random() * 100}%`;
          sparkle.style.animationDelay = `${Math.random() * 5}s`;
          sparklesRef.current.appendChild(sparkle);
        }
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Heart entrance
      tl.fromTo(
        heartRef.current,
        { scale: 0, rotation: -15, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      );

      // Heart continuous pulse
      gsap.to(heartRef.current, {
        scale: 1.1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });

      // Title reveal
      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 },
        "-=0.5"
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
        "-=0.4"
      );

      // Date badge
      tl.fromTo(
        dateRef.current,
        { y: 30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
        "-=0.3"
      );

      // Bouncing arrow
      tl.fromTo(
        arrowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.1"
      );

      gsap.to(arrowRef.current, {
        y: 12,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
        delay: 2.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTimeline = () => {
    const timelineSection = document.getElementById("timeline");
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a10] via-[#2d0a1a] to-[#0d0608]" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,29,72,0.15)_0%,_transparent_70%)]" />

      {/* Sparkles container */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Animated Heart */}
        <div ref={heartRef} className="mb-8 inline-block opacity-0">
          <Heart
            className="w-20 h-20 md:w-28 md:h-28 text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]"
            fill="currentColor"
          />
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 opacity-0 tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {siteData.hero.title}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl lg:text-2xl text-rose-200/80 mb-8 opacity-0 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          {siteData.hero.subtitle}
        </p>

        {/* Date badge */}
        <p
          ref={dateRef}
          className="inline-block px-6 py-2 rounded-full border border-rose-500/30 text-rose-300/90 text-sm tracking-widest uppercase mb-10 opacity-0 backdrop-blur-sm"
        >
          {siteData.hero.date}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 cursor-pointer"
        onClick={scrollToTimeline}
      >
        <ChevronDown className="w-8 h-8 text-rose-400/60" />
      </div>
    </section>
  );
}

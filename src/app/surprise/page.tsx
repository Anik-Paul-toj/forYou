"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Heart, Gift, Sparkles, PartyPopper } from "lucide-react";

export default function SurprisePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const ribbonLeftRef = useRef<HTMLDivElement>(null);
  const ribbonRightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      tl.fromTo(
        boxRef.current,
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
        "-=0.5"
      );

      // Subtle float animation for the box
      gsap.to(boxRef.current, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const spawnConfetti = useCallback(() => {
    if (!confettiRef.current) return;
    const colors = ["#f43f5e", "#ec4899", "#a855f7", "#f97316", "#facc15", "#fb7185", "#f472b6"];

    for (let i = 0; i < 100; i++) {
      const piece = document.createElement("div");
      piece.className = "absolute";
      const size = Math.random() * 10 + 5;
      const isCircle = Math.random() > 0.5;

      piece.style.width = `${size}px`;
      piece.style.height = `${isCircle ? size : size * 2}px`;
      piece.style.borderRadius = isCircle ? "50%" : "2px";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = "50%";
      piece.style.top = "50%";

      confettiRef.current.appendChild(piece);

      gsap.to(piece, {
        x: (Math.random() - 0.5) * Math.min(600, window.innerWidth),
        y: (Math.random() - 0.5) * Math.min(600, window.innerHeight) - 200,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        duration: Math.random() * 2 + 1.5,
        ease: "power2.out",
        onComplete: () => {
          piece.remove();
        },
      });
    }
  }, []);

  const openGift = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);

    const tl = gsap.timeline();

    // Wiggle box first
    tl.to(boxRef.current, {
      rotation: -3,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Ribbons fly off
    tl.to(ribbonLeftRef.current, {
      x: -200,
      rotation: -45,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
    }, "+=0.2");

    tl.to(
      ribbonRightRef.current,
      {
        x: 200,
        rotation: 45,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      },
      "<"
    );

    // Lid flies up
    tl.to(lidRef.current, {
      y: -200,
      rotateX: -60,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        spawnConfetti();
      },
    }, "-=0.3");

    // Box body fades
    tl.to(
      boxRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.5,
        ease: "power2.in",
      },
      "-=0.3"
    );

    // Show message
    tl.add(() => {
      setShowContent(true);
    });

    tl.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.5, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)",
        onStart: () => {
          if (contentRef.current) {
            contentRef.current.style.display = "flex";
          }
        },
      },
      "-=0.2"
    );
  }, [isOpened, spawnConfetti]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#0a0515]" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.1)_0%,_transparent_60%)]" />

      {/* Confetti container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-rose-300/60 hover:text-rose-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl font-bold text-white mb-4 opacity-0"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          I Have A Surprise For You
        </h1>
        <p className="text-rose-200/50 mb-16" style={{ fontFamily: "var(--font-dancing)" }}>
          Click the gift box to open it...
        </p>

        {/* Gift box */}
        {!showContent && (
          <div
            ref={boxRef}
            onClick={openGift}
            className="relative inline-block cursor-pointer opacity-0"
            style={{ perspective: "800px" }}
          >
            {/* Box glow */}
            <div className="absolute -inset-8 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />

            {/* Box body */}
            <div className="relative w-52 h-44 md:w-64 md:h-52">
              {/* Box base */}
              <div className="absolute bottom-0 w-full h-32 md:h-40 bg-gradient-to-b from-rose-600 to-rose-800 rounded-xl border border-rose-500/30 shadow-2xl shadow-rose-900/50" />

              {/* Lid */}
              <div
                ref={lidRef}
                className="absolute top-0 w-[110%] -left-[5%] h-14 md:h-16 bg-gradient-to-b from-rose-500 to-rose-700 rounded-xl border border-rose-400/30 shadow-lg"
                style={{ transformOrigin: "top center" }}
              >
                {/* Bow on top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300/50 shadow-lg" />
                    <div className="absolute top-1 -left-5 w-8 h-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full -rotate-12" />
                    <div className="absolute top-1 -right-5 w-8 h-5 bg-gradient-to-l from-yellow-400 to-yellow-500 rounded-full rotate-12" />
                  </div>
                </div>
              </div>

              {/* Vertical ribbon */}
              <div
                ref={ribbonLeftRef}
                className="absolute left-1/2 -translate-x-1/2 top-14 bottom-0 w-6 md:w-8 bg-gradient-to-b from-yellow-400/80 to-yellow-600/80 border-x border-yellow-300/30"
              />

              {/* Horizontal ribbon */}
              <div
                ref={ribbonRightRef}
                className="absolute top-[60%] left-0 right-0 h-6 md:h-8 bg-gradient-to-r from-yellow-400/80 via-yellow-500/80 to-yellow-400/80 border-y border-yellow-300/30"
              />

              {/* Sparkle icons */}
              <Sparkles className="absolute -top-2 -right-6 w-6 h-6 text-yellow-400/40 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-6 w-5 h-5 text-rose-400/40 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Click hint */}
            <p className="text-rose-300/40 text-sm mt-8 animate-pulse">
              Tap to open your gift
            </p>
          </div>
        )}

        {/* Revealed content */}
        <div
          ref={contentRef}
          className="hidden flex-col items-center opacity-0"
        >
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-6 sm:p-10 md:p-14 max-w-lg mx-auto">
            {/* Party icon */}
            <PartyPopper className="w-14 h-14 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" />

            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              You Are My Greatest Gift
            </h2>

            <p className="text-rose-100/60 leading-relaxed mb-8">
              I don&apos;t need to search the world for treasure — I found it the day I found you.
              You are my gift, my miracle, my forever Valentine.
            </p>

            <div className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.05] mb-8">
              <p
                className="text-rose-200/70 text-lg italic leading-relaxed"
                style={{ fontFamily: "var(--font-dancing)" }}
              >
                &ldquo;My gift to you isn&apos;t something I can wrap in paper.
                It&apos;s my heart, my time, my presence, and my promise
                to love you more with every passing day.&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Heart
                  key={i}
                  className="w-5 h-5 text-rose-500/60"
                  fill="currentColor"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>

          <p className="text-rose-200/30 mt-8 text-sm">
            Happy Valentine&apos;s Day, my love.
          </p>
        </div>
      </div>
    </div>
  );
}

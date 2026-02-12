"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEXT = "You + Me = Forever";

export default function MagneticText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const chars = TEXT.split("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance for each character
      gsap.fromTo(
        charsRef.current.filter(Boolean),
        {
          opacity: 0,
          y: 80,
          rotateX: 90,
          scale: 0.5,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic hover/touch effect
  useEffect(() => {
    const applyMagneticForce = (clientX: number, clientY: number) => {
      charsRef.current.forEach((charEl) => {
        if (!charEl) return;

        const rect = charEl.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const deltaX = clientX - charX;
        const deltaY = clientY - charY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const maxDist = 200;
        if (distance < maxDist) {
          const force = (1 - distance / maxDist) * 20;
          const moveX = (deltaX / distance) * force;
          const moveY = (deltaY / distance) * force;

          gsap.to(charEl, {
            x: moveX,
            y: moveY,
            scale: 1 + (1 - distance / maxDist) * 0.3,
            color: `hsl(${340 + (1 - distance / maxDist) * 40}, 80%, 65%)`,
            textShadow: `0 0 ${force * 2}px rgba(244,63,94,${(1 - distance / maxDist) * 0.6})`,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(charEl, {
            x: 0,
            y: 0,
            scale: 1,
            color: "white",
            textShadow: "none",
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });
        }
      });
    };

    const handleMove = (e: MouseEvent) => {
      applyMagneticForce(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        applyMagneticForce(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleLeave = () => {
      charsRef.current.forEach((charEl) => {
        if (!charEl) return;
        gsap.to(charEl, {
          x: 0,
          y: 0,
          scale: 1,
          color: "white",
          textShadow: "none",
          duration: 0.8,
          ease: "elastic.out(1, 0.4)",
        });
      });
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener("mousemove", handleMove);
      container.addEventListener("mouseleave", handleLeave);
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
      container.addEventListener("touchend", handleLeave);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        container.removeEventListener("mouseleave", handleLeave);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleLeave);
      };
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#150a0e] to-[#0d0608]" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.08)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p
          className="text-rose-400/50 text-sm tracking-[0.3em] uppercase mb-8"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          Touch or hover over the letters
        </p>

        {/* Magnetic text */}
        <div
          ref={containerRef}
          className="flex items-center justify-center flex-wrap gap-x-2 md:gap-x-4 cursor-default"
          style={{ perspective: "800px" }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                charsRef.current[i] = el;
              }}
              className="inline-block text-5xl md:text-7xl lg:text-8xl font-bold text-white opacity-0 select-none transition-none will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                display: char === " " ? "inline" : "inline-block",
                width: char === " " ? "0.3em" : "auto",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-rose-200/30 text-sm mt-10 tracking-wider">
          An equation that needs no solving
        </p>
      </div>
    </section>
  );
}

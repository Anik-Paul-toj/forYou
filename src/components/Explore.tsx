"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Music, Star, Gift, HelpCircle, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PAGES = [
  {
    href: "/countdown",
    icon: Clock,
    title: "Countdown",
    subtitle: "Every second closer to you",
    gradient: "from-purple-600 to-indigo-600",
    glow: "rgba(168,85,247,0.3)",
  },
  {
    href: "/quiz",
    icon: HelpCircle,
    title: "Our Quiz",
    subtitle: "How well do you know us?",
    gradient: "from-emerald-600 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    href: "/reasons",
    icon: Heart,
    title: "Why I Love You",
    subtitle: "Every single reason, one by one",
    gradient: "from-red-600 to-rose-500",
    glow: "rgba(239,68,68,0.3)",
  },
  {
    href: "/playlist",
    icon: Music,
    title: "Our Playlist",
    subtitle: "Songs that tell our story",
    gradient: "from-rose-600 to-pink-600",
    glow: "rgba(244,63,94,0.3)",
  },
  {
    href: "/promises",
    icon: Star,
    title: "My Promises",
    subtitle: "Commitments from my heart",
    gradient: "from-amber-600 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    href: "/surprise",
    icon: Gift,
    title: "A Surprise",
    subtitle: "Something special for you",
    gradient: "from-fuchsia-600 to-rose-600",
    glow: "rgba(217,70,239,0.3)",
  },
];

export default function Explore() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

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

      cardsRef.current.forEach((card) => {
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
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#150a0e] to-[#0d0608]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <p
            className="text-rose-400 text-lg mb-3 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            There&apos;s More
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Explore Our World
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAGES.map((page, i) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.href}
                href={page.href}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative block opacity-0"
              >
                <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 transition-all duration-500 hover:bg-white/[0.07] hover:border-white/[0.15] overflow-hidden">
                  {/* Hover glow */}
                  <div
                    className="absolute -inset-2 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500"
                    style={{ background: page.glow }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${page.gradient} mb-5 shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-bold text-white mb-2 group-hover:text-rose-100 transition-colors"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {page.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-rose-200/40 text-sm">
                      {page.subtitle}
                    </p>

                    {/* Arrow */}
                    <div className="mt-4 text-rose-400/40 group-hover:text-rose-400 group-active:text-rose-400 group-hover:translate-x-1 group-active:translate-x-1 transition-all text-sm">
                      Explore &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

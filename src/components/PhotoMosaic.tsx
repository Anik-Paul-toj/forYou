"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
  { src: "/memories/1.jpeg", rotate: -6, x: -5, y: 0 },
  { src: "/memories/2.jpeg", rotate: 4, x: 10, y: -5 },
  { src: "/memories/3.jpeg", rotate: -3, x: -8, y: 8 },
  { src: "/memories/4.jpeg", rotate: 7, x: 5, y: -10 },
  { src: "/memories/5.jpeg", rotate: -5, x: -3, y: 5 },
  { src: "/memories/6.jpeg", rotate: 3, x: 8, y: -3 },
  { src: "/memories/7.jpeg", rotate: -4, x: -6, y: 4 },
  { src: "/memories/8.jpeg", rotate: 5, x: 7, y: -7 },
  { src: "/memories/9.jpeg", rotate: -2, x: -4, y: 6 },
  { src: "/memories/10.jpeg", rotate: 6, x: 3, y: -4 },
];

export default function PhotoMosaic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

      photosRef.current.forEach((photo, i) => {
        if (!photo) return;

        gsap.fromTo(
          photo,
          {
            opacity: 0,
            scale: 0.7,
            rotation: (Math.random() - 0.5) * 30,
            y: 80,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: PHOTOS[i].rotate,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: photo,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse/touch parallax
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener("mousemove", handleMouseMove);
      grid.addEventListener("touchmove", handleTouchMove, { passive: true });
      return () => {
        grid.removeEventListener("mousemove", handleMouseMove);
        grid.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, []);

  // Apply parallax transforms
  useEffect(() => {
    photosRef.current.forEach((photo, i) => {
      if (!photo) return;
      const depth = (i % 3 + 1) * 8;
      gsap.to(photo, {
        x: mousePos.x * depth + PHOTOS[i].x * 4,
        y: mousePos.y * depth + PHOTOS[i].y * 4,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  }, [mousePos]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#150a0e] to-[#0d0608]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <p
            className="text-rose-400 text-lg mb-3 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            Moments Frozen in Time
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Photo Wall
          </h2>
          <p className="text-rose-200/30 text-sm mt-4">
            Explore our memories
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Photo grid with parallax */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 max-w-4xl mx-auto"
        >
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              ref={(el) => {
                photosRef.current[i] = el;
              }}
              className="opacity-0"
              style={{ transform: `rotate(${photo.rotate}deg)` }}
            >
              <div className="group relative bg-white p-2 md:p-3 rounded-lg shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-rose-500/20 hover:scale-105 active:scale-105 hover:z-10 active:z-10">
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden rounded">
                  <Image
                    src={photo.src}
                    alt={`Memory ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 45vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Tape effect on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/20 backdrop-blur-sm rounded-sm border border-yellow-200/10 rotate-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

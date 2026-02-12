"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteData } from "../data/siteData";

export default function Timeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const memories = siteData.timeline;

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = window.innerWidth * 0.4;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="timeline" className="relative bg-[#0d0608] py-24">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <p className="text-rose-400 text-lg mb-3 tracking-widest uppercase" style={{ fontFamily: "var(--font-dancing)" }}>
          Memory Lane
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          Our Journey Together
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-6 rounded-full" />
        <p className="text-rose-200/40 text-sm mt-4">
          Scroll or use arrows to explore our memories
        </p>
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all ${
            canScrollLeft ? "opacity-100 hover:bg-rose-500/20" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all ${
            canScrollRight ? "opacity-100 hover:bg-rose-500/20" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {memories.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw]"
            >
              <div className="relative bg-white/[0.05] rounded-3xl overflow-hidden border border-white/10 h-full">
                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 30vw"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0608] via-transparent to-transparent" />

                  {/* Date */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-rose-300 text-xs font-medium">
                    {item.date}
                  </div>

                  {/* Number */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-500/30 border border-rose-500/50 flex items-center justify-center text-rose-300 text-sm font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    {item.title}
                  </h3>
                  <p className="text-rose-200/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* End card */}
          <div className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                To Be Continued...
              </h3>
              <p className="text-rose-200/50">Our story is just beginning</p>
            </div>
          </div>

          {/* Right padding */}
          <div className="flex-shrink-0 w-[5vw]" />
        </div>

        {/* Scroll indicator bar */}
        <div className="flex justify-center gap-2 mt-6">
          {memories.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-rose-500/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

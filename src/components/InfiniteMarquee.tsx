"use client";

const ROWS = [
  { text: "Love ", direction: "left", speed: 30 },
  { text: "Forever ", direction: "right", speed: 25 },
  { text: "Always ", direction: "left", speed: 35 },
];

export default function InfiniteMarquee() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-[#0d0608]">
      {ROWS.map((row, i) => (
        <div
          key={i}
          className="relative whitespace-nowrap py-4 md:py-6 overflow-hidden"
        >
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0608] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0d0608] to-transparent z-10 pointer-events-none" />

          {/* Scrolling content - duplicated for seamless loop */}
          <div
            className="inline-flex"
            style={{
              animation: `marquee-${row.direction} ${row.speed}s linear infinite`,
            }}
          >
            {/* Render content 4x for seamless loop */}
            {[...Array(4)].map((_, batch) => (
              <span
                key={batch}
                className="inline-flex"
              >
                {[...Array(6)].map((_, j) => (
                  <span
                    key={j}
                    className={`text-4xl md:text-6xl lg:text-7xl font-bold mx-4 md:mx-8 ${
                      i === 0
                        ? "text-rose-500/20"
                        : i === 1
                        ? "text-pink-500/20"
                        : "text-red-500/20"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {row.text}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

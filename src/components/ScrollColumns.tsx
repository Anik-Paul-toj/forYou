"use client";

const COLUMNS = [
  { words: ["Love", "Heart", "Soul", "Kiss", "Dream", "Forever", "Passion", "Desire", "Bliss", "Joy", "Together", "Always", "Promise", "Cherish"], direction: "up", speed: 25 },
  { words: ["Yours", "Mine", "Ours", "Eternal", "Magic", "Stars", "Moon", "Infinity", "Devotion", "Adore", "Treasure", "Warmth", "Gentle", "Grace"], direction: "down", speed: 30 },
  { words: ["Beloved", "Darling", "Angel", "Light", "Hope", "Faith", "Wonder", "Miracle", "Spark", "Flame", "Glow", "Radiant", "Divine", "Sweet"], direction: "up", speed: 22 },
  { words: ["Enchanted", "Captivated", "Mesmerized", "Smitten", "Devoted", "Bonded", "United", "Entwined", "Destiny", "Fate", "Serenity", "Haven", "Home", "Peace"], direction: "down", speed: 28 },
  { words: ["Heartbeat", "Whisper", "Embrace", "Caress", "Tender", "Precious", "Sacred", "Pure", "True", "Deep", "Endless", "Boundless", "Timeless", "Infinite"], direction: "up", speed: 26 },
];

export default function ScrollColumns() {
  return (
    <section
      className="relative py-0 overflow-hidden"
      style={{ height: "80vh" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#110810] to-[#0d0608]" />

      {/* Gradient overlay left & right for fade effect */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0608] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0608] to-transparent z-10" />
      {/* Top/bottom fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0d0608] to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0608] to-transparent z-10" />

      {/* Columns */}
      <div className="relative h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-5 px-4 sm:px-6 md:px-12 overflow-hidden">
        {COLUMNS.map((column, colIndex) => (
          <div
            key={colIndex}
            className="overflow-hidden h-full min-w-0"
          >
            <div
              className="flex flex-col gap-4 md:gap-6"
              style={{
                animation: `scroll-column-${column.direction} ${column.speed}s linear infinite`,
              }}
            >
              {/* Render content 3x for seamless loop */}
              {[0, 1, 2].map((batch) =>
                column.words.map((word, i) => (
                  <div
                    key={`${batch}-${i}`}
                    className="px-3 md:px-4 py-2 md:py-3 rounded-lg border border-rose-500/15 bg-rose-500/[0.06] backdrop-blur-sm"
                  >
                    <span
                      className="text-sm md:text-base text-rose-200/60 whitespace-nowrap tracking-wider"
                      style={{ fontFamily: "var(--font-dancing)" }}
                    >
                      {word}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

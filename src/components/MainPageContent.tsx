"use client";

import Hero from "./Hero";
import TextRevealOnScroll from "./TextRevealOnScroll";
import InfiniteMarquee from "./InfiniteMarquee";
import ParallaxQuote from "./ParallaxQuote";
import Timeline from "./Timeline";
import RisingHeartsWall from "./RisingHeartsWall";
import ScrollColumns from "./ScrollColumns";
import PhotoMosaic from "./PhotoMosaic";
import MagneticText from "./MagneticText";
import CinematicZoom from "./CinematicZoom";
import Explore from "./Explore";
import LoveLetter from "./LoveLetter";
import FloatingHearts from "./FloatingHearts";
import CursorHearts from "./CursorHearts";
import BackgroundMusic from "./BackgroundMusic";

export default function MainPageContent() {
  return (
    <main className="relative">
      {/* Global overlays */}
      <BackgroundMusic />
      <FloatingHearts />
      <CursorHearts />

      {/* 1. Cinematic landing */}
      <Hero />

      {/* 2. Word-by-word text reveal with blur + scale */}
      <TextRevealOnScroll />

      {/* 3. Infinite scrolling love text marquee */}
      <InfiniteMarquee />

      {/* 4. Maya Angelou quote - word-by-word scrub reveal */}
      <ParallaxQuote />

      {/* 5. Real relationship timeline with 14 photos */}
      <Timeline />

      {/* 6. Hearts continuously rising from the bottom */}
      <RisingHeartsWall />

      {/* 8. Love words in alternating vertical scroll columns */}
      <ScrollColumns />

      {/* 9. Interactive polaroid photo wall with mouse parallax */}
      <PhotoMosaic />

      {/* 10. "You're My Everything" cinematic zoom text (sticky scroll) */}
      <CinematicZoom />

      {/* 11. Magnetic text - letters attract toward cursor */}
      <MagneticText />

      {/* 12. Navigation grid to all routes */}
      <Explore />

      {/* 13. Envelope love letter */}
      <LoveLetter />

      {/* Footer */}
      <footer className="relative py-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#150a0e] to-[#0d0608]" />
        <div className="relative z-10">
          <p className="text-rose-400/40 text-sm">
            Made with ♥ just for you
          </p>
        </div>
      </footer>
    </main>
  );
}

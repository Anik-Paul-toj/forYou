"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Music, Play, Pause, ExternalLink, Heart } from "lucide-react";
import { siteData } from "../../data/siteData";

export default function PlaylistPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  const playlist = siteData.playlist;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      tl.fromTo(
        vinylRef.current,
        { scale: 0.8, opacity: 0, rotation: -30 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.5)" },
        "-=0.5"
      );

      // Vinyl rotation animation
      gsap.to(vinylRef.current, {
        rotation: "+=360",
        duration: 3,
        repeat: -1,
        ease: "none",
        paused: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608]" />

      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-rose-300/60 hover:text-rose-300 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Music className="w-10 h-10 text-rose-400/60 mx-auto mb-4" />
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white mb-4 opacity-0"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Love Playlist
          </h1>
          <p className="text-rose-200/50" style={{ fontFamily: "var(--font-dancing)" }}>
            Songs that remind me of you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Vinyl Player */}
          <div className="flex justify-center">
            <div
              ref={vinylRef}
              className="relative w-64 h-64 md:w-80 md:h-80 opacity-0"
            >
              {/* Vinyl disc */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-2xl">
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border border-gray-800" />
                <div className="absolute inset-8 rounded-full border border-gray-800" />
                <div className="absolute inset-12 rounded-full border border-gray-800" />
                <div className="absolute inset-16 rounded-full border border-gray-800" />

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Center hole */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Play button overlay */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-rose-600" />
                  ) : (
                    <Play className="w-8 h-8 text-rose-600 ml-1" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Track List */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-6">
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <div
                  key={index}
                  onClick={() => selectTrack(index)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                    currentTrack === index
                      ? "bg-white/[0.08] border border-rose-500/30"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 text-sm font-medium">
                    {currentTrack === index && isPlaying ? (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-4 bg-rose-400 animate-[waveform_0.5s_ease-in-out_infinite]" />
                        <div className="w-1 h-4 bg-rose-400 animate-[waveform_0.5s_ease-in-out_infinite_0.1s]" />
                        <div className="w-1 h-4 bg-rose-400 animate-[waveform_0.5s_ease-in-out_infinite_0.2s]" />
                      </div>
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{track.title}</h3>
                    <p className="text-rose-200/40 text-sm">{track.artist}</p>
                  </div>
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400/60 hover:text-rose-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

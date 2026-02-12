"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Music, Play, Pause, Heart } from "lucide-react";
import { siteData } from "../../data/siteData";

export default function PlaylistPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // Handle vinyl rotation animation based on playing state
  useEffect(() => {
    if (!vinylRef.current) return;
    
    if (isPlaying) {
      gsap.to(vinylRef.current, {
        rotation: "+=360",
        duration: 3,
        repeat: -1,
        ease: "none",
        overwrite: "auto"
      });
    } else {
      gsap.to(vinylRef.current, {
        rotation: vinylRef.current.style.transform ? "+=10" : 0, // gently stop
        duration: 0.5,
        overwrite: "auto",
        onComplete: () => {
           // stop rotation
        }
      });
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    if (audioRef.current) {
      // Small delay to ensure source updates
      setTimeout(() => audioRef.current?.play(), 50);
    }
  };

  const handleEnded = () => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    selectTrack(nextIndex);
  };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608]" />

      <audio
        ref={audioRef}
        src={playlist[currentTrack].audioSrc}
        onEnded={handleEnded}
      />

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
          {/* Vinyl Player Visual */}
          <div className="flex flex-col items-center justify-center">
            <div
              ref={vinylRef}
              className="relative w-64 h-64 md:w-80 md:h-80 opacity-0"
            >
              {/* Vinyl disc */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-2xl border-4 border-gray-900">
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border border-gray-800/50" />
                <div className="absolute inset-8 rounded-full border border-gray-800/50" />
                <div className="absolute inset-12 rounded-full border border-gray-800/50" />
                <div className="absolute inset-16 rounded-full border border-gray-800/50" />

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <Heart className="w-12 h-12 text-white/90 drop-shadow-md" fill="currentColor" />
                    {/* Spinning sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
                  </div>
                </div>

                {/* Center hole */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border border-gray-700" />
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <h3 className="text-xl font-medium text-white text-center">
                {playlist[currentTrack].title}
              </h3>
              
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-rose-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Track List */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-6 h-[400px] overflow-y-auto custom-scrollbar">
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
                    <h3 className={`font-medium truncate ${currentTrack === index ? "text-rose-300" : "text-white"}`}>
                      {track.title}
                    </h3>
                  </div>
                  {currentTrack === index && (
                    <div className="text-rose-400">
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

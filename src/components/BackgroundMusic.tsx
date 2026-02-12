"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try to autoplay
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setShowPrompt(false);
      } catch (err) {
        // Autoplay blocked, show prompt
        console.log("Autoplay blocked, waiting for user interaction");
      }
    };

    playAudio();

    // Handle user interaction to start playing
    const handleInteraction = () => {
      if (audio.paused && !isMuted) {
        audio.play().then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        }).catch(() => {});
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [isMuted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      audio.muted = true;
      setIsMuted(true);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/mainPage.mp3"
        loop
        preload="auto"
      />

      {/* Music toggle button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-rose-500/20 backdrop-blur-sm border border-rose-500/30 flex items-center justify-center text-rose-300 hover:bg-rose-500/30 transition-all"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>

      {/* Autoplay prompt */}
      {showPrompt && (
        <div className="fixed bottom-20 right-6 z-50 bg-black/80 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full border border-rose-500/30 animate-pulse">
          🎵 Click anywhere to play music
        </div>
      )}
    </>
  );
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Heart, Trophy, Sparkles } from "lucide-react";
import { siteData } from "../../data/siteData";

export default function QuizPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  const quiz = siteData.quiz;
  const currentQ = quiz[currentQuestion];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Celebration effect
  const celebrate = useCallback(() => {
    const colors = ["#f43f5e", "#ec4899", "#a855f7", "#f97316"];

    for (let i = 0; i < 30; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "♥";
      heart.className = "fixed pointer-events-none z-50";
      heart.style.left = "50%";
      heart.style.top = "50%";
      heart.style.fontSize = `${Math.random() * 20 + 15}px`;
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(heart);

      gsap.to(heart, {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400 - 100,
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => heart.remove(),
      });
    }
  }, []);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setScore((s) => s + 1);
      celebrate();
    }

    setTimeout(() => {
      setShowResult(true);
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
  };

  if (!mounted) return null;

  const isComplete = currentQuestion === quiz.length - 1 && showResult;

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608]" />

      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-rose-300/60 hover:text-rose-300 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="relative z-10 max-w-2xl mx-auto px-6 w-full py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Sparkles className="w-8 h-8 text-rose-400/60 mx-auto mb-4" />
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            How Well Do You Know Us?
          </h1>
          <p className="text-rose-200/50" style={{ fontFamily: "var(--font-dancing)" }}>
            Test your knowledge of our love story
          </p>
        </div>

        {/* Quiz card */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-8 md:p-10">
          {!isComplete ? (
            <>
              {/* Progress */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-rose-300/60 text-sm">
                  Question {currentQuestion + 1} of {quiz.length}
                </span>
                <div className="flex gap-1">
                  {quiz.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentQuestion
                          ? "bg-rose-500"
                          : i === currentQuestion
                          ? "bg-rose-500/50"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                      selectedOption === null
                        ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-rose-500/30"
                        : selectedOption === index
                        ? index === currentQ.correct
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-red-500/50 bg-red-500/10"
                        : index === currentQ.correct
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-white/10 bg-white/[0.03] opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/60">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-white/90">{option}</span>
                      {selectedOption === index && index === currentQ.correct && (
                        <Heart className="w-5 h-5 text-green-400 ml-auto" fill="currentColor" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Result */}
              {showResult && (
                <div className="mt-8 text-center">
                  <p className={`text-lg mb-4 ${selectedOption === currentQ.correct ? "text-green-400" : "text-rose-400"}`}>
                    {selectedOption === currentQ.correct ? "Correct! ♥" : "Not quite, but I love you anyway!"}
                  </p>
                  {currentQuestion < quiz.length - 1 && (
                    <button
                      onClick={nextQuestion}
                      className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full text-white font-medium hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Final Score */
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Quiz Complete!
              </h2>
              <p className="text-2xl text-rose-300 mb-2">
                You scored {score} out of {quiz.length}
              </p>
              <p className="text-rose-200/50 mb-8" style={{ fontFamily: "var(--font-dancing)" }}>
                {score === quiz.length
                  ? "Perfect! You know me so well ♥"
                  : score >= quiz.length / 2
                  ? "Great job! You know us pretty well!"
                  : "Don't worry, we have forever to learn more about each other!"}
              </p>
              <button
                onClick={restartQuiz}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full text-white font-medium hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

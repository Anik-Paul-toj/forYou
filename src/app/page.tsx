"use client";

import { useState, useEffect } from "react";
import MainPageContent from "../components/MainPageContent";
import CountdownView from "../components/CountdownView";
import { siteData } from "../data/siteData";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const targetDate = new Date(siteData.hero.date).getTime();
    const now = Date.now();
    
    if (now >= targetDate) {
      setIsUnlocked(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null; // Prevent hydration mismatch

  return (
    <>
      {isUnlocked ? (
        <MainPageContent />
      ) : (
        <CountdownView onComplete={() => setIsUnlocked(true)} />
      )}
    </>
  );
}

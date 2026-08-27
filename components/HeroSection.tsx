"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import HeroOverlay from "./ui/HeroOverlay";

// Dynamically import the Canvas (SSR off — Three.js is browser-only)
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const TOTAL = 5;
const GLITCH_DURATION = 520; // ms

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(2); // start at centre card
  const [glitching, setGlitching] = useState(false);
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    if (glitchTimer.current) clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setGlitching(false), GLITCH_DURATION);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      triggerGlitch();
      // Small delay so glitch fires before card swap
      setTimeout(() => setActiveIndex(index), 80);
    },
    [triggerGlitch]
  );

  const next = useCallback(() => goTo((activeIndex + 1) % TOTAL), [activeIndex, goTo]);
  const prev = useCallback(() => goTo((activeIndex - 1 + TOTAL) % TOTAL), [activeIndex, goTo]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Auto-advance every 5s
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#08050f]">
      {/* 3D Canvas — full bleed */}
      <Scene activeIndex={activeIndex} glitching={glitching} />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(8,5,15,0.75) 100%)",
        }}
      />

      {/* Scanline texture */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
        }}
      />

      {/* Centre headline */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none">
        <p className="text-[11px] tracking-[0.3em] uppercase text-white/30 mb-5 font-mono">
          Signal-matched hiring
        </p>
        <h1 className="font-display text-center text-[clamp(40px,7vw,80px)] font-semibold leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_40px_rgba(168,85,247,0.35)]">
          Where work<br />
          <em className="not-italic text-emerald-300">finds its signal.</em>
        </h1>
        <p className="mt-5 text-[16px] text-white/40 max-w-sm text-center leading-relaxed">
          Verity reads what a role needs and who&apos;s ready for it — then puts them in the same room, fast.
        </p>
      </div>

      {/* HTML overlay — sidebar, dots, nav */}
      <div className="absolute inset-0 z-30">
        <HeroOverlay
          activeIndex={activeIndex}
          totalCards={TOTAL}
          onNext={next}
          onPrev={prev}
          onSelect={goTo}
        />
      </div>
    </section>
  );
}

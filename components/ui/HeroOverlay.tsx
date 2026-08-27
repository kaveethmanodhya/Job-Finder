"use client";

import { useEffect, useRef } from "react";

interface HeroOverlayProps {
  activeIndex: number;
  totalCards: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (i: number) => void;
}

const CARD_LABELS = [
  "Senior Product Designer · Job",
  "Maya R. — Backend Eng · Talent",
  "Growth Marketing Lead · Job",
  "Dev Osei — Motion Design · Talent",
  "Staff iOS Engineer · Job",
];

export default function HeroOverlay({
  activeIndex,
  totalCards,
  onNext,
  onPrev,
  onSelect,
}: HeroOverlayProps) {
  return (
    <>
      {/* Top-left sidebar label (mimicking activetheory's sidebar) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
          What are you looking for?
        </p>
        {[
          "→ Open Roles",
          "→ Freelance Talent",
          "→ Remote Work",
          "→ Contract / Part-time",
        ].map((label) => (
          <button
            key={label}
            className="text-left text-[12px] text-white/40 hover:text-white/90 transition-colors tracking-wide"
          >
            {label}
          </button>
        ))}
        <button className="mt-4 text-[11px] border border-white/15 text-white/40 hover:text-white hover:border-white/40 px-4 py-2 rounded-full transition-all">
          Ask me anything...
        </button>
      </div>

      {/* Centre bottom — card nav dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        {/* Dot indicators */}
        <div className="flex gap-2.5">
          {Array.from({ length: totalCards }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? "w-6 h-1.5 bg-emerald-400"
                  : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-4 text-[12px] text-white/40">
          <button
            onClick={onPrev}
            className="hover:text-white/90 transition-colors px-3 py-1 rounded-full border border-white/10 hover:border-white/30"
          >
            ← Prev
          </button>
          <span className="font-mono text-[11px]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
          </span>
          <button
            onClick={onNext}
            className="hover:text-white/90 transition-colors px-3 py-1 rounded-full border border-white/10 hover:border-white/30"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Right edge — current card label */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <p
          className="text-[11px] tracking-[0.15em] uppercase text-white/30 [writing-mode:vertical-rl]"
          style={{ transform: "rotate(180deg)" }}
        >
          {CARD_LABELS[activeIndex]}
        </p>
      </div>
    </>
  );
}

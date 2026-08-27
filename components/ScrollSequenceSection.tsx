"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 300;

/**
 * Each beat is defined by frame positions on the 0-300 timeline.
 * GUARANTEE: fadeOutEnd of beat N < fadeInStart of beat N+1  →  no overlap.
 *
 *  Beat 0 :  in @ 0   → hold @ 40   → out done @ 95
 *  Beat 1 :  in @ 100 → hold @ 140  → out done @ 195
 *  Beat 2 :  in @ 200 → hold @ 240  → out done @ 280
 *  Beat 3 :  in @ 283 → hold @ 295  → out done @ 300
 */
const BEATS = [
  {
    id: "b0",
    heading: "Welcome to Verity",
    body: "The signal-matched hiring platform built for the modern world.",
    fadeInStart: 0,
    fadeInEnd: 40,
    fadeOutStart: 55,
    fadeOutEnd: 95,
  },
  {
    id: "b1",
    heading: "Connecting Professionals",
    body: "Your verified profile becomes your passport across every industry.",
    fadeInStart: 100,
    fadeInEnd: 140,
    fadeOutStart: 155,
    fadeOutEnd: 195,
  },
  {
    id: "b2",
    heading: "Land Your Dream Job",
    body: "Intelligent signals put you in the right room — fast.",
    fadeInStart: 200,
    fadeInEnd: 240,
    fadeOutStart: 252,
    fadeOutEnd: 280,
  },
  {
    id: "b3",
    heading: "Verified. Trusted. Hired.",
    body: "Join thousands of professionals already discovered through Verity.",
    fadeInStart: 283,
    fadeInEnd: 295,
    fadeOutStart: 298,
    fadeOutEnd: 300,
  },
] as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number
) {
  const hue = 250 + progress * 70;
  const hue2 = 200 + progress * 80;
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, `hsl(${hue}, 55%, 7%)`);
  bg.addColorStop(0.6, `hsl(${hue2}, 40%, 11%)`);
  bg.addColorStop(1, `hsl(${hue + 20}, 50%, 5%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 4; i++) {
    const phase = (i / 4 + progress * 0.8) % 1;
    const ox = w * (0.15 + 0.7 * ((Math.sin(phase * Math.PI * 2 + i) + 1) / 2));
    const oy = h * (0.15 + 0.7 * ((Math.cos(phase * Math.PI * 2 + i * 1.3) + 1) / 2));
    const r = Math.min(w, h) * (0.18 + 0.08 * Math.sin(phase * Math.PI));
    const orb = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    orb.addColorStop(0, `hsla(${hue + i * 25}, 80%, 60%, 0.12)`);
    orb.addColorStop(1, "transparent");
    ctx.fillStyle = orb;
    ctx.fillRect(0, 0, w, h);
  }

  const cols = 14, rows = 9;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = (r * cols + c) / (rows * cols);
      const pulse = Math.sin(progress * Math.PI * 6 + t * Math.PI * 8);
      const alpha = 0.04 + 0.09 * ((pulse + 1) / 2);
      const size = 1.5 + 2.5 * ((pulse + 1) / 2);
      ctx.beginPath();
      ctx.arc((c + 0.5) * (w / cols), (r + 0.5) * (h / rows), size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 70%, 70%, ${alpha})`;
      ctx.fill();
    }
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function CanvasScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track the last drawn frame to skip redundant canvas calls
  const drawnFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);
  // Shared frame counter driven by the GSAP timeline
  const frameProxy = useRef({ frame: 0 });

  useEffect(() => {
    // ── Preload images (non-blocking visually, but tracks progress) ──────────
    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      // Using .webp format as requested
      img.src = `/sequence/${(i + 1).toString().padStart(4, "0")}.webp`;
      img.onload = () => {
        framesRef.current[i] = img;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        // Fallback or count it anyway so we don't get stuck infinitely loading
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // Do not initialize ScrollTrigger until fully loaded

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ── Canvas sizing ────────────────────────────────────────────────────────
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(Math.round(frameProxy.current.frame));
    };
    setSize();
    window.addEventListener("resize", setSize);

    // ── Per-frame renderer ───────────────────────────────────────────────────
    function renderFrame(idx: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const img = framesRef.current[idx];

      if (img && img.complete && img.naturalWidth > 0) {
        const ir = img.naturalWidth / img.naturalHeight;
        const cr = w / h;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (ir > cr) { sw = img.naturalHeight * cr; sx = (img.naturalWidth - sw) / 2; }
        else          { sh = img.naturalWidth / cr;  sy = (img.naturalHeight - sh) / 2; }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      } else {
        drawPlaceholder(ctx, w, h, idx / (TOTAL_FRAMES - 1));
      }
    }

    // Draw frame 0 immediately once loaded
    renderFrame(0);

    // ── GSAP: hard-reset text blocks ──
    textRefs.current.forEach((el, i) => {
      if (el) {
        // The first block is visible immediately; all others are hidden
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30, visibility: "visible" });
      }
    });

    // ── Single unified timeline ──────────────────────────────────────────────
    const tl = gsap.timeline({
      defaults: { ease: "none" },
    });

    tl.to(
      frameProxy.current,
      { frame: TOTAL_FRAMES - 1, duration: TOTAL_FRAMES, ease: "none" },
      0
    );

    BEATS.forEach((beat, i) => {
      const el = textRefs.current[i];
      if (!el) return;

      const { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd } = beat;
      const inDur  = fadeInEnd   - fadeInStart;
      const outDur = fadeOutEnd  - fadeOutStart;

      // Fade in (skip for the first block since it starts visible)
      if (i > 0) {
        tl.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: inDur, ease: "power2.out" },
          fadeInStart
        );
      }

      // Fade out (skip for the last block so it remains visible at the end)
      if (i < BEATS.length - 1) {
        tl.fromTo(
          el,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -30, duration: outDur, ease: "power2.in" },
          fadeOutStart
        );
      }
    });

    // ── Bind the unified timeline to scroll ──────────────────────────────────
    ScrollTrigger.create({
      animation: tl,
      trigger: container,
      start: "top top",
      end: "+=400%",
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
      // Optimize: Only render canvas using RAF when scrolling actually updates
      onUpdate: () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          const idx = Math.min(Math.round(frameProxy.current.frame), TOTAL_FRAMES - 1);
          if (idx !== drawnFrameRef.current) {
            renderFrame(idx);
            drawnFrameRef.current = idx;
          }
        });
      }
    });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl.kill();
      window.removeEventListener("resize", setSize);
    };
  }, [isLoaded]);

  const loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* ─── FULL SCREEN PRELOADER ────────────────────────────────────────── */}
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b14] transition-opacity duration-700 pointer-events-none ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center justify-center w-full max-w-sm px-6">
          
          {/* Animated VERITY Logo */}
          <div className="relative flex items-center justify-center">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-[30px] rounded-full animate-pulse" />
            
            <img 
              src="/logo.png" 
              alt="Verity Logo" 
              className="relative w-48 object-contain drop-shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-pulse"
              style={{
                // Optional: slight scale effect based on load progress
                transform: `scale(${0.9 + (loadProgress / 100) * 0.1})`,
                transition: "transform 0.3s ease-out"
              }}
            />
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase animate-pulse">
            <span>Loading Engine</span>
            <span>•</span>
            <span>{loadProgress}%</span>
          </div>

        </div>
      </div>

      <section
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-[#08050f]"
      >
        <div className="absolute inset-0 w-full h-full">
          <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full object-cover" />

          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 20%, rgba(7,11,20,0.85) 100%)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #08050f)" }}
          />

          {BEATS.map((beat, i) => (
            <div
              key={beat.id}
              ref={(el) => { textRefs.current[i] = el; }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none"
              style={{ opacity: i === 0 ? 1 : 0 }}   // CSS initial state (only first block is visible)
            >
              <div className="text-center max-w-2xl w-full">
                <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-400/70 mb-4 font-mono">
                  0{i + 1} — Verity Platform
                </p>
                <h2
                  className="font-display text-[clamp(40px,6vw,76px)] font-bold leading-[1.08] tracking-tight text-white mb-5"
                  style={{
                    textShadow:
                      "0 0 80px rgba(16,185,129,0.5), 0 4px 30px rgba(0,0,0,1)",
                  }}
                >
                  {beat.heading}
                </h2>
                <p className="text-[clamp(14px,1.7vw,18px)] text-white/55 leading-relaxed max-w-[420px] mx-auto">
                  {beat.body}
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="h-px w-10 bg-emerald-500/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <div className="h-px w-10 bg-emerald-500/40" />
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-50 pointer-events-none">
            <p className="text-[9px] text-white/40 tracking-[0.3em] uppercase font-mono">Scroll</p>
            <div className="w-px h-10 bg-gradient-to-b from-emerald-400/60 to-transparent animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}

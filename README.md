# Verity — Next.js Setup Guide

A premium job/talent marketplace with a full-screen Three.js/r3f hero, floating 3D glass cards, glitch transitions, and bloom post-processing — inspired by activetheory.net.

---

## Quick Start

```bash
# 1. Copy all these files into your Next.js project root
# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
```

Open http://localhost:3000

---

## File Structure

```
beacon/
├── app/
│   ├── layout.tsx          ← Root layout (fonts, metadata)
│   ├── page.tsx            ← Home page
│   └── globals.css         ← Tailwind base + CSS vars
│
├── components/
│   ├── HeroSection.tsx     ← Orchestrator: scene + glitch logic + keyboard nav
│   │
│   ├── three/
│   │   ├── Scene.tsx       ← r3f Canvas, lights, env, post-processing
│   │   ├── ParticleField.tsx  ← 2000 additive-blended drifting particles
│   │   ├── JobCard3D.tsx   ← Glass card in 3D space (mouse tilt + drift)
│   │   └── GlitchTransition.tsx ← GLSL shader: scanlines + chroma + flash
│   │
│   └── ui/
│       ├── Navbar.tsx      ← Floating pill nav
│       └── HeroOverlay.tsx ← Sidebar labels + dot nav + counter
│
├── package.json
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── postcss.config.js
```

---

## Key Dependencies

| Package | What it does |
|---|---|
| `three` | 3D engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers: RoundedBox, Text, Environment, Preload |
| `@react-three/postprocessing` | Bloom + Chromatic Aberration effects |
| `postprocessing` | Peer dep for above |
| `framer-motion` | Page transitions (ready to add) |

---

## How the Effects Work

### 1. Particle Field (`ParticleField.tsx`)
- 2,000 `THREE.Points` with `AdditiveBlending` — overlapping particles brighten each other
- Random purple / cyan / pink / white colours per particle
- Whole cloud rotates slowly on Y axis

### 2. 3D Glass Cards (`JobCard3D.tsx`)
- `RoundedBox` + `MeshPhysicalMaterial` with `transmission` for the frosted glass look
- Cards arc across the scene; inactive ones scale down + fade back
- On mouse move, active card tilts in X/Y via `useFrame` lerp
- All position/rotation/scale values lerp smoothly — no snapping

### 3. Glitch Transition (`GlitchTransition.tsx`)
- A fullscreen quad (two triangles covering the whole viewport) with a custom GLSL shader
- The shader runs: scanlines + horizontal slice offset + chromatic aberration + center flash
- `uIntensity` uniform lerps from 0 → 1 on card change, then back to 0

### 4. Post-processing (`Scene.tsx`)
- `Bloom` — makes any bright material/light bleed light (gives the glow to particles and card borders)
- `ChromaticAberration` — subtle RGB shift on the whole canvas, stronger during glitch

### 5. Auto-advance + Keyboard Nav (`HeroSection.tsx`)
- Cards cycle every 5s automatically
- Left/Right arrow keys also work
- Clicking the dot indicators jumps to any card
- Every transition fires the glitch with an 80ms delay so you see the flash *then* the swap

---

## Customising Cards

Edit the `CARDS` array in `components/three/Scene.tsx`:

```ts
const CARDS: CardData[] = [
  {
    type: "job",          // "job" = violet glow | "talent" = cyan glow
    title: "Your Role Title",
    company: "Company · Location",
    tag1: "Full-time",
    tag2: "React",
    rate: "$90k",
    index: 0,             // must match position in array
    total: 5,             // must match array length
  },
  // ...
];
```

---

## Adding Fonts (Optional — for Text labels in 3D)

`@react-three/drei`'s `<Text>` component loads `.woff` fonts from your `/public/fonts/` folder.

Download and place these (or any font you prefer):
```
public/
└── fonts/
    ├── SpaceGrotesk-SemiBold.woff
    ├── SpaceGrotesk-Medium.woff
    └── Inter-Regular.woff
```

Without the fonts, `<Text>` falls back to a built-in default — the cards still show text, just in the default face.

---

## Performance Tips

- `dpr={[1, 1.5]}` in Canvas caps pixel ratio on high-DPI screens — prevents GPU overload
- `powerPreference: "high-performance"` tells the browser to use the discrete GPU
- If you need to support lower-end devices, reduce `count` in `ParticleField` to 800–1000
- The `<Bloom>` `mipmapBlur` prop is more GPU-friendly than the legacy method

---

## Next Steps to Build Out

1. **Jobs page** `/app/jobs/page.tsx` — list view with filter sidebar
2. **Talent page** `/app/talent/page.tsx` — profile grid
3. **Search** — connect the search bar to a real API / database
4. **Auth** — add Clerk or NextAuth for sign-in
5. **DB** — Prisma + PostgreSQL or Supabase for job/talent records

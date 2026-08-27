"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Environment, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import ParticleField from "./ParticleField";
import JobCard3D, { CardData } from "./JobCard3D";
import GlitchTransition from "./GlitchTransition";

const CanvasComponent = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

const CARDS: CardData[] = [
  { type: "job",    title: "Senior Product Designer",   company: "Orbital Studio · Remote",   tag1: "Full-time", tag2: "UX/Product", rate: "$95k–120k", index: 0, total: 5 },
  { type: "talent", title: "Maya R. — Backend Eng.",    company: "Distributed systems · 6 yrs", tag1: "Available", tag2: "Go / Rust",  rate: "$70/hr",    index: 1, total: 5 },
  { type: "job",    title: "Growth Marketing Lead",     company: "Northlane · Hybrid, Berlin", tag1: "Contract",  tag2: "B2B SaaS",   rate: "€60k",      index: 2, total: 5 },
  { type: "talent", title: "Dev Osei — Motion Design",  company: "Brand & product · 4 yrs",    tag1: "Freelance", tag2: "After Effects", rate: "$55/hr", index: 3, total: 5 },
  { type: "job",    title: "Staff iOS Engineer",         company: "Crestline · Remote",          tag1: "Full-time", tag2: "Swift/SwiftUI", rate: "$140k+",  index: 4, total: 5 },
];

interface SceneProps {
  activeIndex: number;
  glitching: boolean;
}

function SceneInner({ activeIndex, glitching }: SceneProps) {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.15} />
      <pointLight position={[-4, 3, 2]} intensity={4} color="#A855F7" />
      <pointLight position={[4, -2, 1]} intensity={3} color="#06B6D4" />
      <pointLight position={[0, 2, -2]} intensity={2} color="#EC4899" />
      <spotLight
        position={[0, 6, 3]}
        angle={0.45}
        penumbra={0.8}
        intensity={6}
        color="#C4B5FD"
        castShadow={false}
      />

      <ParticleField count={2000} />

      {CARDS.map((card) => (
        <JobCard3D
          key={card.index}
          data={card}
          isActive={card.index === activeIndex}
          glitching={glitching}
        />
      ))}

      <GlitchTransition active={glitching} />

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.6}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(glitching ? 0.006 : 0.001, glitching ? 0.004 : 0.0005)}
        />
      </EffectComposer>

      <Preload all />
    </>
  );
}

interface SceneWrapperProps {
  activeIndex: number;
  glitching: boolean;
}

export default function Scene({ activeIndex, glitching }: SceneWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#08050f]" />;
  }

  return (
    <CanvasComponent
      camera={{ position: [0, 0, 5.5], fov: 55 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#08050f"]} />
      <fog attach="fog" args={["#08050f", 12, 28]} />
      <Suspense fallback={null}>
        <SceneInner activeIndex={activeIndex} glitching={glitching} />
      </Suspense>
    </CanvasComponent>
  );
}

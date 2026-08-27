"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
}

export default function ParticleField({ count = 1800 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null!);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const purpleColor = new THREE.Color("#7C3AED");
    const cyanColor = new THREE.Color("#06B6D4");
    const pinkColor = new THREE.Color("#EC4899");
    const whiteColor = new THREE.Color("#E2D9F3");
    const palette = [purpleColor, cyanColor, pinkColor, whiteColor];

    for (let i = 0; i < count; i++) {
      // Spread in a wide volume around the scene
      positions[i * 3]     = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 0.06 + 0.01;
    }

    return { positions, colors, sizes };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, colors, sizes]);

  // Subtle drift animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.018;
    meshRef.current.rotation.x = Math.sin(t * 0.009) * 0.05;
  });

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return <points ref={meshRef} geometry={geo} material={mat} />;
}

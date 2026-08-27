"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

export interface CardData {
  type: "job" | "talent";
  title: string;
  company: string;
  tag1: string;
  tag2: string;
  rate: string;
  index: number;
  total: number;
}

interface JobCard3DProps {
  data: CardData;
  isActive: boolean;
  glitching: boolean;
}

export default function JobCard3D({ data, isActive, glitching }: JobCard3DProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // Spread cards in an arc
  const angle = ((data.index - (data.total - 1) / 2) / data.total) * Math.PI * 0.55;
  const radius = 5.5;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius + radius;
  const baseY = isActive ? 0 : -0.3;
  const baseScale = isActive ? 1 : 0.72;
  const baseOpacity = isActive ? 1 : 0.4;

  const glowColor = data.type === "job" ? "#A855F7" : "#06B6D4";
  const accentColor = data.type === "job" ? "#C084FC" : "#67E8F9";

  // Smooth interpolation targets
  const lerpRef = useRef({
    x: baseX, y: baseY, z: baseZ,
    rx: 0, ry: 0,
    scale: baseScale,
    opacity: baseOpacity,
    glitch: 0,
  });

  useFrame(({ mouse, clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const lr = lerpRef.current;

    // Target values
    const targetX = baseX + (isActive ? mouse.x * 0.4 : 0);
    const targetY = baseY + Math.sin(t * 0.6 + data.index) * 0.08 + (isActive ? mouse.y * 0.2 : 0);
    const targetZ = baseZ;
    const targetRY = isActive ? mouse.x * 0.12 : angle * 0.3;
    const targetRX = isActive ? -mouse.y * 0.08 : 0;
    const targetScale = baseScale;
    const targetOpacity = baseOpacity;
    const targetGlitch = glitching && isActive ? 1 : 0;

    // Lerp everything
    lr.x     = THREE.MathUtils.lerp(lr.x, targetX, 0.06);
    lr.y     = THREE.MathUtils.lerp(lr.y, targetY, 0.06);
    lr.z     = THREE.MathUtils.lerp(lr.z, targetZ, 0.06);
    lr.ry    = THREE.MathUtils.lerp(lr.ry, targetRY, 0.05);
    lr.rx    = THREE.MathUtils.lerp(lr.rx, targetRX, 0.05);
    lr.scale = THREE.MathUtils.lerp(lr.scale, targetScale, 0.08);
    lr.glitch = THREE.MathUtils.lerp(lr.glitch, targetGlitch, 0.12);

    groupRef.current.position.set(lr.x, lr.y, lr.z);
    groupRef.current.rotation.y = lr.ry;
    groupRef.current.rotation.x = lr.rx;
    groupRef.current.scale.setScalar(lr.scale);

    // Glitch offset on active card
    if (glitching && isActive) {
      groupRef.current.position.x += (Math.random() - 0.5) * 0.08 * lr.glitch;
      groupRef.current.position.y += (Math.random() - 0.5) * 0.04 * lr.glitch;
    }
  });

  const cardMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(data.type === "job" ? "#1a0a2e" : "#031020"),
        transparent: true,
        opacity: 0.55,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.3,
        thickness: 0.5,
        envMapIntensity: 1.2,
      }),
    [data.type]
  );

  return (
    <group ref={groupRef}>
      {/* Glass card body */}
      <RoundedBox args={[2.8, 1.8, 0.06]} radius={0.08} smoothness={4}>
        <primitive object={cardMat} attach="material" />
      </RoundedBox>

      {/* Glow border */}
      <RoundedBox args={[2.82, 1.82, 0.055]} radius={0.082} smoothness={4}>
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isActive ? 0.35 : 0.1}
          side={THREE.BackSide}
        />
      </RoundedBox>

      {/* Type badge */}
      <Text
        position={[-1.1, 0.68, 0.05]}
        fontSize={0.1}
        color={accentColor}
        anchorX="left"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Medium.woff"
      >
        {data.type === "job" ? "▲ ROLE" : "◆ TALENT"}
      </Text>

      {/* Title */}
      <Text
        position={[-1.1, 0.38, 0.05]}
        fontSize={0.185}
        color="#F1EEE6"
        anchorX="left"
        anchorY="middle"
        maxWidth={2.4}
        font="/fonts/SpaceGrotesk-SemiBold.woff"
      >
        {data.title}
      </Text>

      {/* Company */}
      <Text
        position={[-1.1, 0.12, 0.05]}
        fontSize={0.12}
        color="#8B93A7"
        anchorX="left"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        {data.company}
      </Text>

      {/* Divider */}
      <mesh position={[0, -0.08, 0.04]}>
        <planeGeometry args={[2.5, 0.005]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.25} />
      </mesh>

      {/* Tag 1 */}
      <Text
        position={[-1.1, -0.3, 0.05]}
        fontSize={0.1}
        color="#6B7280"
        anchorX="left"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        {data.tag1}
      </Text>

      {/* Tag 2 */}
      <Text
        position={[-0.3, -0.3, 0.05]}
        fontSize={0.1}
        color="#6B7280"
        anchorX="left"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        · {data.tag2}
      </Text>

      {/* Rate */}
      <Text
        position={[1.1, -0.3, 0.05]}
        fontSize={0.115}
        color={accentColor}
        anchorX="right"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Medium.woff"
      >
        {data.rate}
      </Text>
    </group>
  );
}

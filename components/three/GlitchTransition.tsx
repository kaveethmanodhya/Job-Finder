"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlitchTransitionProps {
  active: boolean;
}

// Fullscreen quad shader — chromatic aberration + scanlines + flash
const glitchVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const glitchFrag = `
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // Scanlines
  float scan = step(0.5, fract(uv.y * 80.0 + uTime * 30.0));
  float scanAlpha = scan * 0.18 * uIntensity;

  // Horizontal slice glitch
  float sliceY = floor(uv.y * 24.0) / 24.0;
  float sliceRand = random(vec2(sliceY, floor(uTime * 20.0)));
  float sliceShift = (sliceRand - 0.5) * 0.04 * uIntensity;
  uv.x += sliceShift;

  // Chromatic aberration
  float ca = 0.012 * uIntensity;
  float r = random(uv + vec2(ca, 0.0));
  float g = random(uv);
  float b = random(uv - vec2(ca, 0.0));

  // White flash center
  float dist = length(vUv - 0.5);
  float flash = (1.0 - smoothstep(0.0, 0.7, dist)) * uIntensity * 0.6;

  // Noise overlay
  float noise = random(uv + uTime) * 0.15 * uIntensity;

  vec3 col = vec3(noise + scanAlpha + flash);
  col.r += r * 0.1 * uIntensity;
  col.g += g * 0.08 * uIntensity;
  col.b += b * 0.12 * uIntensity;

  float alpha = clamp((scanAlpha + flash + noise + (r + g + b) * 0.05 * uIntensity), 0.0, 1.0);
  gl_FragColor = vec4(col, alpha * uIntensity);
}
`;

export default function GlitchTransition({ active }: GlitchTransitionProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const intensityRef = useRef(0);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const target = active ? 1.0 : 0.0;
    intensityRef.current = THREE.MathUtils.lerp(intensityRef.current, target, active ? 0.18 : 0.08);
    matRef.current.uniforms.uIntensity.value = intensityRef.current;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, 2]} renderOrder={999}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={glitchVert}
        fragmentShader={glitchFrag}
        transparent
        depthTest={false}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 0 },
        }}
      />
    </mesh>
  );
}

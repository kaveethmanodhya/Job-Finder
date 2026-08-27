"use client";

import dynamic from "next/dynamic";

// ssr: false is only permitted inside a Client Component
const CanvasScrollSequence = dynamic(
  () => import("@/components/ScrollSequenceSection"),
  { ssr: false }
);

export default function ScrollSequenceSectionClient() {
  return <CanvasScrollSequence />;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import {
  ARCHIVE_CYCLE_MS,
  type ArchiveFrame,
  type ArchiveQuadFrame,
} from "@/content/archive";

export interface ArchiveCycleTileProps {
  frames: ArchiveFrame[];
  alt: string;
  /** CSS aspect-ratio value; defaults to square. */
  aspect?: string;
}

/** One beat in the flattened cycle. */
type CycleStep =
  | { kind: "image"; src: string }
  | {
      kind: "quad-cells";
      background: string;
      images: [string, string, string, string];
      /** How many cells are visible this beat (1–4), in reading order. */
      visibleCount: number;
    };

/**
 * Expand authored frames into cycle beats: image frames pass through; quad
 * frames become progressive cell reveals, then one full-bleed still per cell.
 */
function expandFrames(frames: ArchiveFrame[]): CycleStep[] {
  const steps: CycleStep[] = [];
  for (const frame of frames) {
    if (frame.type === "image") {
      steps.push({ kind: "image", src: frame.src });
      continue;
    }
    for (let visibleCount = 1; visibleCount <= frame.images.length; visibleCount++) {
      steps.push({
        kind: "quad-cells",
        background: frame.background,
        images: frame.images,
        visibleCount,
      });
    }
    for (const src of frame.images) {
      steps.push({ kind: "image", src });
    }
  }
  return steps;
}

function QuadCellsFrame({
  background,
  images,
  visibleCount,
}: {
  background: string;
  images: ArchiveQuadFrame["images"];
  visibleCount: number;
}) {
  // Padding and gap share one measure so the black border matches the
  // corridors between cells.
  const inset = "3%";

  return (
    <div
      className="absolute inset-0 grid grid-cols-2 grid-rows-2"
      style={{
        backgroundColor: background,
        padding: inset,
        gap: inset,
      }}
    >
      {images.map((src, i) => (
        <div key={src} className="relative min-h-0 min-w-0 overflow-hidden">
          {i < visibleCount ? (
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StepLayer({ step, active }: { step: CycleStep; active: boolean }) {
  return (
    <div
      className={`absolute inset-0 ${active ? "opacity-100" : "opacity-0"}`}
      aria-hidden={!active}
    >
      {step.kind === "image" ? (
        <Image
          src={step.src}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : (
        <QuadCellsFrame
          background={step.background}
          images={step.images}
          visibleCount={step.visibleCount}
        />
      )}
    </div>
  );
}

/**
 * Hover-only archive still cycle at {@link ARCHIVE_CYCLE_MS}. Quad frames
 * progress cell-by-cell, then each cell still full-bleed. Click pauses /
 * resumes while hovered. Play/pause icon top-right as the click affordance.
 * Resets on mouse leave. Honors `prefers-reduced-motion`.
 */
export function ArchiveCycleTile({
  frames,
  alt,
  aspect = "1 / 1",
}: ArchiveCycleTileProps) {
  const reduceMotion = useReducedMotion();
  const steps = useMemo(() => expandFrames(frames), [frames]);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const canCycle = steps.length > 1 && !reduceMotion;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!hovered || !canCycle || paused) {
      if (!hovered) {
        setIndex(0);
        indexRef.current = 0;
        setPaused(false);
      }
      return;
    }

    let cancelled = false;
    let timeoutId = 0;

    const schedule = (fromIndex: number) => {
      const step = steps[fromIndex];
      if (!step) return;
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const next = (fromIndex + 1) % steps.length;
        indexRef.current = next;
        setIndex(next);
        schedule(next);
      }, ARCHIVE_CYCLE_MS);
    };

    schedule(indexRef.current);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [hovered, paused, canCycle, steps]);

  if (steps.length === 0) return null;

  const togglePause = () => {
    if (!canCycle || !hovered) return;
    setPaused((value) => !value);
  };

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`${alt}${paused ? " (paused)" : ""}`}
      aria-pressed={canCycle ? paused : undefined}
      tabIndex={canCycle ? 0 : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={togglePause}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          togglePause();
        }
      }}
    >
      {steps.map((step, i) => (
        <StepLayer
          key={
            step.kind === "image"
              ? `image-${step.src}-${i}`
              : `quad-${step.visibleCount}-${step.images.slice(0, step.visibleCount).join("-")}`
          }
          step={step}
          active={i === index}
        />
      ))}

      {!reduceMotion && canCycle ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-10 text-secondary"
        >
          <Icon
            name={hovered && !paused ? "pause" : "play"}
            size={20}
          />
        </span>
      ) : null}
    </div>
  );
}

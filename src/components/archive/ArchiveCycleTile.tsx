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
      gutters: boolean;
    }
  | {
      kind: "video";
      src: string;
      background: string;
      playbackRate: number;
    };

/**
 * Expand authored frames into cycle beats: image/video frames pass through;
 * quad frames become progressive cell reveals, then one full-bleed still per
 * cell.
 */
function expandFrames(frames: ArchiveFrame[]): CycleStep[] {
  const steps: CycleStep[] = [];
  for (const frame of frames) {
    if (frame.type === "image") {
      steps.push({ kind: "image", src: frame.src });
      continue;
    }
    if (frame.type === "video") {
      steps.push({
        kind: "video",
        src: frame.src,
        background: frame.background,
        playbackRate: frame.playbackRate ?? 1,
      });
      continue;
    }
    const gutters = frame.gutters !== false;
    for (let visibleCount = 1; visibleCount <= frame.images.length; visibleCount++) {
      steps.push({
        kind: "quad-cells",
        background: frame.background,
        images: frame.images,
        visibleCount,
        gutters,
      });
    }
    for (const src of frame.images) {
      steps.push({ kind: "image", src });
    }
  }
  return steps;
}

/** Rest on the completed gallery when the cycle opens with a quad. */
function restingIndex(steps: CycleStep[]): number {
  const first = steps[0];
  if (first?.kind !== "quad-cells") return 0;
  const full = steps.findIndex(
    (step) =>
      step.kind === "quad-cells" &&
      step.visibleCount === step.images.length,
  );
  return full >= 0 ? full : 0;
}

function QuadCellsFrame({
  background,
  images,
  visibleCount,
  gutters,
}: {
  background: string;
  images: ArchiveQuadFrame["images"];
  visibleCount: number;
  gutters: boolean;
}) {
  // Padding and gap share one measure so the border matches the corridors
  // between cells (Lex). Flush when `gutters` is false (Chibi-K).
  const inset = gutters ? "3%" : "0";

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

function VideoFrame({
  src,
  background,
  playbackRate,
  active,
  playing,
  onEnded,
}: {
  src: string;
  background: string;
  playbackRate: number;
  active: boolean;
  playing: boolean;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.playbackRate = playbackRate;
    if (!active) {
      node.pause();
      node.currentTime = 0;
      return;
    }
    if (playing) {
      void node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [active, playing, playbackRate, src]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: background }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        className="max-h-full max-w-full object-contain"
        onEnded={() => {
          if (active && playing) onEnded();
        }}
      />
    </div>
  );
}

function StepLayer({
  step,
  active,
  playing,
  onVideoEnded,
}: {
  step: CycleStep;
  active: boolean;
  playing: boolean;
  onVideoEnded: () => void;
}) {
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
      ) : step.kind === "video" ? (
        <VideoFrame
          src={step.src}
          background={step.background}
          playbackRate={step.playbackRate}
          active={active}
          playing={playing}
          onEnded={onVideoEnded}
        />
      ) : (
        <QuadCellsFrame
          background={step.background}
          images={step.images}
          visibleCount={step.visibleCount}
          gutters={step.gutters}
        />
      )}
    </div>
  );
}

function stepKey(step: CycleStep, index: number): string {
  if (step.kind === "image") return `image-${step.src}-${index}`;
  if (step.kind === "video") return `video-${step.src}-${index}`;
  return `quad-${step.visibleCount}-${step.images.slice(0, step.visibleCount).join("-")}`;
}

/**
 * Hover-only archive cycle at {@link ARCHIVE_CYCLE_MS} for stills / quads.
 * Video beats play through at their `playbackRate` and advance on `ended`.
 * Cycles that open with a quad rest on the completed gallery; after the last
 * beat they wrap back to that gallery (skipping the progressive rebuild).
 * Click pauses / resumes while hovered. Resets on mouse leave. Honors
 * `prefers-reduced-motion`.
 */
export function ArchiveCycleTile({
  frames,
  alt,
  aspect = "1 / 1",
}: ArchiveCycleTileProps) {
  const reduceMotion = useReducedMotion();
  const steps = useMemo(() => expandFrames(frames), [frames]);
  const restIndex = useMemo(() => restingIndex(steps), [steps]);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(restIndex);
  const indexRef = useRef(restIndex);
  const restIndexRef = useRef(restIndex);
  const stepsLengthRef = useRef(steps.length);
  const canCycle = steps.length > 1 && !reduceMotion;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    restIndexRef.current = restIndex;
  }, [restIndex]);

  useEffect(() => {
    stepsLengthRef.current = steps.length;
  }, [steps.length]);

  const advance = () => {
    const nextLinear = indexRef.current + 1;
    // Wrap to the resting gallery (full 2×2) instead of replaying the
    // progressive cell buildup — softens demo → cycle loops.
    const next =
      nextLinear >= stepsLengthRef.current
        ? restIndexRef.current
        : nextLinear;
    indexRef.current = next;
    setIndex(next);
  };

  useEffect(() => {
    if (!hovered || !canCycle || paused) {
      if (!hovered) {
        setIndex(restIndex);
        indexRef.current = restIndex;
        setPaused(false);
      }
      return;
    }

    const step = steps[index];
    if (!step || step.kind === "video") return;

    const timeoutId = window.setTimeout(() => {
      advance();
    }, ARCHIVE_CYCLE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hovered, paused, canCycle, steps, index, restIndex]);

  if (steps.length === 0) return null;

  const togglePause = () => {
    if (!canCycle || !hovered) return;
    setPaused((value) => !value);
  };

  const playing = hovered && !paused;

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`${alt}${paused ? " (paused)" : ""}`}
      aria-pressed={canCycle ? paused : undefined}
      tabIndex={canCycle ? 0 : undefined}
      onMouseEnter={() => {
        setHovered(true);
        setIndex(0);
        indexRef.current = 0;
      }}
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
          key={stepKey(step, i)}
          step={step}
          active={i === index}
          playing={playing}
          onVideoEnded={advance}
        />
      ))}

      {!reduceMotion && canCycle ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-10 text-secondary"
        >
          <Icon name={hovered && !paused ? "pause" : "play"} size={20} />
        </span>
      ) : null}
    </div>
  );
}

"use client";

import { useReducedMotion } from "framer-motion";
import type { CaseStudyTone } from "@/lib/case-study-palette";

/** Fractal noise tile — used as a luminance mask over a lighter tone mix. */
const NOISE_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export interface ToneGrainProps {
  /** Case-study palette tone — grain speckles are a lighter mix of `--cs-{tone}`. */
  tone: CaseStudyTone;
}

/**
 * Living film-grain overlay for toned case-study surfaces (`InsightCard`,
 * `FullBleedBanner`). Speckles are a lighter mix of the card tone, soft-light
 * blended so the fill color stays true (no muddy darkening). Clips via
 * `rounded-[inherit]`. Animation is skipped when `prefers-reduced-motion`.
 */
export function ToneGrain({ tone }: ToneGrainProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div
        className={`absolute inset-[-40%] h-[180%] w-[180%] opacity-50 mix-blend-soft-light ${
          reduceMotion ? "" : "motion-safe:animate-tone-grain"
        }`}
        style={{
          backgroundColor: `color-mix(in srgb, var(--cs-${tone}) 45%, white)`,
          maskImage: NOISE_URL,
          WebkitMaskImage: NOISE_URL,
          maskSize: "260px 260px",
          WebkitMaskSize: "260px 260px",
          maskRepeat: "repeat",
          WebkitMaskRepeat: "repeat",
        }}
      />
    </div>
  );
}

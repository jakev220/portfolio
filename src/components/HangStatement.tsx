"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface HangStatementProps {
  /** Hang-indent label (e.g. "About"). Stays secondary; not part of the reveal. */
  label: string;
  /** Statement copy that colors from secondary → primary on scroll. */
  body: string;
  /** Semantic element for the hang label. Defaults to `h1`. */
  labelAs?: "h1" | "h2" | "p" | "span";
  className?: string;
}

type BodyToken =
  | { key: string; kind: "space"; token: string }
  | { key: string; kind: "word"; token: string; index: number };

function tokenize(body: string): { tokens: BodyToken[]; wordCount: number } {
  const parts = body.split(/(\s+)/);
  const tokens: BodyToken[] = [];
  let wordIndex = 0;

  for (let i = 0; i < parts.length; i++) {
    const token = parts[i]!;
    if (/^\s+$/.test(token)) {
      tokens.push({ key: `s-${i}`, kind: "space", token });
    } else if (token.length > 0) {
      tokens.push({ key: `w-${i}`, kind: "word", token, index: wordIndex });
      wordIndex += 1;
    }
  }

  return { tokens, wordCount: wordIndex };
}

/**
 * Wrap-under hang statement with a scroll-linked color reveal on the body.
 *
 * Desktop: label floats at **2 columns** of the 12-col / `gap-4` grid. Box
 * height matches one `text-h1` line (`3rem × 1.2`) with `items-end`, so the
 * label sits on the bottom of the first body line. Following lines wrap under
 * full-width. Mobile: label stacks above the body (no float).
 *
 * Words interpolate `text-secondary` → `text-primary` as the section scrolls
 * through the viewport. Honors `prefers-reduced-motion`.
 */
export function HangStatement({
  label,
  body,
  labelAs: LabelTag = "h1",
  className,
}: HangStatementProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Wider range = slower fill. Starts as the block enters, finishes after
    // the whole statement has traveled well into the upper viewport.
    offset: ["start 0.95", "end 0.45"],
  });

  const { tokens, wordCount } = tokenize(body);

  return (
    <section ref={ref} className={className}>
      <LabelTag className="text-label text-secondary float-none mb-4 flex w-full items-end font-normal md:float-left md:mb-0 md:h-[calc(3rem*1.2)] md:w-[calc((100%-11rem)/6+1rem)] md:pr-4">
        {label}
      </LabelTag>
      <p
        className={`text-h1 m-0 ${reduceMotion ? "text-primary" : "text-secondary"}`}
      >
        {reduceMotion
          ? body
          : tokens.map((item) => {
              if (item.kind === "space") {
                return <span key={item.key}>{item.token}</span>;
              }

              return (
                <RevealWord
                  key={item.key}
                  progress={scrollYProgress}
                  index={item.index}
                  count={wordCount}
                >
                  {item.token}
                </RevealWord>
              );
            })}
      </p>
    </section>
  );
}

function RevealWord({
  children,
  progress,
  index,
  count,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
}) {
  // Stagger each word across the scroll range with a soft overlap so the
  // fill feels continuous rather than a hard cursor sweep.
  const span = 1 / Math.max(count, 1);
  const start = index * span;
  const end = Math.min(start + span * 1.8, 1);

  // Interpolate a mix % then build color-mix() so themes stay live (CSS vars
  // don't interpolate as raw color strings in Motion).
  const mix = useTransform(progress, [start, end], [0, 100]);
  const color = useTransform(
    mix,
    (value) =>
      `color-mix(in srgb, var(--color-text-primary) ${value}%, var(--color-text-secondary))`,
  );

  return <motion.span style={{ color }}>{children}</motion.span>;
}

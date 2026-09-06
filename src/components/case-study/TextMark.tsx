"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import type { CaseStudyTone } from "@/lib/case-study-palette";
import {
  MARK_REVEAL_MS,
  markFill,
  markHighlightInk,
} from "@/components/case-study/mark-accent";

export interface HighlightProps {
  /**
   * Case-study palette tone for the fill (`purple`, `orange`, …). Omit to use
   * theme primary (black in light mode, near-white in dark).
   */
  accent?: CaseStudyTone;
  children: ReactNode;
}

function useMarkReveal() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed, reduceMotion: Boolean(reduceMotion) };
}

/**
 * Inline highlight mark for MDX. Fills ~2px past the glyphs with rounded
 * corners; ink is black or white for contrast. On enter, the fill wipes
 * left → right once (instant when `prefers-reduced-motion`).
 *
 * @example
 * How do we build an <Highlight accent="purple">agentic feedback system</Highlight>
 */
export function Highlight({ accent, children }: HighlightProps) {
  const { ref, revealed, reduceMotion } = useMarkReveal();
  const fill = markFill(accent);
  const ink = markHighlightInk(accent);
  const on = revealed;

  const overlayStyle: CSSProperties = {
    backgroundColor: fill,
    color: ink,
    clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
    transition: reduceMotion
      ? undefined
      : `clip-path ${MARK_REVEAL_MS}ms ease-out`,
  };

  return (
    <span
      ref={ref}
      className="relative inline-grid grid-cols-1 grid-rows-1 [&>*]:col-start-1 [&>*]:row-start-1"
    >
      <span className="rounded-[4px] px-[2px] py-[2px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
        {children}
      </span>
      <span
        aria-hidden
        className="rounded-[4px] px-[2px] py-[2px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
        style={overlayStyle}
      >
        {children}
      </span>
    </span>
  );
}

export interface UnderlineProps {
  /**
   * Case-study palette tone for the stroke. Omit to use theme primary
   * (black in light mode, near-white in dark).
   */
  accent?: CaseStudyTone;
  children: ReactNode;
}

/**
 * Inline underline mark for MDX. ~4px stroke under the word(s) with rounded
 * caps (end dots + middle bar). Uses `box-decoration-break: clone` so a phrase
 * that wraps gets a continuous stroke per line (one bar when on a single
 * line). Wipes left → right once on enter (instant when `prefers-reduced-motion`).
 *
 * @example
 * offers <Underline accent="purple">multiple perspectives</Underline>
 */
export function Underline({ accent, children }: UnderlineProps) {
  const { ref, revealed, reduceMotion } = useMarkReveal();
  const fill = markFill(accent);
  const on = revealed;

  return (
    <span
      ref={ref}
      className="inline pb-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        // Round caps = 4×4 radial dots; middle bar fills the gap. All three
        // clone per line via box-decoration-break.
        backgroundImage: [
          `radial-gradient(circle closest-side, ${fill} 100%, transparent)`,
          `radial-gradient(circle closest-side, ${fill} 100%, transparent)`,
          `linear-gradient(${fill}, ${fill})`,
        ].join(", "),
        backgroundRepeat: "no-repeat",
        backgroundSize: on
          ? "4px 4px, 4px 4px, calc(100% - 4px) 4px"
          : "0px 0px, 0px 0px, 0px 4px",
        backgroundPosition: on
          ? "left bottom, right bottom, left 2px bottom"
          : "left bottom, left bottom, left 2px bottom",
        transition: reduceMotion
          ? undefined
          : `background-size ${MARK_REVEAL_MS}ms ease-out, background-position ${MARK_REVEAL_MS}ms ease-out`,
      }}
    >
      {children}
    </span>
  );
}

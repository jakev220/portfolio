"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { AboutResume } from "@/components/about/AboutResume";
import {
  CURSOR_PREVIEW_HEIGHT,
  CURSOR_PREVIEW_WIDTH,
} from "@/lib/cursor-preview";
import type { AboutResumeSection } from "@/content/about";

export interface AboutJourneyProps {
  heading: string;
  sections: AboutResumeSection[];
}

interface ActivePreview {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  unoptimized?: boolean;
}

/** Max horizontal drift (px) while Y tracks the cursor — keeps the still in-rail. */
const PREVIEW_FOLLOW_X_MAX = 24;

/** Soft spring so the still eases after the cursor instead of locking to it. */
const FOLLOW_SPRING = { stiffness: 80, damping: 14, mass: 0.55 };

/**
 * About “Journey” block: left-rail heading + cursor-follow still preview,
 * right-rail resume stack. Preview is lg + fine-pointer only; Y tracks the
 * cursor (clamped under the heading), with a slight X drift in the rail.
 * Position eases on a soft spring for a floaty follow.
 */
export function AboutJourney({ heading, sections }: AboutJourneyProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hoverCapable = useRef(false);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<ActivePreview | null>(null);
  const springTop = useSpring(0, FOLLOW_SPRING);
  const springLeft = useSpring(0, FOLLOW_SPRING);

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  // Prefetch resume stills so row-to-row swaps don’t flash the previous image.
  useEffect(() => {
    const urls = sections.flatMap((section) =>
      section.entries
        .map((entry) => entry.preview)
        .filter((src): src is string => Boolean(src)),
    );
    for (const src of urls) {
      const img = new window.Image();
      img.src = src;
    }
  }, [sections]);

  const applyPosition = (
    nextTop: number,
    nextLeft: number,
    snap: boolean,
  ) => {
    if (snap || reduceMotion) {
      springTop.jump(nextTop);
      springLeft.jump(nextLeft);
      return;
    }
    springTop.set(nextTop);
    springLeft.set(nextLeft);
  };

  const updatePreviewPosition = (
    clientX: number,
    clientY: number,
    snap = false,
  ) => {
    const rail = railRef.current;
    if (!rail) return;

    const railRect = rail.getBoundingClientRect();
    const headingBottom = headingRef.current
      ? headingRef.current.getBoundingClientRect().bottom - railRect.top + 16
      : 0;
    const maxTop = Math.max(
      headingBottom,
      railRect.height - CURSOR_PREVIEW_HEIGHT,
    );
    const nextTop = Math.min(
      maxTop,
      Math.max(
        headingBottom,
        clientY - railRect.top - CURSOR_PREVIEW_HEIGHT / 2,
      ),
    );

    // Slight X follow: map cursor across the Journey grid into a small
    // in-rail offset so the still drifts without leaving the column.
    const gridRect =
      rail.parentElement?.getBoundingClientRect() ?? railRect;
    const available = Math.max(0, railRect.width - CURSOR_PREVIEW_WIDTH);
    const range = Math.min(available, PREVIEW_FOLLOW_X_MAX);
    const progress = Math.min(
      1,
      Math.max(0, (clientX - gridRect.left) / Math.max(1, gridRect.width)),
    );
    const nextLeft = progress * range;

    applyPosition(nextTop, nextLeft, snap);
  };

  const handlePreviewEnter = (
    event: MouseEvent,
    preview: ActivePreview,
  ) => {
    if (!hoverCapable.current) return;
    setActive(preview);
    // Land on the cursor, then spring on subsequent moves.
    updatePreviewPosition(event.clientX, event.clientY, true);
  };

  const handlePreviewMove = (event: MouseEvent) => {
    if (!hoverCapable.current) return;
    updatePreviewPosition(event.clientX, event.clientY);
  };

  const handlePreviewLeave = () => {
    setActive(null);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-4">
      <div
        ref={railRef}
        className="relative min-w-0 lg:col-span-4 lg:self-stretch"
      >
        <h2
          ref={headingRef}
          className="text-h2 text-primary m-0 min-w-0"
        >
          {heading}
        </h2>

        <AnimatePresence mode="sync">
          {active ? (
            <motion.div
              key="journey-preview-frame"
              aria-hidden
              className="pointer-events-none absolute z-10 hidden overflow-hidden rounded-xl border border-border bg-surface shadow-lg lg:block"
              style={{
                width: CURSOR_PREVIEW_WIDTH,
                top: springTop,
                left: springLeft,
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.2, ease: "easeOut" },
                      scale: {
                        type: "spring",
                        stiffness: 260,
                        damping: 16,
                        mass: 0.7,
                      },
                    }
              }
            >
              <div
                className={`relative aspect-[842/540] ${
                  active.fit === "contain" ? "bg-black" : ""
                }`}
              >
                {/* Key by src so Next/Image remounts immediately on row change. */}
                <Image
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  fill
                  unoptimized={active.unoptimized}
                  quality={100}
                  className={
                    active.fit === "contain" ? "object-contain" : "object-cover"
                  }
                  sizes={`${CURSOR_PREVIEW_WIDTH}px`}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="min-w-0 lg:col-span-7 lg:col-start-6">
        <AboutResume
          sections={sections}
          onPreviewEnter={handlePreviewEnter}
          onPreviewMove={handlePreviewMove}
          onPreviewLeave={handlePreviewLeave}
        />
      </div>
    </div>
  );
}

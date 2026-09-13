"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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

/**
 * About “Journey” block: left-rail heading + cursor-follow still preview,
 * right-rail resume stack. Preview is lg + fine-pointer only; X stays in the
 * rail under the heading while Y tracks the cursor (clamped).
 */
export function AboutJourney({ heading, sections }: AboutJourneyProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hoverCapable = useRef(false);
  const [active, setActive] = useState<ActivePreview | null>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const updatePreviewPosition = (clientY: number) => {
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
    const next = clientY - railRect.top - CURSOR_PREVIEW_HEIGHT / 2;
    setTop(Math.min(maxTop, Math.max(headingBottom, next)));
  };

  const handlePreviewEnter = (
    event: MouseEvent,
    preview: ActivePreview,
  ) => {
    if (!hoverCapable.current) return;
    setActive(preview);
    updatePreviewPosition(event.clientY);
  };

  const handlePreviewMove = (event: MouseEvent) => {
    if (!hoverCapable.current) return;
    updatePreviewPosition(event.clientY);
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

        <AnimatePresence>
          {active ? (
            <motion.div
              key="journey-preview"
              aria-hidden
              className="pointer-events-none absolute left-0 z-10 hidden overflow-hidden rounded-xl border border-border bg-surface shadow-lg lg:block"
              style={{
                width: CURSOR_PREVIEW_WIDTH,
                top,
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <div
                className={`relative aspect-[842/540] ${
                  active.fit === "contain" ? "bg-black" : ""
                }`}
              >
                <Image
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

"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/Button";
import { CursorFollowPreview } from "@/components/CursorFollowPreview";
import type { CaseStudyTone } from "@/lib/case-study-palette";

/** Dwell per still — matches the home avatar reel cadence. */
const CYCLE_MS = 400;

export interface SkipCtaProps {
  /** Button label (e.g. "Skip to final design"). */
  label: string;
  /** In-page hash (e.g. `#solution`). */
  href: string;
  /** Case-study palette tone for the button fill. */
  tone?: CaseStudyTone;
  /**
   * Curated solution stills for the cursor-follow preview. Empty / omitted →
   * button only (no preview). Decorative — not announced to AT.
   */
  previewImages?: string[];
}

/**
 * Case-study header skip control: toned Button that smooth-scrolls to a
 * section, plus an optional cursor-following stills preview on fine-pointer
 * hover (centered above the cursor). Stills cut instantly like the home
 * avatar reel; reduced motion keeps the first frame static.
 */
export function SkipCta({
  label,
  href,
  tone,
  previewImages = [],
}: SkipCtaProps) {
  const reduceMotion = useReducedMotion();
  const hoverCapable = useRef(false);
  const [visible, setVisible] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);

  const hasPreview = previewImages.length > 0;

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  useEffect(() => {
    if (!visible || reduceMotion || previewImages.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % previewImages.length);
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, [visible, reduceMotion, previewImages.length]);

  const showPreview = () => {
    if (!hasPreview || !hoverCapable.current) return;
    setVisible(true);
  };
  const trackCursor = (event: MouseEvent) => {
    if (!hasPreview || !hoverCapable.current) return;
    setPoint({ x: event.clientX, y: event.clientY });
  };
  const hidePreview = () => {
    setVisible(false);
    setIndex(0);
  };

  return (
    <>
      <span
        className="inline-flex"
        onMouseEnter={showPreview}
        onMouseMove={trackCursor}
        onMouseLeave={hidePreview}
      >
        <Button
          href={href}
          variant="primary"
          tone={tone}
          size="lg"
          icon="arrow-down"
          iconPosition="end"
        >
          {label}
        </Button>
      </span>

      {hasPreview ? (
        <CursorFollowPreview visible={visible} point={point} placement="top">
          {previewImages.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="240px"
              className={`object-cover ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </CursorFollowPreview>
      ) : null}
    </>
  );
}

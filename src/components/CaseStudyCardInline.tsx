"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface CaseStudyCardInlineProps {
  /** Project title (grows to fill the row). */
  title: string;
  /** Year shown at the right of the row. */
  year: string;
  /** Destination for the row link. */
  href: string;
  /** Optional cover image shown in the hover preview. */
  coverImage?: string;
  /** Alt text for the cover image. */
  coverAlt?: string;
  /** Non-interactive, muted state (e.g. a case study that isn't live yet). */
  disabled?: boolean;
}

/** Hover preview geometry. Width matches the `w-60` class; height is derived
 *  from the `aspect-[842/540]` ratio so the preview can be reliably anchored
 *  above the cursor (top-right) regardless of the scale animation. */
const PREVIEW_WIDTH = 240; // px (w-60)
const PREVIEW_HEIGHT = Math.round((PREVIEW_WIDTH * 540) / 842);
const HORIZONTAL_GAP = 40; // px to the right of the cursor
const VERTICAL_GAP = 16; // px above the cursor

/** Title/year row, shared between the interactive and disabled renderings. */
function Row({ title, year }: { title: string; year: string }) {
  return (
    <>
      <span className="flex-1">{title}</span>
      <span>{year}</span>
    </>
  );
}

/**
 * In-line (list-row) variant of the case study card. The whole row is the link,
 * with hover / pressed / disabled states and a bottom divider. On hover-capable
 * desktop devices, a small media preview follows the cursor (top-right) while
 * hovering. The preview is additive: it renders in a portal with
 * `pointer-events-none` and never affects layout/flow. Touch devices and the
 * disabled state get the plain row (no preview).
 */
export function CaseStudyCardInline({
  title,
  year,
  href,
  coverImage,
  coverAlt,
  disabled = false,
}: CaseStudyCardInlineProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const hoverCapable = useRef(false);

  useEffect(() => {
    setMounted(true);
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  }, []);

  const showPreview = () => {
    if (hoverCapable.current) setVisible(true);
  };
  const trackCursor = (event: React.MouseEvent) => {
    if (hoverCapable.current) setPoint({ x: event.clientX, y: event.clientY });
  };
  const hidePreview = () => setVisible(false);

  // The whole element is the interactive fill (hover/pressed/focus) and includes
  // the divider, with padding top and bottom so it reads as a contained surface.
  const fillBase = "block rounded-lg px-4 pt-4 pb-3 text-body text-secondary";
  const innerRow = "flex items-baseline gap-2 border-b border-border pb-4";

  if (disabled) {
    return (
      <div aria-disabled className={`${fillBase} cursor-not-allowed opacity-50`}>
        <div className={innerRow}>
          <Row title={title} year={year} />
        </div>
      </div>
    );
  }

  return (
    <>
      <a
        href={href}
        className={`group ${fillBase} transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none active:bg-border`}
        onMouseEnter={showPreview}
        onMouseMove={trackCursor}
        onMouseLeave={hidePreview}
      >
        <div className={innerRow}>
          <Row title={title} year={year} />
        </div>
      </a>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {visible ? (
                <motion.div
                  key="inline-preview"
                  aria-hidden
                  className="pointer-events-none fixed z-50 w-60 overflow-hidden rounded-xl bg-surface shadow-lg"
                  style={{
                    left: point.x + HORIZONTAL_GAP,
                    top: point.y - PREVIEW_HEIGHT - VERTICAL_GAP,
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <div className="relative aspect-[842/540]">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={coverAlt ?? title}
                        fill
                        className="object-cover"
                        sizes="240px"
                      />
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}

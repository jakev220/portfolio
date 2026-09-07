"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { CursorFollowPreview } from "@/components/CursorFollowPreview";

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
  const [visible, setVisible] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const hoverCapable = useRef(false);

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const showPreview = () => {
    if (hoverCapable.current) setVisible(true);
  };
  const trackCursor = (event: MouseEvent) => {
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

      <CursorFollowPreview visible={visible} point={point}>
        {coverImage ? (
          <Image
            src={coverImage}
            alt={coverAlt ?? title}
            fill
            className="object-cover"
            sizes="240px"
          />
        ) : null}
      </CursorFollowPreview>
    </>
  );
}

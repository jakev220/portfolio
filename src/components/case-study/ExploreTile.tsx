"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

/** Avatar-reel cadence for About / Play still cycles. */
const CYCLE_MS = 400;

export interface ExploreTileProps {
  label: string;
  href?: string;
  /** One or more stills; length > 1 enables hover cycling. */
  images?: string[];
  /**
   * When true (and there is a cover still), label is white over a bottom
   * scrim. Placeholder / no-image tiles use primary ink instead.
   */
  labelOnMedia?: boolean;
  className?: string;
  /** Sizes hint for Next/Image. */
  sizes?: string;
}

/**
 * Collage tile: overflow-clipped zoom on hover (same 1.04 / 500ms as
 * case-study cards). Optional hover still-cycle (instant cuts, avatar reel).
 * Decorative cycle — label carries the accessible name.
 */
export function ExploreTile({
  label,
  href,
  images = [],
  labelOnMedia,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: ExploreTileProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);

  const hasMedia = images.length > 0 && Boolean(images[0]);
  const canCycle = hasMedia && images.length > 1 && !reduceMotion;
  const onMedia = labelOnMedia ?? hasMedia;

  useEffect(() => {
    if (!hovered || !canCycle) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [hovered, canCycle, images.length]);

  useEffect(() => {
    if (!hovered) setIndex(0);
  }, [hovered]);

  const body = (
    <>
      <div
        className={`absolute inset-0 ${
          hasMedia
            ? "transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            : ""
        }`}
      >
        {hasMedia
          ? images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                sizes={sizes}
                className={`object-cover ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            ))
          : null}
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex items-end p-4 sm:p-5 ${
          onMedia
            ? "bg-gradient-to-t from-black/55 via-black/20 to-transparent pt-16"
            : ""
        }`}
      >
        <span
          className={`text-h3 m-0 ${onMedia ? "text-white" : "text-primary"}`}
        >
          {label}
        </span>
      </div>
    </>
  );

  const shellClass = [
    "group relative block overflow-hidden rounded-xl border border-border bg-surface",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!href) {
    return (
      <div className={shellClass} aria-label={label}>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={shellClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {body}
    </Link>
  );
}

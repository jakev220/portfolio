"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface AvatarImage {
  src: string;
  alt: string;
}

export interface HeroAvatarProps {
  /** Name text that shares the hover region with the avatar. */
  name: string;
  /** Cycle frames, in order. First is the resting image. Empty → placeholder. */
  images?: AvatarImage[];
  /** Milliseconds between frames while hovered. */
  intervalMs?: number;
}

const CYCLE_MS = 400;

/**
 * "Jake Villaseñor" + a circular avatar, sharing one hover region. While
 * hovered, the avatar cycles through `images` on an interval; it resets to the
 * first frame on leave. All frames are rendered stacked (only the active one
 * visible) so they're preloaded and the swap is flicker-free.
 */
export function HeroAvatar({ name, images = [], intervalMs = CYCLE_MS }: HeroAvatarProps) {
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);

  const canCycle = images.length > 1;

  useEffect(() => {
    if (!hovered || !canCycle) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [hovered, canCycle, images.length, intervalMs]);

  useEffect(() => {
    if (!hovered) setIndex(0);
  }, [hovered]);

  return (
    <span
      className="inline-flex items-center gap-x-[7px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-primary">{name}</span>

      <span className="relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface align-middle">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={i === 0 ? img.alt : ""}
            fill
            sizes="40px"
            unoptimized
            priority={i === 0}
            className={`object-cover ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </span>
    </span>
  );
}

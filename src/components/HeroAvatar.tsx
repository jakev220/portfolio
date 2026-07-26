"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  EXIT_EASE,
  HOME_EXIT_MS,
  NAVIGATE_DELAY_MS,
  REEL_EXIT_MS,
  REEL_FADE_DELAY_MS,
  beginHomeAboutExit,
} from "@/lib/about-transition";

export interface AvatarImage {
  src: string;
  alt: string;
}

export interface HeroAvatarProps {
  /** Name text that shares the hover region with the avatar. */
  name: string;
  /** Destination for the name + avatar link. Defaults to the About page. */
  href?: string;
  /** Cycle frames, in order. First is the resting image. Empty → placeholder. */
  images?: AvatarImage[];
  /** Milliseconds between frames while hovered. */
  intervalMs?: number;
}

const CYCLE_MS = 400;

/**
 * "Jake Villaseñor" + a circular avatar, sharing one hover region and linking
 * to About. Hover: accent name, slight lift, photo cycle. Click: the home page
 * fades while the reel eases upward and out, then About plays its entrance.
 */
export function HeroAvatar({
  name,
  href = "/about",
  images = [],
  intervalMs = CYCLE_MS,
}: HeroAvatarProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [index, setIndex] = useState(0);

  const canCycle = images.length > 1 && !exiting;

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

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Allow modified clicks (new tab, etc.) to behave like a normal link.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    if (exiting) return;

    if (reduceMotion) {
      router.push(href);
      return;
    }

    setExiting(true);
    beginHomeAboutExit();
    window.setTimeout(() => {
      router.push(href);
    }, NAVIGATE_DELAY_MS);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group inline-flex items-center gap-x-[7px] rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-busy={exiting || undefined}
    >
      <motion.span
        className="text-primary transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: HOME_EXIT_MS / 1000, ease: EXIT_EASE }}
      >
        {name}
      </motion.span>

      <motion.span
        className="relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface align-middle"
        animate={
          exiting
            ? { y: -40, opacity: 0, scale: 0.94 }
            : hovered
              ? { y: -4, opacity: 1, scale: 1 }
              : { y: 0, opacity: 1, scale: 1 }
        }
        transition={
          exiting
            ? {
                y: { duration: REEL_EXIT_MS / 1000, ease: EXIT_EASE },
                scale: { duration: REEL_EXIT_MS / 1000, ease: EXIT_EASE },
                // Rise with the page fade; dissolve a beat later so the reel
                // is the last home element to leave.
                opacity: {
                  duration: REEL_EXIT_MS / 1000,
                  delay: REEL_FADE_DELAY_MS / 1000,
                  ease: EXIT_EASE,
                },
              }
            : { duration: 0.3, ease: EXIT_EASE }
        }
      >
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
      </motion.span>
    </Link>
  );
}

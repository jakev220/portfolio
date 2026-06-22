"use client";

import { useState } from "react";
import Image from "next/image";
import { backIn, motion } from "framer-motion";

export interface HeroFolderIcon {
  src: string;
  alt: string;
}

export interface HeroFolderProps {
  /** Emphasized role text that shares the hover region with the folder. */
  role: string;
  /** Folder front face (PNG/WebP). Neutral placeholder shown if omitted. */
  frontSrc?: string;
  /** Folder back face (PNG/WebP). Neutral placeholder shown if omitted. */
  backSrc?: string;
  /** App icons in order [figma, claude, cursor]. Placeholders if omitted. */
  icons?: [HeroFolderIcon, HeroFolderIcon, HeroFolderIcon];
}

/** Icons render at 32px and scale down to 20px at rest. */
const REST_SCALE = 20 / 32;

/**
 * Default asset paths under public/icons/tool-icons/.
 * IMPORTANT: both PNGs must be exported at the full 40×40 frame (each part in
 * its correct position, transparent elsewhere) so the layers stack pre-aligned.
 * The highlight strips are baked into the front PNG.
 */
const FOLDER_BACK_SRC = "/icons/tool-icons/folder-back.png";
const FOLDER_FRONT_SRC = "/icons/tool-icons/folder-front.png";

/** Tool icons, in slot order [figma (left), claude (center), cursor (right)]. */
const DEFAULT_ICONS: [HeroFolderIcon, HeroFolderIcon, HeroFolderIcon] = [
  { src: "/icons/tool-icons/figma.svg", alt: "Figma" },
  { src: "/icons/tool-icons/claude.svg", alt: "Claude" },
  { src: "/icons/tool-icons/cursor.svg", alt: "Cursor" },
];

/**
 * Per-icon transforms. Coordinates are offsets from each icon's shared base box
 * (32px, top-left at 4,4 inside the 40px folder).
 * - `rest`: stacked, scaled down, lifted by `REST_PEEK_Y` so the tops barely
 *   poke above the front face top edge (~10px) — just enough to tell something's
 *   in the folder.
 * - `hover`: fanned out ABOVE the folder (y ≈ -39 clears the top edge) with a
 *   visible gap between icons (x ≈ ±44 → ~12px apart). Tweak to taste.
 */
const REST_PEEK_Y = -2;
const SLOTS = [
  { rest: { x: -7, y: REST_PEEK_Y }, hover: { x: -44, y: -38, rotate: -15 } }, // figma (left)
  { rest: { x: 0, y: REST_PEEK_Y }, hover: { x: 0, y: -39, rotate: 0 } }, // claude (center)
  { rest: { x: 7, y: REST_PEEK_Y }, hover: { x: 44, y: -38, rotate: 15 } }, // cursor (right)
] as const;

/**
 * "digital product designer" + the macOS folder, sharing one hover region.
 * On hover the three app icons (sandwiched between the folder's back and front)
 * fan out and scale up. Enter uses a bouncy spring; leave uses ease-in-back —
 * matching the Figma prototype.
 */
export function HeroFolder({
  role,
  frontSrc = FOLDER_FRONT_SRC,
  backSrc = FOLDER_BACK_SRC,
  icons = DEFAULT_ICONS,
}: HeroFolderProps) {
  const [hovered, setHovered] = useState(false);
  // Fall back to neutral placeholders until the real PNGs exist (404 on load).
  const [frontError, setFrontError] = useState(false);
  const [backError, setBackError] = useState(false);

  const showFront = frontSrc && !frontError;
  const showBack = backSrc && !backError;

  const transition = hovered
    ? { type: "spring" as const, bounce: 0.45, duration: 1.2 }
    : { duration: 0.5, ease: backIn };

  return (
    <span
      className="inline-flex items-center gap-x-[7px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-primary">{role}</span>

      <span className="relative inline-block h-10 w-10 shrink-0 align-middle">
        {/* back panel (z-0) — exported at the full 40×40 frame */}
        {showBack ? (
          <Image
            src={backSrc}
            alt=""
            fill
            sizes="40px"
            unoptimized
            className="z-0 object-contain"
            onError={() => setBackError(true)}
          />
        ) : (
          <span aria-hidden className="absolute inset-0 z-0 rounded-lg bg-border" />
        )}

        {/* app icons — sandwiched between back and front (z-10) */}
        {SLOTS.map((slot, index) => {
          const icon = icons?.[index];
          return (
            <motion.span
              key={index}
              aria-hidden
              className="absolute left-1 top-1 z-10 block h-8 w-8"
              initial={false}
              animate={
                hovered
                  ? { ...slot.hover, scale: 1 }
                  : { ...slot.rest, rotate: 0, scale: REST_SCALE }
              }
              transition={transition}
            >
              {icon ? (
                <Image
                  src={icon.src}
                  alt=""
                  fill
                  sizes="32px"
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <span className="block h-full w-full rounded-[7px] bg-primary" />
              )}
            </motion.span>
          );
        })}

        {/* front flap (z-20) — occludes the lower part of the icons at rest */}
        {showFront ? (
          <Image
            src={frontSrc}
            alt=""
            fill
            sizes="40px"
            unoptimized
            className="z-20 object-contain"
            onError={() => setFrontError(true)}
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 h-3/4 rounded-lg bg-surface"
          />
        )}
      </span>
    </span>
  );
}

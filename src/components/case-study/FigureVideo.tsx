"use client";

import { useEffect, useRef } from "react";

export interface FigureVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  /**
   * Playback speed. `1` = normal, `0.75` = slower, `0.5` = half speed.
   * Passed as a string from MDX (e.g. playbackRate="0.75").
   */
  playbackRate?: string;
  /**
   * How the video sits in the figure box.
   * - `cover` (default) — fill the box, may crop.
   * - `top-right` — pin to top + right, height fills the box, width follows
   *   the intrinsic aspect (no vertical crop when the box matches the mp4 ratio).
   */
  fit?: "cover" | "top-right";
}

/**
 * Lazy case-study video: `preload="none"`, plays muted when near the viewport,
 * pauses when scrolled away. Used by `<Figure video=… />`.
 */
export function FigureVideo({
  src,
  poster,
  alt = "",
  playbackRate = "1",
  fit = "cover",
}: FigureVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rate = Number.parseFloat(playbackRate);
  const resolvedRate = Number.isFinite(rate) && rate > 0 ? rate : 1;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    // Re-load when the file is replaced at the same URL (dev HMR / asset swap).
    node.load();
    node.playbackRate = resolvedRate;

    const tryPlay = () => {
      node.playbackRate = resolvedRate;
      void node.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          node.pause();
          return;
        }
        tryPlay();
      },
      { rootMargin: "200px 0px", threshold: 0.25 },
    );

    observer.observe(node);
    node.addEventListener("loadeddata", tryPlay);
    return () => {
      observer.disconnect();
      node.removeEventListener("loadeddata", tryPlay);
    };
  }, [src, resolvedRate]);

  const fitClass =
    fit === "top-right"
      ? // Nudge up so a thin black letterbox strip in screen recordings is
        // clipped by the figure’s overflow-hidden.
        "absolute right-0 -top-1.5 h-[calc(100%+6px)] w-auto max-w-none"
      : "absolute inset-0 h-full w-full object-cover";

  return (
    <video
      ref={videoRef}
      className={fitClass}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
    />
  );
}

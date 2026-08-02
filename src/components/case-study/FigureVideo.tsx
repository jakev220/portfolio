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
}: FigureVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rate = Number.parseFloat(playbackRate);
  const resolvedRate = Number.isFinite(rate) && rate > 0 ? rate : 1;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    node.playbackRate = resolvedRate;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          node.pause();
          return;
        }
        node.playbackRate = resolvedRate;
        void node.play().catch(() => {});
      },
      { rootMargin: "200px 0px", threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, resolvedRate]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    />
  );
}

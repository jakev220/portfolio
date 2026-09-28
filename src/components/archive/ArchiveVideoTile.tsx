"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";

export interface ArchiveVideoTileProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio value; when set, video covers the frame. */
  aspect?: string;
  /**
   * Hold on the last frame this many ms before restarting. When set (and > 0),
   * disables the native `loop` attribute.
   */
  loopDelayMs?: number;
  /** HTML video `playbackRate`. Default `1`. */
  playbackRate?: number;
}

/**
 * Archive mosaic video tile: muted autoplay loop with a top-right play/pause
 * affordance matching `<ArchiveCycleTile>` (bare `text-secondary` icon).
 */
export function ArchiveVideoTile({
  src,
  alt,
  aspect,
  loopDelayMs = 0,
  playbackRate = 1,
}: ArchiveVideoTileProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopTimeoutRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const cropped = Boolean(aspect);
  const delayedLoop = loopDelayMs > 0;

  pausedRef.current = paused;

  const clearLoopTimeout = () => {
    if (loopTimeoutRef.current !== null) {
      window.clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  };

  const restartFromStart = () => {
    const node = videoRef.current;
    if (!node || pausedRef.current || reduceMotion) return;
    node.currentTime = 0;
    void node.play().catch(() => {});
  };

  useEffect(() => {
    return () => clearLoopTimeout();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.playbackRate = playbackRate;
    if (reduceMotion || paused) {
      clearLoopTimeout();
      node.pause();
      return;
    }
    if (delayedLoop && node.ended) {
      restartFromStart();
      return;
    }
    void node.play().catch(() => {});
  }, [paused, reduceMotion, src, delayedLoop, playbackRate]);

  const onEnded = () => {
    if (!delayedLoop || pausedRef.current || reduceMotion) return;
    clearLoopTimeout();
    loopTimeoutRef.current = window.setTimeout(() => {
      loopTimeoutRef.current = null;
      restartFromStart();
    }, loopDelayMs);
  };

  const togglePause = () => {
    if (reduceMotion) return;
    setPaused((value) => !value);
  };

  const video = (
    <video
      ref={videoRef}
      src={src}
      className={
        cropped
          ? "absolute inset-0 h-full w-full object-cover object-center"
          : "h-auto w-full"
      }
      autoPlay={!reduceMotion}
      muted
      loop={!delayedLoop}
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
      onEnded={delayedLoop ? onEnded : undefined}
    />
  );

  return (
    <div
      className="relative w-full cursor-pointer"
      style={aspect ? { aspectRatio: aspect } : undefined}
      role="img"
      aria-label={`${alt}${paused ? " (paused)" : ""}`}
      aria-pressed={!reduceMotion ? paused : undefined}
      tabIndex={!reduceMotion ? 0 : undefined}
      onClick={togglePause}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          togglePause();
        }
      }}
    >
      {video}
      {!reduceMotion ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-10 text-secondary"
        >
          <Icon name={paused ? "play" : "pause"} size={20} />
        </span>
      ) : null}
    </div>
  );
}

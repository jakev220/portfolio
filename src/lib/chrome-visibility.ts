"use client";

import { useEffect, useRef, useState } from "react";
import {
  MEDIA_LIGHTBOX_CLOSE_EVENT,
  MEDIA_LIGHTBOX_OPEN_EVENT,
} from "@/lib/media-lightbox-ui";

/** Above this scroll position (near the top) chrome is always shown. */
export const CHROME_TOP_ZONE = 80;
/** Pointer within this many px of the viewport top reveals chrome (desktop). */
export const CHROME_HOT_ZONE = 100;
/** Min scroll delta before flipping hide/show, to avoid jitter. */
export const CHROME_DELTA = 4;

/**
 * Shared show/hide for fixed top chrome (nav, case-study back): top zone,
 * scroll direction, pointer hot zone, focus, and media-lightbox suppression.
 */
export function useChromeVisibility() {
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onOpen = () => setLightboxOpen(true);
    const onClose = () => setLightboxOpen(false);
    window.addEventListener(MEDIA_LIGHTBOX_OPEN_EVENT, onOpen);
    window.addEventListener(MEDIA_LIGHTBOX_CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(MEDIA_LIGHTBOX_OPEN_EVENT, onOpen);
      window.removeEventListener(MEDIA_LIGHTBOX_CLOSE_EVENT, onClose);
    };
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      setFloating(y >= CHROME_TOP_ZONE);
      if (y < CHROME_TOP_ZONE) {
        setHidden(false);
      } else if (y > lastY.current + CHROME_DELTA) {
        setHidden(true);
      } else if (y < lastY.current - CHROME_DELTA) {
        setHidden(false);
      }
      lastY.current = y;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY <= CHROME_HOT_ZONE) setHidden(false);
    };
    if (canHover) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (canHover) window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const suppressed = lightboxOpen;
  const reveal = () => {
    if (!suppressed) setHidden(false);
  };

  return {
    hidden: hidden || suppressed,
    floating,
    suppressed,
    reveal,
  };
}

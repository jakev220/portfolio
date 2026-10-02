"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  CURSOR_PREVIEW_WIDTH,
  cursorPreviewPosition,
  type CursorPreviewPlacement,
} from "@/lib/cursor-preview";

/** Soft spring so the frame eases after the cursor instead of locking to it. */
const FOLLOW_SPRING = { stiffness: 80, damping: 14, mass: 0.55 };

/** Enter/exit scale — slight overshoot for a bounce on appear. */
const BOUNCE_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 16,
  mass: 0.7,
};

export interface CursorFollowPreviewProps {
  /** Whether the preview should be on screen. */
  visible: boolean;
  /** Cursor position in viewport coordinates. */
  point: { x: number; y: number };
  /**
   * `top-right` — beside/above the cursor (inline case-study rows).
   * `top` — centered directly above the cursor (skip CTA).
   * `right` — vertically centered to the right of the cursor (hero links).
   */
  placement?: CursorPreviewPlacement;
  /** Preview content (typically a still or stacked cycle). */
  children: ReactNode;
}

/**
 * Fixed, non-interactive media frame that tracks the cursor with a soft lag
 * and a slight bounce on appear. Portaled to `document.body` so it never
 * affects layout.
 */
export function CursorFollowPreview({
  visible,
  point,
  placement = "top-right",
  children,
}: CursorFollowPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const wasVisible = useRef(false);
  const springLeft = useSpring(0, FOLLOW_SPRING);
  const springTop = useSpring(0, FOLLOW_SPRING);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      wasVisible.current = false;
      return;
    }

    const { left, top } = cursorPreviewPosition(point, placement);
    // Land on the cursor when the preview first appears, then spring-follow.
    const snap = !wasVisible.current || Boolean(reduceMotion);
    wasVisible.current = true;

    if (snap) {
      springLeft.jump(left);
      springTop.jump(top);
    } else {
      springLeft.set(left);
      springTop.set(top);
    }
  }, [point, visible, placement, reduceMotion, springLeft, springTop]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="cursor-follow-preview"
          aria-hidden
          className="pointer-events-none fixed z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
          style={{
            width: CURSOR_PREVIEW_WIDTH,
            left: springLeft,
            top: springTop,
          }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.2, ease: "easeOut" },
                  scale: BOUNCE_SPRING,
                }
          }
        >
          <div className="relative aspect-[842/540]">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

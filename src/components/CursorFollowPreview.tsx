"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CURSOR_PREVIEW_WIDTH,
  cursorPreviewPosition,
  type CursorPreviewPlacement,
} from "@/lib/cursor-preview";

export interface CursorFollowPreviewProps {
  /** Whether the preview should be on screen. */
  visible: boolean;
  /** Cursor position in viewport coordinates. */
  point: { x: number; y: number };
  /**
   * `top-right` — beside/above the cursor (inline case-study rows).
   * `top` — centered directly above the cursor (skip CTA).
   */
  placement?: CursorPreviewPlacement;
  /** Preview content (typically a still or stacked cycle). */
  children: ReactNode;
}

/**
 * Fixed, non-interactive media frame that tracks the cursor. Portaled to
 * `document.body` so it never affects layout.
 */
export function CursorFollowPreview({
  visible,
  point,
  placement = "top-right",
  children,
}: CursorFollowPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const { left, top } = cursorPreviewPosition(point, placement);

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="cursor-follow-preview"
          aria-hidden
          className="pointer-events-none fixed z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
          style={{
            width: CURSOR_PREVIEW_WIDTH,
            left,
            top,
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="relative aspect-[842/540]">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

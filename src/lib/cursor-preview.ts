/**
 * Shared geometry for cursor-following media previews (inline case-study
 * rows + skip CTA). Width matches `w-60`; height is derived from the
 * `aspect-[842/540]` ratio so the frame can sit above the cursor reliably.
 */
export const CURSOR_PREVIEW_WIDTH = 240; // px (w-60)
export const CURSOR_PREVIEW_HEIGHT = Math.round(
  (CURSOR_PREVIEW_WIDTH * 540) / 842,
);
/** px to the right of the cursor (`top-right` placement). */
export const CURSOR_PREVIEW_HORIZONTAL_GAP = 40;
/** px above the cursor (`top-right` placement — inline rows). */
export const CURSOR_PREVIEW_VERTICAL_GAP = 16;
/**
 * px above the cursor for `top` placement (skip CTA). Larger so the frame
 * clears the button label while the pointer is on the control.
 */
export const CURSOR_PREVIEW_VERTICAL_GAP_ABOVE = 56;

export type CursorPreviewPlacement = "top-right" | "top";

/** Fixed `left` / `top` for a cursor-follow frame at `point`. */
export function cursorPreviewPosition(
  point: { x: number; y: number },
  placement: CursorPreviewPlacement = "top-right",
): { left: number; top: number } {
  if (placement === "top") {
    return {
      left: point.x - CURSOR_PREVIEW_WIDTH / 2,
      top: point.y - CURSOR_PREVIEW_HEIGHT - CURSOR_PREVIEW_VERTICAL_GAP_ABOVE,
    };
  }
  return {
    left: point.x + CURSOR_PREVIEW_HORIZONTAL_GAP,
    top: point.y - CURSOR_PREVIEW_HEIGHT - CURSOR_PREVIEW_VERTICAL_GAP,
  };
}

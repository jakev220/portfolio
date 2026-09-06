import type { CaseStudyTone } from "@/lib/case-study-palette";

/** Fallback hexes matching `globals.css` `--cs-*` defaults (for contrast). */
const TONE_HEX: Record<CaseStudyTone, string> = {
  lavender: "#E9D5FF",
  orange: "#FFA64B",
  yellow: "#FEF18B",
  blue: "#94C4FD",
  purple: "#9234EA",
};

function relativeLuminance(hex: string): number {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return 0;
  const channel = (start: number) => {
    const c = parseInt(raw.slice(start, start + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** Fill color for a mark. Omit `accent` → theme primary (black/white by mode). */
export function markFill(accent?: CaseStudyTone): string {
  if (!accent) return "var(--color-text-primary)";
  return `var(--cs-${accent})`;
}

/**
 * Ink on top of a highlight fill. Theme-primary fills use page `bg` (always
 * contrasting). Palette tones pick black or white from luminance.
 */
export function markHighlightInk(accent?: CaseStudyTone): string {
  if (!accent) return "var(--color-bg)";
  return relativeLuminance(TONE_HEX[accent]) > 0.45 ? "#0a0a0a" : "#ffffff";
}

/** Chart-aligned reveal: 650ms ease-out, once on enter. */
export const MARK_REVEAL_MS = 650;

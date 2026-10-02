import type { ReactNode } from "react";

/**
 * Split body copy that uses `**accent**` markers into plain + accent segments.
 * Escapes are not supported — markers are only for short card/prose emphasis.
 */
export function parseAccentedText(
  text: string,
): Array<{ text: string; accent: boolean }> {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return { text: part.slice(2, -2), accent: true };
    }
    return { text: part, accent: false };
  });
}

/** Strip `**…**` markers for plain-text contexts (meta description, etc.). */
export function stripAccentMarkers(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

/**
 * Inline accent — emphasizes a small span of body text with bold + the darkest
 * neutral (`text-primary`), distinct from the link-blue accent color.
 * Use inside MDX prose: `the <Accent>+84%</Accent> uplift`.
 * Card descriptions may use `**…**` markers, rendered via this component.
 */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-bold text-primary">{children}</span>;
}

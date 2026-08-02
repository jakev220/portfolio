/**
 * Per–case-study accent palettes. Applied via `data-case-study="{slug}"` on the
 * case-study `<article>` (see `src/app/work/[slug]/page.tsx`). Components read
 * tones through CSS vars (`--cs-lavender`, …) exposed as Tailwind `cs-*` colors.
 */

export const caseStudyPaletteKeys = [
  "lavender",
  "orange",
  "yellow",
  "blue",
  "purple",
] as const;

export type CaseStudyTone = (typeof caseStudyPaletteKeys)[number];

export type CaseStudyPalette = Record<CaseStudyTone, string>;

/** Slug → palette. Add an entry when a new case study gets branded colors. */
export const caseStudyPalettes: Record<string, CaseStudyPalette> = {
  "science-jury": {
    lavender: "#E9D5FF",
    orange: "#FFA64B",
    yellow: "#FEF18B",
    blue: "#94C4FD",
    purple: "#9234EA",
  },
};

/** Inline style object of `--cs-*` custom properties for a slug, or undefined. */
export function caseStudyPaletteStyle(
  slug: string,
): Record<string, string> | undefined {
  const palette = caseStudyPalettes[slug];
  if (!palette) return undefined;
  return Object.fromEntries(
    caseStudyPaletteKeys.map((key) => [`--cs-${key}`, palette[key]]),
  );
}

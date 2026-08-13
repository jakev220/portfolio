/**
 * Design tokens — the single source of truth for the portfolio design system.
 *
 * Values here are mirrored by `tailwind.config.ts` (typography scale) and
 * `src/styles/globals.css` (color custom properties). Do not introduce a font
 * size, line height, or color that is not defined here without updating the brief.
 */

/** Named font weights available across all type styles (Neue Montreal). */
export const fontWeight = {
  regular: 400,
  bold: 700,
} as const;

export type FontWeightToken = keyof typeof fontWeight;

/** A single typographic style. `size`/`lineHeight`/`letterSpacing` are CSS values. */
export interface TypeStyle {
  /** font-size, e.g. "1rem" */
  size: string;
  /** unitless line-height multiplier */
  lineHeight: number;
  /** letter-spacing, e.g. "-0.01em" */
  letterSpacing: string;
  /** default font-weight for this style */
  weight: number;
}

/**
 * Typography scale. Keys match the token names in the design brief and are used
 * directly as Tailwind `text-*` utilities (e.g. `text-h1`, `text-body`).
 *
 * `caption` and `label` are intentionally identical for now but kept separate so
 * they can diverge later (e.g. `label` may gain tracking or uppercase treatment).
 */
export const typography = {
  caption: {
    size: "0.875rem", // 14px — image captions, footnotes, helper text
    lineHeight: 1.5,
    letterSpacing: "0em",
    weight: fontWeight.regular,
  },
  label: {
    size: "0.875rem", // 14px — section pre-headers, in-page nav anchors
    lineHeight: 1.5,
    letterSpacing: "0em",
    weight: fontWeight.regular,
  },
  body: {
    size: "1rem", // 16px — default body text
    lineHeight: 1.6,
    letterSpacing: "0em",
    weight: fontWeight.regular,
  },
  "body-large": {
    size: "1.125rem", // 18px — intro / about-page reading copy
    lineHeight: 1.6,
    letterSpacing: "0em",
    weight: fontWeight.regular,
  },
  h3: {
    /** Fluid ~20px → 24px — sub-section headers */
    size: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)",
    lineHeight: 1.2,
    letterSpacing: "0em",
    weight: fontWeight.regular,
  },
  h2: {
    /** Fluid ~24px → 32px — section headers */
    size: "clamp(1.5rem, 1.15rem + 1.2vw, 2rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    weight: fontWeight.regular,
  },
  h1: {
    /** Fluid ~32px → 48px — case study page titles */
    size: "clamp(2rem, 1.25rem + 2.5vw, 3rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    weight: fontWeight.regular,
  },
  /** Callout card headline — fluid between h2 (32px) and h1 (48px). */
  "callout-title": {
    size: "clamp(2rem, 1.25rem + 2.8vw, 3rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    weight: fontWeight.regular,
  },
  /** Callout secondary headline — fluid between h3 (24px) and h2 (32px). */
  "callout-heading": {
    size: "clamp(1.5rem, 0.875rem + 2vw, 2rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    weight: fontWeight.regular,
  },
  /** Callout supporting copy — fluid between label (14px) and body (16px). */
  "callout-body": {
    size: "clamp(0.875rem, 0.75rem + 0.5vw, 1rem)",
    lineHeight: 1.6,
    letterSpacing: "0em",
    weight: fontWeight.regular,
  },
} as const satisfies Record<string, TypeStyle>;

export type TypographyToken = keyof typeof typography;

/**
 * Color tokens. Each maps to a CSS custom property defined in `globals.css`,
 * so runtime theming stays in one place. Hex values are filled in there.
 */
export const colorVar = {
  bg: "var(--color-bg)",
  surface: "var(--color-surface)",
  border: "var(--color-border)",
  divider: "var(--color-divider)",
  textPrimary: "var(--color-text-primary)",
  textHeading: "var(--color-text-heading)",
  textBody: "var(--color-text-body)",
  textSecondary: "var(--color-text-secondary)",
  accent: "var(--color-accent)",
} as const;

export type ColorToken = keyof typeof colorVar;

/** Tailwind default breakpoints (px). Listed for reference; do not customize. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

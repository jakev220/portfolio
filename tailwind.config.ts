import type { Config } from "tailwindcss";
import { typography } from "./src/lib/tokens";

/**
 * Build Tailwind's `fontSize` scale from the token definitions so the type
 * utilities (text-h1, text-body, ...) always match `src/lib/tokens.ts`.
 */
const fontSize = Object.fromEntries(
  Object.entries(typography).map(([name, style]) => [
    name,
    [
      style.size,
      {
        lineHeight: String(style.lineHeight),
        letterSpacing: style.letterSpacing,
        fontWeight: String(style.weight),
      },
    ],
  ])
) as Config["theme"] & Record<string, unknown>;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Replace the default type scale entirely so only brief-approved sizes exist.
    fontSize: fontSize as NonNullable<Config["theme"]>["fontSize"],
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        divider: "var(--color-divider)",
        accent: "var(--color-accent)",
        // Case-study media lightbox (see tokens.ts / globals.css).
        "lightbox-scrim": "var(--color-lightbox-scrim)",
        "lightbox-panel": "var(--color-lightbox-panel)",
        primary: "var(--color-text-primary)",
        // `heading` = h2/h3 section headers. NOTE: no `body` color token — it
        // would collide with the `text-body` font-size utility, so body text
        // simply inherits the base color (--color-text-body) set in globals.css.
        heading: "var(--color-text-heading)",
        secondary: "var(--color-text-secondary)",
        // Per–case-study palette (set via --cs-* on [data-case-study]).
        "cs-lavender": "var(--cs-lavender)",
        "cs-orange": "var(--cs-orange)",
        "cs-yellow": "var(--cs-yellow)",
        "cs-blue": "var(--cs-blue)",
        "cs-purple": "var(--cs-purple)",
        // Fixed ink for pastel cs surfaces (does not flip in dark mode).
        "cs-ink": "var(--cs-ink)",
      },
      borderColor: {
        DEFAULT: "var(--color-border)",
      },
      // Spacing: using Tailwind's default scale as a placeholder.
      // TODO: add custom spacing values here later (extend, do not replace).
      spacing: {},
    },
  },
  plugins: [],
};

export default config;

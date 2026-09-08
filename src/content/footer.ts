import type { FooterProps } from "@/components/Footer";

/**
 * Site footer content. Edit copy/links here — the Footer component stays
 * content-agnostic. Contact links use the shared {@link Link} treatment.
 * Live Pacific time is rendered by `FooterClock`.
 */
export const footer: FooterProps = {
  contact: [
    { label: "Mail", href: "mailto:220jakeryan@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-villasenor" },
    // TODO: temporary Google Drive link — swap for a hosted resume later.
    {
      label: "Resumé",
      href: "https://drive.google.com/file/d/1L3ZfZJA7QoGfBuWZbKN-GwC5Q3kYJy8_/view?usp=sharing",
    },
  ],
  meta: {
    copyright: "© Jake Villaseñor 2026.",
    location: "San Diego, CA",
  },
};

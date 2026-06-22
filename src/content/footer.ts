import type { FooterProps } from "@/components/Footer";

/**
 * Footer content. Edit copy/links here — the Footer component stays content-
 * agnostic. The right-hand meta time is computed live (Pacific) by FooterClock;
 * only the location string lives here. Replace the placeholder LinkedIn/resume
 * links and the explore card image/href when those are ready.
 */
export const footer: FooterProps = {
  message: {
    heading: "Don’t be a stranger!",
    body: "I love meeting new people and learning new things. Think we’d click? Reach out and let’s get in touch!",
  },
  links: [
    { label: "220jakeryan@gmail.com", href: "mailto:220jakeryan@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-villasenor" },
    // TODO: temporary Google Drive link — swap for a hosted resume later.
    {
      label: "Resumé",
      href: "https://drive.google.com/file/d/1L3ZfZJA7QoGfBuWZbKN-GwC5Q3kYJy8_/view?usp=sharing",
    },
  ],
  explore: {
    heading: "Want to see more?",
    title: "[Next section title]",
    // TODO: add the cover image and destination.
    image: "",
    imageAlt: "",
    href: "#",
  },
  meta: {
    copyright: "© Jake Villaseñor 2026.",
    built: "Built with Figma, Cursor, and many iced lemon black teas.",
    location: "San Diego, CA",
  },
};

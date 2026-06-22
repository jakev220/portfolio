import type { HeroProps } from "@/components/Hero";

/**
 * Home-page hero content. Edit copy here — the Hero component stays content-
 * agnostic. Replace the placeholder links (`#`) and fill `avatarImages` once the
 * photos are added to public/avatar/ (see below).
 */
export const hero: HeroProps = {
  name: "Jake Villaseñor",
  lead: "is a",
  role: "digital product designer",
  // Avatar hover-cycle frames (first = resting).
  avatarImages: [
    { src: "/avatar/jake-1.webp", alt: "Jake Villaseñor" },
    { src: "/avatar/jake-2.webp", alt: "" },
    { src: "/avatar/jake-3.webp", alt: "" },
    { src: "/avatar/jake-4.webp", alt: "" },
  ],
  tagline: [
    "untangling complexity and optimizing experiences",
    "for ease, connection, and delight.",
  ],
  current: {
    prefix: "Currently building developer tools to optimize dashboard production at",
    link: { label: "StepStone Group", href: "https://www.stepstonegroup.com/" },
    suffix: ".",
  },
  previous: {
    prefix: "Previously designing multi-agent LLM systems at",
    link: { label: "ProtoLab", href: "https://protolab.ucsd.edu/" },
    suffix: ".",
  },
};

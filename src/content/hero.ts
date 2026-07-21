import type { HeroProps } from "@/components/Hero";
import { avatars } from "@/content/avatars";

/**
 * Home-page hero content. Edit copy here — the Hero component stays content-
 * agnostic. Avatar frames live in `avatars.ts` (shared with the About strip).
 */
export const hero: HeroProps = {
  name: "Jake Villaseñor",
  lead: "is a",
  role: "digital product designer",
  avatarImages: avatars,
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

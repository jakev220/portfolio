import type { HeroProps } from "@/components/Hero";
import { avatars } from "@/content/avatars";

/**
 * Home-page hero content. Edit copy here — the Hero component stays content-
 * agnostic. Avatar frames live in `avatars.ts` (shared with the About strip).
 */
export const hero: HeroProps = {
  name: "Jake Villaseñor",
  lead: "is a",
  role: "product designer",
  avatarImages: avatars,
  tagline: [
    "building digital experiences that help people",
    "find answers and decide what to do next.",
  ],
  current: {
    prefix: "Currently designing an internal catalog for 850+ BI dashboards at",
    link: {
      label: "StepStone Group",
      disabled: true,
      previewLabel: "Work in progress...",
    },
    suffix: ".",
  },
  previous: {
    prefix: "Previously designed a multi-agent LLM system for academic writing at",
    link: {
      label: "ProtoLab",
      href: "/work/science-jury",
      previewImage: "/work/science-jury/sj-cover-image.webp",
    },
    suffix: ".",
  },
};

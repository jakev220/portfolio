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
    link: { label: "StepStone Group", href: "https://www.stepstonegroup.com/" },
    suffix: ".",
  },
  previous: {
    prefix: "Previously designed the interface and interaction model for a multi-agent LLM system at",
    link: {
      label: "ScienceJury",
      href: "/work/science-jury",
      previewImage: "/work/science-jury/sj-cover-image.webp",
    },
    suffix: ".",
  },
};

import type { HeroProps } from "@/components/Hero";

/**
 * Home-page hero content. Edit copy here — the Hero component stays content-
 * agnostic. Replace the placeholder links (`#`) and add `avatarSrc` once the
 * profile photo is available.
 */
export const hero: HeroProps = {
  name: "Jake Villaseñor",
  lead: "is a",
  role: "digital product designer",
  tagline: [
    "untangling complexity and optimizing experiences",
    "for ease, connection, and delight.",
  ],
  current: {
    prefix: "Currently building developer tools to optimize dashboard production at",
    link: { label: "StepStone Group", href: "#" },
    suffix: ".",
  },
  previous: {
    prefix: "Previously designing multi-agent LLM systems at",
    link: { label: "ProtoLab", href: "#" },
    suffix: ".",
  },
};

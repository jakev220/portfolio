import { avatars } from "@/content/avatars";

export interface ExploreLinkTile {
  label: string;
  href: string;
  /** Stills cycled on hover (avatar-style instant cuts). */
  images: string[];
}

export interface ExploreProjectFallback {
  /** Label when no other published case study exists. */
  label: string;
}

/**
 * Case-study end collage (“Keep exploring”). Edit copy / stills here —
 * components stay content-agnostic. Next-project cover comes from work
 * frontmatter via {@link getNextWork}.
 */
export const keepExploring = {
  heading: "Keep exploring",
  about: {
    label: "About",
    href: "/about",
    images: [
      avatars[0].src,
      avatars[1].src,
      avatars[2].src,
      avatars[3].src,
      "/photos/jake-speaking.webp",
    ],
  } satisfies ExploreLinkTile,
  play: {
    label: "Play",
    href: "/play",
    images: [
      "/photos/dfa-ux-panel.webp",
      "/photos/ps-design-dinner.webp",
      "/photos/jake-speaking.webp",
      "/avatar/jake-4-wide.webp",
    ],
  } satisfies ExploreLinkTile,
  nextProjectFallback: {
    label: "More soon",
  } satisfies ExploreProjectFallback,
} as const;

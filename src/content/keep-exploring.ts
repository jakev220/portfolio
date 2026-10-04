export interface ExploreLinkTile {
  label: string;
  href: string;
  /** Cover still(s). Multiple enable hover cycling; one is a static zoom. */
  images: string[];
}

export interface ExploreProjectFallback {
  /** Label when no other published case study exists. */
  label: string;
}

/**
 * “Keep exploring” collage copy / stills. Case-study pages use about + archive
 * + next-project; About / Archive use a two-up pair via {@link keepExploringPair}.
 */
export const keepExploring = {
  heading: "Keep exploring",
  about: {
    label: "About",
    href: "/about",
    // Wide still — square portraits crop poorly in the 5/3 tile.
    images: ["/avatar/jake-1-wide.webp"],
  } satisfies ExploreLinkTile,
  archive: {
    label: "Archive",
    href: "/archive",
    images: ["/photos/archive/walkman-app-photo.webp"],
  } satisfies ExploreLinkTile,
  /** Featured case study for About / Archive keep-exploring pairs. */
  featuredWork: {
    label: "ScienceJury",
    href: "/work/science-jury",
    images: ["/work/science-jury/sj-cover-image.webp"],
  } satisfies ExploreLinkTile,
  nextProjectFallback: {
    label: "More case studies coming soon",
  } satisfies ExploreProjectFallback,
} as const;

/** Two-up destinations for a page that isn’t one of these hubs. */
export function keepExploringPair(
  exclude: "about" | "archive",
): [ExploreLinkTile, ExploreLinkTile] {
  if (exclude === "about") {
    return [keepExploring.archive, keepExploring.featuredWork];
  }
  return [keepExploring.about, keepExploring.featuredWork];
}

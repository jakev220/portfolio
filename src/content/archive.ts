/**
 * Archive page content — gallery of prototypes / explorations that don’t need
 * a full case study. Add media under `/public/photos/archive` and list them in
 * `items`. Entries without `src` (and without `frames`) render as surface
 * placeholders.
 */

export type ArchiveMediaKind = "image" | "video";

/** Full-bleed still in a cycle. */
export interface ArchiveImageFrame {
  type: "image";
  src: string;
}

/**
 * 2×2 grid on a solid background. Outer padding equals the gap between cells.
 * In the cycle, cells appear one at a time in reading order (TL → TR → BL → BR),
 * accumulating until the full 2×2 is visible, then each still plays full-bleed.
 */
export interface ArchiveQuadFrame {
  type: "quad";
  /** CSS color for the frame canvas. */
  background: string;
  /** Four stills in reading order: TL, TR, BL, BR. */
  images: [string, string, string, string];
}

export type ArchiveFrame = ArchiveImageFrame | ArchiveQuadFrame;

export interface ArchiveItem {
  /** Unique key (also used for React lists). */
  id: string;
  /** Path under `/public`. Omit for a surface placeholder tile. */
  src?: string;
  /**
   * Media type. Inferred from the file extension when omitted
   * (`.mp4` / `.webm` → video, otherwise image).
   */
  kind?: ArchiveMediaKind;
  /** Accessible description of the still / clip. */
  alt?: string;
  /**
   * Optional CSS aspect ratio for the tile (e.g. `"1 / 1"`). When set, media
   * fills with `object-cover` — useful for cropping letterboxed phone captures.
   * Cycle tiles default to square when omitted.
   */
  aspect?: string;
  /**
   * Hover-only still cycle (avatar-style cuts). When set, replaces the single
   * `src` display; prefer keeping `src` as the first frame for fallbacks.
   */
  frames?: ArchiveFrame[];
  /**
   * Manual carousel slides (arrows + dots). When set, replaces the single
   * `src` display; prefer keeping `src` as the first slide for fallbacks.
   */
  slides?: { src: string; alt?: string }[];
  /**
   * Optional destination when the tile should link out (project, case study,
   * external URL). Omit for a non-interactive still.
   */
  href?: string;
}

export interface ArchiveContent {
  title: string;
  description: string;
  items: ArchiveItem[];
}

/** Instant-cut cadence for archive hover cycles (avatar-reel speed). */
export const ARCHIVE_CYCLE_MS = 400;

export function archiveMediaKind(item: ArchiveItem): ArchiveMediaKind | null {
  if (!item.src) return null;
  if (item.kind) return item.kind;
  return /\.(mp4|webm)$/i.test(item.src) ? "video" : "image";
}

export const archive: ArchiveContent = {
  title: "Archive",
  description:
    "Prototypes, design explorations, and other fun stuff I've worked on.",
  items: [
    {
      id: "lex",
      src: "/photos/archive/lex-tshirt.webp",
      alt: "Lex design explorations",
      aspect: "1 / 1",
      frames: [
        { type: "image", src: "/photos/archive/lex-tshirt.webp" },
        {
          type: "quad",
          background: "#000000",
          images: [
            "/photos/archive/lex-long-type.webp",
            "/photos/archive/lex-brat-theme.webp",
            "/photos/archive/lex-kiss-theme.webp",
            "/photos/archive/lex-dither.webp",
          ],
        },
        { type: "image", src: "/photos/archive/lex-mask.webp" },
      ],
    },
    {
      id: "spin-ps-story",
      src: "/photos/archive/spin-ps-story.webp",
      alt: "SPIN Product Space story prototype",
    },
    {
      id: "ps-figma-workshop-cover",
      src: "/photos/archive/ps-figma-workshop-cover.webp",
      alt: "Product Space Figma workshop cover",
      href: "https://www.figma.com/design/TX5h0FGdOowdMOc5cuhTpW/Product-Space-Figma-Workshop?node-id=139-1505&t=EJd6JfRDIbTdYlIX-1",
    },
    {
      id: "placeholder-1",
    },
    {
      id: "placeholder-3",
    },
    {
      id: "give-a-dam-poster-bg",
      src: "/photos/archive/give-a-dam-poster-bg.webp",
      alt: "Give a Dam poster background",
    },
    {
      id: "growing-connotative-type",
      src: "/photos/archive/growing-connotative-type.webp",
      alt: "Growing connotative type",
    },
    {
      id: "placeholder-2",
    },
    {
      id: "lake-arrowhead-memento",
      src: "/photos/archive/lake-arrowhead-memento.webp",
      alt: "Lake Arrowhead memento",
    },
    {
      id: "cses-dev-recruitment",
      src: "/photos/archive/cses-dev-pm-recruitment.webp",
      alt: "CSES Dev recruitment graphics",
      aspect: "1 / 1",
      slides: [
        {
          src: "/photos/archive/cses-dev-pm-recruitment.webp",
          alt: "CSES Dev PM recruitment graphic",
        },
        {
          src: "/photos/archive/cses-dev-sde-recruitment.webp",
          alt: "CSES Dev SDE recruitment graphic",
        },
      ],
    },
    {
      id: "placeholder-4",
    },
  ],
};

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
 * 2×2 grid on a solid background. Outer padding equals the gap between cells
 * when `gutters` is true (default). In the cycle, cells appear one at a time in
 * reading order (TL → TR → BL → BR), accumulating until the full 2×2 is visible,
 * then each still plays full-bleed.
 */
export interface ArchiveQuadFrame {
  type: "quad";
  /** CSS color for the frame canvas. */
  background: string;
  /** Four stills in reading order: TL, TR, BL, BR. */
  images: [string, string, string, string];
  /** When false, cells are flush (no padding/gap). Default true. */
  gutters?: boolean;
}

/** Letterboxed video beat — advances on `ended` (honors `playbackRate`). */
export interface ArchiveVideoFrame {
  type: "video";
  src: string;
  /** CSS color behind the letterboxed video. */
  background: string;
  /** HTML video `playbackRate`. Default `1`. */
  playbackRate?: number;
}

export type ArchiveFrame =
  | ArchiveImageFrame
  | ArchiveQuadFrame
  | ArchiveVideoFrame;

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
   * How cycle stills fit the tile. Default `cover`. Use `contain` when frames
   * share a fixed tile aspect but have mixed intrinsic ratios (equal height,
   * letterboxed width).
   */
  fit?: "cover" | "contain";
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
   * Media stacked in one `break-inside-avoid` unit so CSS columns can’t split
   * a thematic pair across the mosaic. Videos inferred from extension.
   */
  stack?: {
    src: string;
    alt?: string;
    aspect?: string;
    loopDelayMs?: number;
    playbackRate?: number;
  }[];
  /**
   * Optional destination when the tile should link out (project, case study,
   * external URL). Omit for a non-interactive still.
   */
  href?: string;
  /**
   * For mosaic videos: ms to hold on the last frame before restarting the
   * loop. Omit (or `0`) for an immediate loop.
   */
  loopDelayMs?: number;
  /** For mosaic videos: HTML video `playbackRate`. Default `1`. */
  playbackRate?: number;
}

export interface ArchiveContent {
  title: string;
  description: string;
  items: ArchiveItem[];
}

/** Instant-cut cadence for archive hover cycles (avatar-reel speed). */
export const ARCHIVE_CYCLE_MS = 500;

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
    // Thematic pairs stay adjacent; playable tiles are spaced through the
    // mosaic so motion isn’t concentrated at the bottom.
    {
      id: "chibi-k-run",
      src: "/photos/archive/chibi-k-mobile-home.webp",
      alt: "Chibi-K Run site and Figma files",
      aspect: "1 / 1",
      frames: [
        {
          type: "quad",
          background: "#000000",
          gutters: false,
          images: [
            "/photos/archive/chibi-k-mobile-home.webp",
            "/photos/archive/chibi-k-mobile-events.webp",
            "/photos/archive/chibi-k-mobile-volunteer.webp",
            "/photos/archive/chibi-k-mobile-support.webp",
          ],
        },
        {
          type: "video",
          src: "/photos/archive/chibi-k-demo.mp4",
          background: "#e3efff",
          playbackRate: 0.25,
        },
      ],
    },
    {
      id: "spin-pair",
      stack: [
        {
          src: "/photos/archive/spin-ps-story.webp",
          alt: "SPIN Product Space story prototype",
        },
        {
          src: "/photos/archive/spin-messaging-redesign.mp4",
          alt: "SPIN messaging redesign prototype",
          loopDelayMs: 1000,
        },
      ],
    },
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
      id: "memento-give-a-dam",
      stack: [
        {
          src: "/photos/archive/lake-arrowhead-memento.webp",
          alt: "Lake Arrowhead memento",
        },
        {
          src: "/photos/archive/give-a-dam-poster-bg.webp",
          alt: "Give a Dam poster background",
        },
      ],
    },
    {
      id: "tj-card-shuffle",
      src: "/photos/archive/tj-card-shuffle.mp4",
      alt: "TJ card shuffle prototype",
      aspect: "1 / 1",
    },
    {
      id: "walkman-app-photo",
      src: "/photos/archive/walkman-app-photo.webp",
      alt: "Walkman app photo",
    },
    {
      id: "style-seek",
      src: "/photos/archive/style-seek.mp4",
      alt: "Style Seek prototype",
    },
    {
      id: "growing-connotative-type",
      src: "/photos/archive/growing-connotative-type.webp",
      alt: "Growing connotative type",
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
      id: "superlative",
      src: "/photos/archive/superlative-1.webp",
      alt: "Superlative design explorations",
      // First frame — shared tile size; other stills cover and crop as needed.
      aspect: "3168 / 2448",
      frames: [
        { type: "image", src: "/photos/archive/superlative-1.webp" },
        { type: "image", src: "/photos/archive/superlative-2.webp" },
        { type: "image", src: "/photos/archive/superlative-3.webp" },
        { type: "image", src: "/photos/archive/superlative-4.webp" },
        { type: "image", src: "/photos/archive/superlative-5.webp" },
        { type: "image", src: "/photos/archive/superlative-6.webp" },
      ],
    },
    {
      id: "memorylook-demo",
      src: "/photos/archive/memorylook-demo.mp4",
      alt: "Memorylook demo",
      // Vertical crop centered on the phone (source is 16:9 with side margins).
      aspect: "9 / 16",
      playbackRate: 0.5,
    },
    {
      id: "ps-figma-workshop-cover",
      src: "/photos/archive/ps-figma-workshop-cover.webp",
      alt: "Product Space Figma workshop cover",
      href: "https://www.figma.com/design/TX5h0FGdOowdMOc5cuhTpW/Product-Space-Figma-Workshop?node-id=139-1505&t=EJd6JfRDIbTdYlIX-1",
    },
  ],
};

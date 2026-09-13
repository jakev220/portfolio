/**
 * Archive page content — gallery of prototypes / explorations that don’t need
 * a full case study. Add media under `/public/photos/archive` and list them in
 * `items`. Entries without `src` render as surface placeholders.
 */

export type ArchiveMediaKind = "image" | "video";

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
   */
  aspect?: string;
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
      id: "spin-ps-story",
      src: "/photos/archive/spin-ps-story.webp",
      alt: "SPIN Product Space story prototype",
    },
    {
      id: "placeholder-1",
    },
    {
      id: "lake-arrowhead-memento",
      src: "/photos/archive/lake-arrowhead-memento.webp",
      alt: "Lake Arrowhead memento",
    },
    {
      id: "placeholder-2",
    },
    {
      id: "placeholder-3",
    },
    {
      id: "placeholder-4",
    },
  ],
};

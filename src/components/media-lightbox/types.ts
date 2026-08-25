/** A single page-scoped media item registered with the lightbox gallery. */
export interface LightboxMediaItem {
  id: string;
  /** Still image path. Ignored when `video` is set. */
  src?: string;
  /** Video path — takes precedence over `src` in the lightbox. */
  video?: string;
  /** Poster frame for video. */
  poster?: string;
  /** Accessible name; also used as caption fallback. */
  alt: string;
  /** Visible caption under the media. Falls back to `alt` when omitted. */
  caption?: string;
}

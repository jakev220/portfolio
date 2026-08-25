import Image from "next/image";
import { FigureVideo } from "@/components/case-study/FigureVideo";
import { ExpandableMedia } from "@/components/media-lightbox/ExpandableMedia";

export interface FigureProps {
  /**
   * Image source (e.g. "/work/science-jury/results.png"). Ignored when `video`
   * is set. When both `src`/`video` are omitted, renders a neutral placeholder.
   */
  src?: string;
  /**
   * MP4 (or other) video source (e.g. "/work/science-jury/panel.mp4"). Takes
   * precedence over `src`. Lazy-loads when near the viewport.
   */
  video?: string;
  /**
   * Still frame shown before the video loads / plays. Also used as the
   * `<video poster>`. Prefer a compressed image in `public/work/<slug>/`.
   */
  poster?: string;
  /** Alt / accessible name — required whenever media is set. */
  alt?: string;
  /**
   * Visible lightbox caption. Falls back to `alt` when omitted. String prop
   * so MDX can set it (`caption="…"`).
   */
  caption?: string;
  /**
   * Video playback speed as a string for MDX (e.g. "0.75"). `1` = normal.
   * Only applies when `video` is set.
   */
  playbackRate?: string;
  /**
   * Video fit inside the figure. `"cover"` (default) or `"top-right"` (pin to
   * top + right, full box height, intrinsic width). String for MDX.
   */
  fit?: "cover" | "top-right";
  /**
   * Aspect ratio as "W/H" (e.g. "16/9", "2128/1304"). For images, sets the
   * intrinsic `width`/`height` so the figure height follows the asset
   * (`h-auto w-full`). For video / empty placeholders, locks the box.
   * Defaults to 16/9.
   */
  ratio?: string;
  /**
   * Corner radius. `"xl"` (default) → `rounded-xl`. `"none"` → square corners.
   * String so MDX can set it (`rounded="none"`). Ignored when `frame` is set
   * (frames use a fixed 12px radius).
   */
  rounded?: "xl" | "none";
  /**
   * Optional panel chrome. `"ink-08"` → light-mode plate (#FBFBFB fill,
   * #EAEAEA stroke, 12px radius) that stays the same in dark mode.
   */
  frame?: "ink-08";
  /** Optional class override (e.g. `my-0` when a parent owns the gap). */
  className?: string;
}

function parseRatio(ratio: string): { w: number; h: number } {
  const [rawW, rawH] = ratio.split("/");
  const w = Number(rawW);
  const h = Number(rawH);
  return {
    w: Number.isFinite(w) && w > 0 ? w : 16,
    h: Number.isFinite(h) && h > 0 ? h : 9,
  };
}

/**
 * Light-mode ink-08 chrome — fixed solids so dark mode keeps the same plate
 * (transparent mixes would pick up the dark page bg).
 * black-08 on #FEFEFE ≈ #EAEAEA; that at 15% opacity ≈ #FBFBFB.
 */
const INK_08_STROKE = "#EAEAEA";
const INK_08_FILL_15 = "#FBFBFB";

/**
 * Case-study media block: a surface for an image (`next/image`), a lazy MP4, or
 * a neutral placeholder. Width is owned by the container; image height follows
 * the asset aspect ratio. Corner radius defaults to `xl` and can be turned off.
 * Hover expand opens the page media lightbox.
 */
export function Figure({
  src,
  video,
  poster,
  alt = "",
  caption,
  playbackRate,
  fit,
  ratio = "16/9",
  rounded = "xl",
  frame,
  className = "my-8",
}: FigureProps) {
  const { w, h } = parseRatio(ratio);
  const lockBox = Boolean(video) || !src;
  // Keep surface fill for empty / video slots only — image webps often use
  // transparency, and `bg-surface` would show through as a gray plate.
  // Framed figures supply their own fill instead.
  const surface = lockBox && !frame ? "bg-surface" : "";
  const radiusClass = frame ? "" : rounded === "none" ? "" : "rounded-xl";
  const hasMedia = Boolean(video || src);

  const frameStyle =
    frame === "ink-08"
      ? {
          backgroundColor: INK_08_FILL_15,
          borderWidth: 1,
          borderStyle: "solid" as const,
          borderColor: INK_08_STROKE,
          borderRadius: 12,
        }
      : undefined;

  const media = video ? (
    <FigureVideo
      src={video}
      poster={poster}
      alt={alt}
      playbackRate={playbackRate}
      fit={fit}
    />
  ) : src ? (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      // Case-study webps are already compressed; skip the optimizer so we
      // don't re-encode (and soften) UI screenshots / transparent assets.
      unoptimized
      className="h-auto w-full"
      sizes="(min-width: 1280px) 1232px, calc(100vw - 48px)"
    />
  ) : null;

  return (
    <figure
      className={`relative w-full overflow-hidden ${radiusClass} ${surface} ${className}`}
      style={{
        ...(lockBox ? { aspectRatio: `${w} / ${h}` } : null),
        ...frameStyle,
      }}
    >
      {hasMedia ? (
        <ExpandableMedia
          src={src}
          video={video}
          poster={poster}
          alt={alt}
          caption={caption}
          fill={lockBox}
        >
          {media}
        </ExpandableMedia>
      ) : (
        media
      )}
    </figure>
  );
}

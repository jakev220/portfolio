import Image from "next/image";
import { FigureVideo } from "@/components/case-study/FigureVideo";

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
   * Video playback speed as a string for MDX (e.g. "0.75"). `1` = normal.
   * Only applies when `video` is set.
   */
  playbackRate?: string;
  /**
   * Aspect ratio as "W/H" (e.g. "16/9", "2128/1304"). For images, sets the
   * intrinsic `width`/`height` so the figure height follows the asset
   * (`h-auto w-full`). For video / empty placeholders, locks the box.
   * Defaults to 16/9.
   */
  ratio?: string;
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
 * Case-study media block: a rounded surface for an image (`next/image`), a lazy
 * MP4, or a neutral placeholder. Width is owned by the container; image height
 * follows the asset aspect ratio.
 */
export function Figure({
  src,
  video,
  poster,
  alt = "",
  playbackRate,
  ratio = "16/9",
  className = "my-8",
}: FigureProps) {
  const { w, h } = parseRatio(ratio);
  const lockBox = Boolean(video) || !src;
  // Keep surface fill for empty / video slots only — image webps often use
  // transparency, and `bg-surface` would show through as a gray plate.
  const surface = lockBox ? "bg-surface" : "";

  return (
    <figure
      className={`relative w-full overflow-hidden rounded-xl ${surface} ${className}`}
      style={lockBox ? { aspectRatio: `${w} / ${h}` } : undefined}
    >
      {video ? (
        <FigureVideo
          src={video}
          poster={poster}
          alt={alt}
          playbackRate={playbackRate}
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
      ) : null}
    </figure>
  );
}

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
   * Aspect ratio as "W/H" (e.g. "16/9", "1024/500"). Reserves the box height
   * so the media slot doesn't collapse when empty. Defaults to 16/9.
   */
  ratio?: string;
  /** Optional class override (e.g. `my-0` when a parent owns the gap). */
  className?: string;
}

/**
 * Case-study media block: a rounded, aspect-locked surface for an image
 * (`next/image`), a lazy MP4, or a neutral placeholder. Width is owned by the
 * container.
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
  return (
    <figure
      className={`relative w-full overflow-hidden rounded-xl bg-surface ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
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
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 1232px, calc(100vw - 48px)"
        />
      ) : null}
    </figure>
  );
}

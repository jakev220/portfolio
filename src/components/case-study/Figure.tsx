import Image from "next/image";

export interface FigureProps {
  /**
   * Image source (e.g. "/work/science-jury/results.png"). When omitted, the
   * box renders as a neutral placeholder that still reserves its aspect ratio,
   * so layout stays stable before artwork is dropped in.
   */
  src?: string;
  /** Alt text — required whenever `src` is set. */
  alt?: string;
  /**
   * Aspect ratio as "W/H" (e.g. "16/9", "1024/500"). Reserves the box height
   * so the media slot doesn't collapse when empty. Defaults to 16/9.
   */
  ratio?: string;
  /** Optional class override (e.g. `my-0` when a parent owns the gap). */
  className?: string;
}

/**
 * Case-study media block: a rounded, aspect-locked surface that shows an image
 * via `next/image` (object-cover) or a neutral `bg-surface` placeholder when no
 * `src` is provided. Layout-agnostic — width is owned by its container.
 */
export function Figure({
  src,
  alt = "",
  ratio = "16/9",
  className = "my-8",
}: FigureProps) {
  return (
    <figure
      className={`relative w-full overflow-hidden rounded-xl bg-surface ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {src ? (
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

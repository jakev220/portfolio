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
}

/**
 * Case-study media block: a rounded, aspect-locked surface that shows an image
 * via `next/image` (object-cover) or a neutral `bg-surface` placeholder when no
 * `src` is provided. Layout-agnostic — width is owned by its container (a
 * `Split`/`MediaRow` body column, or a full-width `Section` child). Vertical
 * rhythm (`my-8` → 32px) suits body flow; containers that need a different gap
 * reset it (e.g. `Section` zeroes the margin and spaces via its 64px gap).
 */
export function Figure({ src, alt = "", ratio = "16/9" }: FigureProps) {
  return (
    <figure
      className="relative my-8 w-full overflow-hidden rounded-xl bg-surface"
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 1024px, 100vw"
        />
      ) : null}
    </figure>
  );
}

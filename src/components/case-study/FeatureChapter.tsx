import type { ReactNode } from "react";
import { Figure } from "@/components/case-study/Figure";
import { Subtle } from "@/components/case-study/Subtle";

export interface FeatureChapterProps {
  /** Full-width chapter title (e.g. "Configuring the agent panel"). */
  title: string;
  /**
   * Optional de-emphasized suffix rendered with `<Subtle>` (e.g. "(01)").
   * String prop — MDX can't nest JSX inside `title=""`.
   */
  subtle?: string;
  /** Optional cover image for the 12-col hero. */
  src?: string;
  /** Optional cover video — takes precedence over `src` when set. */
  video?: string;
  /** Poster frame for the cover video. */
  poster?: string;
  /** Cover video playback speed (string for MDX, e.g. "0.75"). */
  playbackRate?: string;
  /**
   * Video fit in the hero figure. `"cover"` (default) or `"top-right"`.
   */
  fit?: "cover" | "top-right";
  alt?: string;
  /** Lightbox caption; falls back to `alt`. */
  caption?: string;
  /** Hero aspect ratio. Defaults to the Figma 1280/640 frame. */
  ratio?: string;
  /** Following rows — typically `Split` + `InsetFigure` blocks. */
  children?: ReactNode;
}

/**
 * Solution-chapter opener: full-width title + 12-col hero figure, then any
 * nested body rows. Title→hero stays tighter; chapter body uses the same
 * stepped gap as `<Section>` so solution points can breathe.
 */
export function FeatureChapter({
  title,
  subtle,
  src,
  video,
  poster,
  playbackRate,
  fit,
  alt = "",
  caption,
  ratio = "1280/640",
  children,
}: FeatureChapterProps) {
  return (
    <div className="flex min-w-0 flex-col gap-12 sm:gap-16 lg:gap-20">
      <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
        <h3 className="text-h2 text-heading m-0 break-words">
          {title}
          {subtle ? (
            <>
              {" "}
              <Subtle>{subtle}</Subtle>
            </>
          ) : null}
        </h3>
        <Figure
          src={src}
          video={video}
          poster={poster}
          playbackRate={playbackRate}
          fit={fit}
          alt={alt}
          caption={caption}
          ratio={ratio}
          className="my-0 border border-border"
        />
      </div>
      {children ? (
        <div className="flex min-w-0 flex-col gap-12 sm:gap-16 lg:gap-20 [&>*]:my-0">
          {children}
        </div>
      ) : null}
    </div>
  );
}

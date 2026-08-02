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
  alt?: string;
  /** Hero aspect ratio. Defaults to the Figma 1280/640 frame. */
  ratio?: string;
  /** Following rows — typically `Split` + `InsetFigure` blocks. */
  children?: ReactNode;
}

/**
 * Solution-chapter opener: full-width title + 12-col hero figure, then any
 * nested body rows. Own vertical gap matches Figma (32px title→hero).
 */
export function FeatureChapter({
  title,
  subtle,
  src,
  alt = "",
  ratio = "1280/640",
  children,
}: FeatureChapterProps) {
  return (
    <div className="flex min-w-0 flex-col gap-10 sm:gap-12 lg:gap-16">
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
        <Figure src={src} alt={alt} ratio={ratio} className="my-0" />
      </div>
      {children ? (
        <div className="flex min-w-0 flex-col gap-10 sm:gap-12 lg:gap-16 [&>*]:my-0">
          {children}
        </div>
      ) : null}
    </div>
  );
}

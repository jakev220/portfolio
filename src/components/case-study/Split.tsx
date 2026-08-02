import { Children, type ReactNode } from "react";
import {
  RightProse,
  SplitGrid,
  isSplitHeading,
} from "@/components/case-study/SplitGrid";

export interface SplitProps {
  /**
   * Heading level for the left column. Defaults to `h2`. Use `h3` for
   * subordinate points under a `FeatureChapter` title.
   */
  level?: "h2" | "h3";
  /**
   * Provide the left-column heading via a `<SplitHeading>` child; everything
   * else becomes the right-column body prose (constrained to 6 of 7 columns).
   */
  children: ReactNode;
}

/**
 * "Split" row — heading on the left and narrative body on the right (4 / 1 / 7).
 * Defaults to `h2`. Pass `level="h3"` for solution points under a chapter title.
 * Geometry comes from `SplitGrid`.
 */
export function Split({ level = "h2", children }: SplitProps) {
  const childArray = Children.toArray(children);
  const headingEl = childArray.find(isSplitHeading);
  const body = childArray.filter(
    (child) =>
      !isSplitHeading(child) &&
      !(typeof child === "string" && child.trim() === ""),
  );

  const HeadingTag = level;
  const headingClass =
    level === "h3" ? "text-h3 text-heading m-0" : "text-h2 text-heading m-0";

  return (
    <SplitGrid
      left={
        <HeadingTag className={headingClass}>
          {headingEl?.props.children}
        </HeadingTag>
      }
      right={<RightProse>{body}</RightProse>}
    />
  );
}

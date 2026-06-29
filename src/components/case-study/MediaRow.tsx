import { Children, type ReactNode } from "react";
import {
  SplitGrid,
  isSplitHeading,
} from "@/components/case-study/SplitGrid";

export interface MediaRowProps {
  /**
   * Provide the left-column heading via a `<SplitHeading>` child and the media
   * (a `<Figure>`) as the remaining child.
   */
  children: ReactNode;
}

/**
 * "Media row" — an `h3` heading on the left and a `Figure` on the right, on the
 * shared `SplitGrid`. A sub-point within a `Section`, subordinate to the lead
 * `Split`'s `h2`. Stack several inside a `Section` for a goals / feature list.
 */
export function MediaRow({ children }: MediaRowProps) {
  const childArray = Children.toArray(children);
  const headingEl = childArray.find(isSplitHeading);
  const media = childArray.filter(
    (child) =>
      !isSplitHeading(child) &&
      !(typeof child === "string" && child.trim() === ""),
  );

  return (
    <SplitGrid
      left={<h3 className="text-h3 text-heading">{headingEl?.props.children}</h3>}
      right={media}
    />
  );
}

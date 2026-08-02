import { Children, isValidElement, type ReactNode } from "react";
import { Figure } from "@/components/case-study/Figure";
import {
  RightProse,
  SplitGrid,
  isSplitHeading,
} from "@/components/case-study/SplitGrid";

export interface MediaRowProps {
  /**
   * Provide the left-column heading via a `<SplitHeading>` child. Remaining
   * children become the right rail: prose (if any) is 6-of-7; a trailing
   * `<Figure>` fills all 7.
   */
  children: ReactNode;
}

function isFigureNode(child: ReactNode): boolean {
  return isValidElement(child) && child.type === Figure;
}

/**
 * "Media row" — an `h3` heading on the left and a stacked prose + figure column
 * on the right, on the shared `SplitGrid`. A sub-point within a `Section`.
 */
export function MediaRow({ children }: MediaRowProps) {
  const childArray = Children.toArray(children);
  const headingEl = childArray.find(isSplitHeading);
  const rest = childArray.filter(
    (child) =>
      !isSplitHeading(child) &&
      !(typeof child === "string" && child.trim() === ""),
  );

  const prose = rest.filter((child) => !isFigureNode(child));
  const media = rest.filter(isFigureNode);

  return (
    <SplitGrid
      left={
        <h3 className="text-h3 text-heading m-0">{headingEl?.props.children}</h3>
      }
      right={
        <div className="flex flex-col gap-8 [&>*]:my-0">
          {prose.length > 0 ? <RightProse>{prose}</RightProse> : null}
          {media}
        </div>
      }
    />
  );
}

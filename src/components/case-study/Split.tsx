import { Children, type ReactNode } from "react";
import {
  SplitGrid,
  isSplitHeading,
} from "@/components/case-study/SplitGrid";

export interface SplitProps {
  /** Eyebrow / section label shown above the heading (e.g. "Design strategy"). */
  label?: string;
  /**
   * Provide the left-column heading via a `<SplitHeading>` child; everything
   * else becomes the right-column body prose.
   */
  children: ReactNode;
}

/**
 * "Split" row — an `h2` heading on the left and narrative body on the right,
 * with an optional eyebrow label above (tight 8px gap). Typically the lead row
 * of a `Section`. Geometry comes from `SplitGrid`; `Section` owns the spacing
 * around it.
 */
export function Split({ label, children }: SplitProps) {
  const childArray = Children.toArray(children);
  const headingEl = childArray.find(isSplitHeading);
  const body = childArray.filter(
    (child) =>
      !isSplitHeading(child) &&
      !(typeof child === "string" && child.trim() === ""),
  );

  return (
    <div className="flex flex-col gap-2">
      {label ? <p className="text-label text-secondary">{label}</p> : null}
      <SplitGrid
        left={<h2 className="text-h2 text-heading">{headingEl?.props.children}</h2>}
        right={body}
      />
    </div>
  );
}

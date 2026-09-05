import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

interface SlotProps {
  children: ReactNode;
}

/**
 * Content-only slot for a row's left-column heading. The parent row (`Split`,
 * `MediaRow`) decides the heading tag; this just carries the heading's inline
 * content so it can hold markdown (emphasis, etc.) and avoid the
 * `next-mdx-remote/rsc` dropped-expression-attribute limitation.
 */
export function SplitHeading({ children }: SlotProps) {
  return <>{children}</>;
}

export function isSplitHeading(
  child: ReturnType<typeof Children.toArray>[number],
): child is ReactElement<SlotProps> {
  return isValidElement(child) && child.type === SplitHeading;
}

interface SplitGridProps {
  /** Left column — four tracks of the shared 12-column grid at lg+. */
  left: ReactNode;
  /** Right column — seven tracks starting at column 6 (one-column hang). */
  right: ReactNode;
}

/**
 * Shared case-study / About row geometry: four columns for the heading/meta,
 * one column of hang space, and seven columns for the body/media rail (4 / 1 / 7).
 * Stacks below lg so intermediate widths don't crush the rails. Both `Split`
 * and `MediaRow` render through this so the geometry stays single-sourced.
 *
 * Prose inside the right rail should usually wrap with {@link RightProse} so
 * copy spans 6 of the 7 columns while media can fill all 7.
 */
export function SplitGrid({ left, right }: SplitGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-4">
      <div className="min-w-0 lg:col-span-4">{left}</div>
      <div className="min-w-0 lg:col-span-7 lg:col-start-6">{right}</div>
    </div>
  );
}

/**
 * Constrains children to 6 of the 7 right-rail columns. Use for body copy;
 * leave media/charts as direct children of the 7-col rail so they go full-bleed
 * within that rail.
 */
export function RightProse({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-7 lg:gap-4 ${className}`}>
      <div className="min-w-0 text-body lg:col-span-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Places children in the 7-column right rail with an empty 4-col left hang.
 * Compose with {@link RightProse} for copy and bare children for full-rail media.
 */
export function RightRail({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-4">
      <div className="flex min-w-0 flex-col gap-10 sm:gap-12 lg:col-span-7 lg:col-start-6 lg:gap-16 [&>*]:my-0">
        {children}
      </div>
    </div>
  );
}

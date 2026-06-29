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
 * `MediaRow`) decides the heading tag (`h2` vs `h3`); this just carries the
 * heading's inline content so it can hold markdown (emphasis, etc.) and avoid
 * the `next-mdx-remote/rsc` dropped-expression-attribute limitation.
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
  /** Left column — fixed 400px at md+. */
  left: ReactNode;
  /** Right column — flexible. */
  right: ReactNode;
}

/**
 * Shared two-column geometry for case-study rows: a fixed 400px left column and
 * a flexible right column, 64px gap at md+, stacked below md. Matches the Figma
 * 1024px spec (400 + 64 + 560). Both `Split` and `MediaRow` render through this
 * so the geometry stays single-sourced. The right column resets its first/last
 * child margins so its content top-aligns with the left heading.
 */
export function SplitGrid({ left, right }: SplitGridProps) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-16">
      <div className="md:w-[400px] md:flex-none">{left}</div>
      <div className="flex-1 text-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {right}
      </div>
    </div>
  );
}

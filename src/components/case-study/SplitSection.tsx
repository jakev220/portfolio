import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

export interface SplitSectionProps {
  /** Eyebrow / section label shown above the split (e.g. "Research foundation"). */
  label?: string;
  /**
   * Section content. Provide the left-column heading via a `<SplitHeading>`
   * child; everything else becomes the right-column body. Authoring the heading
   * as a child (rather than a string prop) lets it carry inline markdown such as
   * emphasis — and avoids the `next-mdx-remote/rsc` limitation of dropping JSX
   * expression attributes.
   */
  children: ReactNode;
}

interface SplitHeadingProps {
  children: ReactNode;
}

/**
 * Slot marker for a `SplitSection`'s left-column heading. Renders nothing on its
 * own; `SplitSection` reads its children and places them inside the `<h2>`.
 */
export function SplitHeading({ children }: SplitHeadingProps) {
  return <>{children}</>;
}

function isSplitHeading(
  child: ReturnType<typeof Children.toArray>[number],
): child is ReactElement<SplitHeadingProps> {
  return isValidElement(child) && child.type === SplitHeading;
}

/**
 * Case-study "split section with header". A full-width eyebrow label, then a
 * two-column row: a fixed-width heading on the left and a flexible body column
 * on the right. Matches the Figma spec at 1024px (400 + 64 gap + 560) and
 * stacks vertically below `md`.
 *
 * Spacing uses Tailwind defaults as placeholders (8 / 64 → gap-8 / gap-16); the
 * 400px left column is fixed per the spec — tokenize later. The heading spans
 * the full column width.
 */
export function SplitSection({ label, children }: SplitSectionProps) {
  const childArray = Children.toArray(children);
  const headingEl = childArray.find(isSplitHeading);
  const body = childArray.filter(
    (child) =>
      !isSplitHeading(child) &&
      !(typeof child === "string" && child.trim() === ""),
  );

  return (
    <section className="flex flex-col gap-2">
      {label ? <p className="text-label text-secondary">{label}</p> : null}
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <h2 className="text-h2 text-heading md:w-[400px] md:flex-none">
          {headingEl?.props.children}
        </h2>
        <div className="flex-1 text-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {body}
        </div>
      </div>
    </section>
  );
}

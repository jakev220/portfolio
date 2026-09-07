import type { ReactNode } from "react";

export interface WideHeadingProps {
  /**
   * Type scale. Defaults to `h3` for points under a `FeatureChapter` title.
   * Use `h2` when you want SectionLead-scale type at the same 8-col width.
   */
  level?: "h2" | "h3";
  children: ReactNode;
}

const levelClass = {
  h2: "text-h2 text-heading m-0 lg:col-span-8 [&_em]:italic [&_p]:m-0 [&_p]:text-h2 [&_p]:leading-[inherit] [&_p]:text-heading [&_strong]:font-bold",
  h3: "text-h3 text-heading m-0 lg:col-span-8 [&_em]:italic [&_p]:m-0 [&_p]:text-h3 [&_p]:leading-[inherit] [&_p]:text-heading [&_strong]:font-bold",
} as const;

/**
 * Heading-only row at the same width as {@link SectionLead} leads — 8 of 12
 * columns at lg+. Use when a solution point is a single statement with no
 * accompanying body rail (replaces a heading+prose `Split`).
 *
 * Nested MDX `<p>` tags are forced to the heading size (same pattern as
 * `SectionLead`) so body styles from the MDX map don't win.
 */
export function WideHeading({ level = "h3", children }: WideHeadingProps) {
  const Tag = level;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
      <Tag className={levelClass[level]}>{children}</Tag>
    </div>
  );
}

import type { ReactNode } from "react";

export interface SectionProps {
  children: ReactNode;
}

/**
 * Case-study section: the unit of vertical rhythm. Renders a semantic
 * `<section>` and stacks its children — rows like `Split` / `MediaRow`, or a
 * full-width `Figure` — with a 64px internal gap. The 128px gap *between*
 * sections comes from the `.mdx-content` rule in `MDXContent`.
 *
 * Direct children's block margins are zeroed (`[&>*]:my-0`) so a top-level
 * `Figure`'s body-flow margin doesn't compound the gap; a `Figure` nested inside
 * a row (e.g. a `Split` body) is not a direct child and keeps its margin.
 *
 * Label-only `SectionLead` sets `data-section-eyebrow`; the following sibling
 * is pulled up so the eyebrow sits ~8px above the next heading (same as
 * label→lead), instead of the full section gap.
 */
export function Section({ children }: SectionProps) {
  return (
    <section
      className={[
        "flex min-w-0 flex-col gap-10 sm:gap-12 lg:gap-16 [&>*]:my-0",
        "[&>[data-section-eyebrow]+*]:-mt-8",
        "sm:[&>[data-section-eyebrow]+*]:-mt-10",
        "lg:[&>[data-section-eyebrow]+*]:-mt-14",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

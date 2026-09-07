import type { ReactNode } from "react";

export interface SectionProps {
  children: ReactNode;
}

/**
 * Case-study section: the unit of vertical rhythm. Renders a semantic
 * `<section>` and stacks its children — rows like `Split` / `MediaRow`, or a
 * full-width `Figure` — with an 80px internal gap at lg (`gap-12` → `gap-20`).
 * The larger gap *between* sections comes from the `.mdx-content` rule in
 * `MDXContent`.
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
        "flex min-w-0 flex-col gap-12 sm:gap-16 lg:gap-20 [&>*]:my-0",
        "[&>[data-section-eyebrow]+*]:-mt-10",
        "sm:[&>[data-section-eyebrow]+*]:-mt-14",
        "lg:[&>[data-section-eyebrow]+*]:-mt-[4.5rem]",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

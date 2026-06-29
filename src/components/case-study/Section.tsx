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
 */
export function Section({ children }: SectionProps) {
  return (
    <section className="flex flex-col gap-16 [&>*]:my-0">{children}</section>
  );
}

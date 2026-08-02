import type { ReactNode } from "react";

export interface AccordionProps {
  children: ReactNode;
}

/**
 * Stack of collapsible case-study rows. Place inside a `<Section>` as a
 * full-width sibling to `Split` / `MediaRow` / `Figure`. Items keep their own
 * bottom dividers and sit 40 → 48 → 64px apart (responsive).
 */
export function Accordion({ children }: AccordionProps) {
  return (
    <div className="flex flex-col gap-10 sm:gap-12 lg:gap-16">{children}</div>
  );
}

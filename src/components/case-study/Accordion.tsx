import type { ReactNode } from "react";

export interface AccordionProps {
  children: ReactNode;
}

/**
 * Stack of collapsible case-study rows. Place inside a `<Section>` as a
 * full-width sibling to `Split` / `MediaRow` / `Figure`. Items are separated
 * by their own bottom dividers — no extra gap between items.
 */
export function Accordion({ children }: AccordionProps) {
  return <div className="flex flex-col">{children}</div>;
}

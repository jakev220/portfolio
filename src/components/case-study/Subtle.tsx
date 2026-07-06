import type { ReactNode } from "react";

interface SubtleProps {
  children: ReactNode;
}

/**
 * Inline de-emphasis — a lighter grey span within body text (text-secondary /
 * black-40). Pairs with `<Accent>` (darkest neutral) for the two inline tones.
 * Use inside MDX prose: `1 UI/UX Designer <Subtle>(me!)</Subtle>`.
 */
export function Subtle({ children }: SubtleProps) {
  return <span className="text-secondary">{children}</span>;
}

import type { ReactNode } from "react";

interface AccentProps {
  children: ReactNode;
}

/**
 * Inline accent — emphasizes a small span of body text using the darkest
 * neutral (text-primary / black-100), distinct from the link-blue accent color.
 * Use inside MDX prose: `the <Accent>+84%</Accent> uplift`.
 */
export function Accent({ children }: AccentProps) {
  return <span className="text-primary">{children}</span>;
}

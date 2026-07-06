import type { ReactNode } from "react";

interface CalloutSubtleProps {
  children: ReactNode;
}

/**
 * Inline de-emphasis inside a callout — muted grey on the dark callout palette.
 * Use within `<CalloutHeading>` for mixed-tone headlines; site `<Subtle>` targets
 * the light-theme text ramp and won't read correctly on callout backgrounds.
 */
export function CalloutSubtle({ children }: CalloutSubtleProps) {
  return <span className="text-callout-muted">{children}</span>;
}

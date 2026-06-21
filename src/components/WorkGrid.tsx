import type { ReactNode } from "react";
import type { CaseStudyCardVariant } from "@/components/CaseStudyCard";

export interface WorkGridProps {
  /** Arrangement of the cards. Mirrors the active `CaseStudyCard` variant. */
  variant?: CaseStudyCardVariant;
  /** The `CaseStudyCard` elements to lay out. */
  children: ReactNode;
}

/**
 * Lays out the home-page work section. The arrangement depends on the active
 * view state (set by the future view toggle):
 * - `stack`  → single column, full-width rows.
 * - `card`   → 2-column grid on large screens.
 *
 * Both use 64px gaps on large screens, scaling down on smaller viewports.
 * `inline` falls back to the single-column layout until implemented.
 */
export function WorkGrid({ variant = "stack", children }: WorkGridProps) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        {children}
      </div>
    );
  }

  return <div className="flex flex-col gap-12 lg:gap-16">{children}</div>;
}

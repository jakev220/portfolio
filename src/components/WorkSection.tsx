"use client";

import { useState } from "react";
import {
  CaseStudyCard,
  type CaseStudyCardProps,
  type CaseStudyCardVariant,
} from "@/components/CaseStudyCard";
import { WorkGrid } from "@/components/WorkGrid";
import { WorkViewToggle } from "@/components/WorkViewToggle";

type WorkItem = Omit<CaseStudyCardProps, "variant">;

export interface WorkSectionProps {
  /** Work items to render; the active view is applied to each card. */
  items: WorkItem[];
}

/**
 * Home-page work section: a right-aligned view toggle stacked directly above
 * the case-study grid. The toggle carries no vertical padding; the grid
 * container owns the 64px top/bottom spacing (Tailwind-default placeholders,
 * responsive — refine with custom spacing later).
 */
export function WorkSection({ items }: WorkSectionProps) {
  const [variant, setVariant] = useState<CaseStudyCardVariant>("stack");

  return (
    <section aria-label="Selected work">
      <div className="flex justify-end">
        <WorkViewToggle value={variant} onChange={setVariant} />
      </div>

      <div className="py-12 md:py-16">
        <WorkGrid variant={variant}>
          {items.map((item, index) => (
            <CaseStudyCard key={index} {...item} variant={variant} />
          ))}
        </WorkGrid>
      </div>
    </section>
  );
}

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
 * Home-page work section. Stack is the default at every breakpoint; the view
 * toggle is tablet+ only. Toggle sits in the hero’s lower empty space
 * (`absolute bottom-full`) so in-flow top padding doesn’t eat the ~10% Work
 * peek from `lg:min-h-[90dvh]` on the home hero.
 */
export function WorkSection({ items }: WorkSectionProps) {
  const [variant, setVariant] = useState<CaseStudyCardVariant>("stack");

  return (
    <section aria-label="Selected work" className="relative">
      <div className="absolute bottom-full right-0 mb-12 hidden justify-end md:flex md:mb-16">
        <WorkViewToggle value={variant} onChange={setVariant} />
      </div>

      <div className="pb-12 md:pb-16">
        <WorkGrid variant={variant}>
          {items.map((item, index) => (
            <CaseStudyCard key={index} {...item} variant={variant} />
          ))}
        </WorkGrid>
      </div>
    </section>
  );
}

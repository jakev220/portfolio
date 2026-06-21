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

/**
 * Client wrapper that owns the selected view state, renders the toggle
 * (far right, 64px above the cards) and the work grid for that variant.
 */
export function WorkPreview({ items }: { items: WorkItem[] }) {
  const [variant, setVariant] = useState<CaseStudyCardVariant>("stack");

  return (
    <div>
      <div className="mb-12 flex justify-end md:mb-16">
        <WorkViewToggle value={variant} onChange={setVariant} />
      </div>
      <WorkGrid variant={variant}>
        {items.map((item, index) => (
          <CaseStudyCard key={index} {...item} variant={variant} />
        ))}
      </WorkGrid>
    </div>
  );
}

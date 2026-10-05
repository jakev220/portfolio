"use client";

import { useState, useSyncExternalStore } from "react";
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

const MD_UP = "(min-width: 768px)";

function subscribeMdUp(onChange: () => void) {
  const mq = window.matchMedia(MD_UP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    () => window.matchMedia(MD_UP).matches,
    () => false,
  );
}

/**
 * Home-page work section. Mobile (`< md`): always card grid, no toggle.
 * Tablet and up: toggle + user-selected view (default stack).
 */
export function WorkSection({ items }: WorkSectionProps) {
  const isMdUp = useIsMdUp();
  const [desktopVariant, setDesktopVariant] =
    useState<CaseStudyCardVariant>("stack");

  // Viewport wins on mobile so a desktop stack choice can’t stick after resize.
  const variant: CaseStudyCardVariant = isMdUp ? desktopVariant : "card";

  return (
    <section aria-label="Selected work" className="relative">
      {/* Sit in the hero’s lower empty space so cards can peek at the fold;
          in-flow placement + grid pt ate the entire ~10% peek. */}
      <div className="absolute bottom-full right-0 mb-12 hidden justify-end md:flex md:mb-16">
        <WorkViewToggle
          value={desktopVariant}
          onChange={setDesktopVariant}
        />
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

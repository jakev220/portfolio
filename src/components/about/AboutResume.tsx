import type { MouseEvent } from "react";
import {
  AboutExperience,
  type AboutExperiencePreview,
} from "@/components/about/AboutExperience";
import { AboutSection } from "@/components/about/AboutSection";
import type { AboutResumeSection } from "@/content/about";

export interface AboutResumeProps {
  sections: AboutResumeSection[];
  onPreviewEnter?: (
    event: MouseEvent,
    preview: AboutExperiencePreview,
  ) => void;
  onPreviewMove?: (event: MouseEvent) => void;
  onPreviewLeave?: () => void;
}

/**
 * Education / Experience / Communities stack. 64px between sections.
 * Sits in the About right rail (7 of 12 cols), matching prose width.
 */
export function AboutResume({
  sections,
  onPreviewEnter,
  onPreviewMove,
  onPreviewLeave,
}: AboutResumeProps) {
  return (
    <div className="flex min-w-0 flex-col gap-16">
      {sections.map((section) => (
        <AboutSection key={section.title} title={section.title}>
          {section.entries.map((entry) => (
            <AboutExperience
              key={`${entry.organization}-${entry.duration}`}
              organization={entry.organization}
              position={entry.position}
              duration={entry.duration}
              detail={entry.detail}
              preview={
                entry.preview
                  ? {
                      src: entry.preview,
                      alt: entry.previewAlt ?? entry.organization,
                      fit: entry.previewFit,
                      unoptimized: entry.previewUnoptimized,
                    }
                  : undefined
              }
              onPreviewEnter={onPreviewEnter}
              onPreviewMove={onPreviewMove}
              onPreviewLeave={onPreviewLeave}
            />
          ))}
        </AboutSection>
      ))}
    </div>
  );
}

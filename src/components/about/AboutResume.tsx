import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutSection } from "@/components/about/AboutSection";
import type { AboutResumeSection } from "@/content/about";

export interface AboutResumeProps {
  sections: AboutResumeSection[];
}

/**
 * Education / Experience / Communities stack. 64px between sections.
 * Sits in the About right rail (7 of 12 cols), matching prose width.
 */
export function AboutResume({ sections }: AboutResumeProps) {
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
            />
          ))}
        </AboutSection>
      ))}
    </div>
  );
}

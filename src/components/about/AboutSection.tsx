import type { ReactNode } from "react";

export interface AboutSectionProps {
  /** Section label, e.g. "Education", "Experience". */
  title: string;
  /** Typically a list of `<AboutExperience>` rows. */
  children: ReactNode;
}

/**
 * Titled group of About resume rows. Title sits 16px above the entries;
 * entries stack at 32px.
 */
export function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <h3 className="text-h3 m-0 text-secondary">{title}</h3>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

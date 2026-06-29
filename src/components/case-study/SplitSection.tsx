import type { ReactNode } from "react";

export interface SplitSectionProps {
  /** Eyebrow / section label shown above the split (e.g. "Research foundation"). */
  label?: string;
  /** Left-column heading — the section's main statement or question. */
  heading: string;
  /** Right-column body content (one or more blocks). */
  children: ReactNode;
}

/**
 * Case-study "split section with header". A full-width eyebrow label, then a
 * two-column row: a fixed-width heading on the left and a flexible body column
 * on the right. Matches the Figma spec at 1024px (400 + 64 gap + 560) and
 * stacks vertically below `md`.
 *
 * Spacing uses Tailwind defaults as placeholders (8 / 64 / 16 → gap-2 / gap-16
 * / gap-4); the 400px left column is fixed per the spec — tokenize later. The
 * heading spans the full column width.
 */
export function SplitSection({ label, heading, children }: SplitSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      {label ? <p className="text-label text-secondary">{label}</p> : null}
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <h2 className="text-h2 text-heading md:w-[400px] md:flex-none">
          {heading}
        </h2>
        <div className="flex flex-1 flex-col gap-4 text-body">{children}</div>
      </div>
    </section>
  );
}

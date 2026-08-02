import type { ReactNode } from "react";

export interface SectionLeadProps {
  /** Eyebrow label — full width above the lead. Omit for a lead-only block. */
  label?: string;
  /**
   * Wide lead headline. Renders at h2 scale and spans 8 of 12 columns at lg+.
   * Omit for a label-only opener (e.g. "Solution" before feature chapters).
   */
  children?: ReactNode;
}

/**
 * Case-study section opener: optional full-width eyebrow + optional 8-column
 * lead headline.
 *
 * When both label and lead are present, the parent `Section` gap (64px at lg)
 * lands below the whole block. Label-only leads mark `data-section-eyebrow` so
 * `Section` can pull the next child up (e.g. "Solution" → feature chapter
 * title) to the same 8px label→heading rhythm as label→lead.
 */
export function SectionLead({ label, children }: SectionLeadProps) {
  if (!label && !children) return null;

  const labelOnly = Boolean(label && !children);

  return (
    <div
      className="flex flex-col gap-2"
      {...(labelOnly ? { "data-section-eyebrow": "" } : {})}
    >
      {label ? <p className="text-label text-secondary m-0">{label}</p> : null}
      {children ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
          <div className="text-h2 text-heading m-0 lg:col-span-8 [&_em]:italic [&_p]:m-0 [&_p]:text-h2 [&_p]:leading-[inherit] [&_p]:text-heading [&_strong]:font-bold">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export interface AboutExperienceProps {
  /** Organization or company name. */
  organization: string;
  /** Role, degree, or title. */
  position: string;
  /** Date range, e.g. "Jun 2025 – Present". */
  duration: string;
  /** Optional muted italic line under the position (e.g. a minor). */
  detail?: string;
}

/**
 * One resume row: organization + position (+ optional detail) on the left,
 * duration right-aligned. Text-only — logos are not in this pass.
 */
export function AboutExperience({
  organization,
  position,
  duration,
  detail,
}: AboutExperienceProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-body-large text-heading m-0">{organization}</p>
        <p className="text-body m-0">{position}</p>
        {detail ? (
          <p className="text-body m-0 italic text-secondary">{detail}</p>
        ) : null}
      </div>
      <p className="text-caption m-0 shrink-0 text-secondary sm:pt-0.5 sm:text-right">
        {duration}
      </p>
    </div>
  );
}

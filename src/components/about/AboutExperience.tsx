import type { MouseEvent } from "react";

export interface AboutExperiencePreview {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  unoptimized?: boolean;
}

export interface AboutExperienceProps {
  /** Organization or company name. */
  organization: string;
  /** Role, degree, or title. */
  position: string;
  /** Date range, e.g. "Jun 2025 – Present". */
  duration: string;
  /** Optional muted italic line under the position (e.g. a minor). */
  detail?: string;
  /** Optional left-rail still; enables fine-pointer hover tracking. */
  preview?: AboutExperiencePreview;
  onPreviewEnter?: (
    event: MouseEvent,
    preview: AboutExperiencePreview,
  ) => void;
  onPreviewMove?: (event: MouseEvent) => void;
  onPreviewLeave?: () => void;
}

/**
 * One resume row: organization + position (+ optional detail) on the left,
 * duration right-aligned. Optional `preview` drives the Journey left-rail
 * cursor-follow still on fine-pointer desktop.
 */
export function AboutExperience({
  organization,
  position,
  duration,
  detail,
  preview,
  onPreviewEnter,
  onPreviewMove,
  onPreviewLeave,
}: AboutExperienceProps) {
  const interactive = Boolean(preview);

  return (
    <div
      className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
      onMouseEnter={
        interactive && preview && onPreviewEnter
          ? (event) => onPreviewEnter(event, preview)
          : undefined
      }
      onMouseMove={interactive ? onPreviewMove : undefined}
      onMouseLeave={interactive ? onPreviewLeave : undefined}
    >
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

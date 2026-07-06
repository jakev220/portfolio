import type { ReactNode } from "react";

export interface CalloutMetricProps {
  /** Primary stat (e.g. "+84%", "4.7 / 7"). */
  value: string;
  /** Supporting description beneath the value. */
  label: string;
}

export interface CalloutMetricsProps {
  children: ReactNode;
}

/**
 * One metric cell: vertical accent bar, large value, and a subtle description.
 * Intended as a child of `<CalloutMetrics>`.
 */
export function CalloutMetric({ value, label }: CalloutMetricProps) {
  return (
    <div className="flex gap-2">
      <div
        aria-hidden
        className="w-1 shrink-0 self-stretch rounded-full bg-callout-surface"
      />
      <div className="flex min-w-0 flex-col gap-1 py-4 pl-2">
        <p className="text-callout-title m-0 text-callout">{value}</p>
        <p className="text-callout-body m-0 text-callout-subtle">{label}</p>
      </div>
    </div>
  );
}

/**
 * Responsive 2-column grid for metric cells inside a `<Callout>`. Stacks to a
 * single column below md; 32px gutter matches the Figma spec.
 */
export function CalloutMetrics({ children }: CalloutMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>
  );
}

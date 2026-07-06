import type { ReactNode } from "react";

export interface CalloutAsideProps {
  /** Eyebrow label (e.g. "Research → Strategy"). */
  label: string;
  children: ReactNode;
}

/**
 * Nested insight card inside a `<Callout>`. Dark surface, subtle border, and
 * callout-scoped typography — intended for short supporting copy beside charts
 * or other visuals.
 */
export function CalloutAside({ label, children }: CalloutAsideProps) {
  return (
    <div className="flex flex-col rounded-xl border border-callout-border bg-[var(--color-callout-surface)] p-4">
      <p className="text-label m-0 text-callout-subtle">{label}</p>
      <div className="text-callout-body m-0 text-callout [&>*:first-child]:mt-1 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

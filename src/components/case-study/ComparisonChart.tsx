"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface ChartBar {
  label: string;
  value: number;
  /** `primary` = filled dark bar; `secondary` = muted bar. */
  variant: "primary" | "secondary";
}

export interface ChartGroup {
  title: string;
  /** Domain max used to scale bar widths. */
  max: number;
  rows: ChartBar[];
}

export interface ComparisonChartProps {
  groups: ChartGroup[];
  /** Legend labels, in primary → secondary order. */
  legend?: [string, string];
}

function AnimatedBar({
  value,
  max,
  variant,
  delay,
  reduceMotion,
}: {
  value: number;
  max: number;
  variant: "primary" | "secondary";
  delay: number;
  reduceMotion: boolean | null;
}) {
  const widthPercent = Math.min((value / max) * 100, 100);
  const barClass = `h-4 max-w-full rounded-full ${
    variant === "primary" ? "bg-primary" : "bg-secondary"
  }`;

  if (reduceMotion) {
    return (
      <div className={barClass} style={{ width: `${widthPercent}%` }} />
    );
  }

  return (
    <motion.div
      className={barClass}
      initial={{ width: 0 }}
      whileInView={{ width: `${widthPercent}%` }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    />
  );
}

/**
 * Light comparison bar chart for case-study research sections. Data is passed
 * as props so the same component can be reused; ScienceJury hardcodes its
 * formative numbers at the call site in MDX via a thin wrapper if needed.
 *
 * NOTE: `next-mdx-remote/rsc` drops JSX expression attributes — complex `groups`
 * data should live in a small case-specific wrapper component, not raw MDX.
 */
export function ComparisonChart({
  groups,
  legend = ["Multi-agent", "Single-agent"],
}: ComparisonChartProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div className="flex flex-wrap gap-6 sm:gap-8">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-4 shrink-0 rounded-full bg-primary"
          />
          <span className="text-body text-heading">{legend[0]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-4 shrink-0 rounded-full bg-secondary"
          />
          <span className="text-body text-heading">{legend[1]}</span>
        </div>
      </div>

      <div className="flex flex-col gap-10 sm:gap-12 lg:gap-16">
        {groups.map((group, groupIndex) => (
          <div key={group.title} className="flex min-w-0 flex-col gap-4">
            <p className="text-body m-0 text-secondary">{group.title}</p>
            <div className="flex flex-col gap-3">
              {group.rows.map((row, rowIndex) => (
                <div
                  key={row.label}
                  className="flex min-w-0 items-center gap-3 sm:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <AnimatedBar
                      value={row.value}
                      max={group.max}
                      variant={row.variant}
                      delay={groupIndex * 0.15 + rowIndex * 0.1}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                  <span
                    className={`shrink-0 text-body ${
                      row.variant === "primary"
                        ? "text-heading"
                        : "text-secondary"
                    }`}
                  >
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

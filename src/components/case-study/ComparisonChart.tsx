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

/**
 * Light comparison bar chart for case-study research sections. Data is passed
 * as props so the same component can be reused; ScienceJury hardcodes its
 * formative numbers at the call site in MDX via a thin wrapper if needed.
 *
 * Each value label sits `gap-6` (24px) from the end of its bar — not from the
 * trailing edge of a full-width track. Bars use flex-basis % of the row and
 * may shrink so labels stay in view on narrow viewports.
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
      <div className="flex flex-wrap gap-4 sm:gap-8">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-3.5 shrink-0 rounded-full bg-primary sm:size-4"
          />
          <span className="text-caption text-heading sm:text-body">
            {legend[0]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-3.5 shrink-0 rounded-full bg-secondary sm:size-4"
          />
          <span className="text-caption text-heading sm:text-body">
            {legend[1]}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-10 sm:gap-12 lg:gap-16">
        {groups.map((group, groupIndex) => (
          <div key={group.title} className="flex min-w-0 flex-col gap-4">
            <p className="text-caption m-0 text-secondary sm:text-body">
              {group.title}
            </p>
            <div className="flex flex-col gap-3">
              {group.rows.map((row, rowIndex) => {
                const widthPercent = Math.min((row.value / group.max) * 100, 100);
                const delay = groupIndex * 0.15 + rowIndex * 0.1;
                const barClass = `h-3 min-w-0 rounded-full sm:h-4 ${
                  row.variant === "primary" ? "bg-primary" : "bg-secondary"
                }`;

                return (
                  <div
                    key={row.label}
                    className="flex min-w-0 items-center gap-6"
                  >
                    {reduceMotion ? (
                      <div
                        className={barClass}
                        style={{
                          flex: `0 1 ${widthPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      />
                    ) : (
                      <motion.div
                        className={barClass}
                        initial={{ flexBasis: 0, width: 0 }}
                        whileInView={{
                          flexBasis: `${widthPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{
                          duration: 0.65,
                          ease: "easeOut",
                          delay,
                        }}
                        style={{ flexGrow: 0, flexShrink: 1 }}
                      />
                    )}
                    <span
                      className={`shrink-0 text-caption sm:text-body ${
                        row.variant === "primary"
                          ? "text-heading"
                          : "text-secondary"
                      }`}
                    >
                      {row.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

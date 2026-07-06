"use client";

import { motion } from "framer-motion";
import { Callout, CalloutHeading } from "@/components/case-study/Callout";
import { CalloutAside } from "@/components/case-study/CalloutAside";

interface BarRowData {
  label: string;
  value: number;
  variant: "primary" | "secondary";
}

interface ChartGroupData {
  title: string;
  max: number;
  rows: BarRowData[];
  delayOffset: number;
}

const alignmentChart: ChartGroupData = {
  title: "Human alignment (by cosine similarity)",
  max: 0.6,
  delayOffset: 0,
  rows: [
    { label: "Multi-agent: 0.45", value: 0.45, variant: "primary" },
    { label: "Single-agent: 0.38", value: 0.38, variant: "secondary" },
  ],
};

const coverageChart: ChartGroupData = {
  title: "Issue coverage (average % per paper)",
  max: 50,
  delayOffset: 0.2,
  rows: [
    { label: "Multi-agent: 33.4%", value: 33.4, variant: "primary" },
    { label: "Single-agent: 18.2%", value: 18.2, variant: "secondary" },
  ],
};

const MAX_BAR_REM = 27;

function AnimatedBar({
  value,
  max,
  variant,
  delay,
}: {
  value: number;
  max: number;
  variant: "primary" | "secondary";
  delay: number;
}) {
  const widthRem = Math.min((value / max) * MAX_BAR_REM, MAX_BAR_REM);

  return (
    <motion.div
      className={`h-4 shrink-0 rounded-full ${
        variant === "primary"
          ? "bg-[var(--color-callout-text)]"
          : "bg-callout-border"
      }`}
      initial={{ width: 0 }}
      whileInView={{ width: `min(${widthRem}rem, 75vw)` }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    />
  );
}

function ChartRow({
  row,
  max,
  delay,
}: {
  row: BarRowData;
  max: number;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <AnimatedBar
        value={row.value}
        max={max}
        variant={row.variant}
        delay={delay}
      />
      <span
        className={`shrink-0 text-callout-body ${
          row.variant === "primary" ? "text-callout" : "text-callout-muted"
        }`}
      >
        {row.label}
      </span>
    </div>
  );
}

function ChartGroup({ title, max, rows, delayOffset }: ChartGroupData) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-callout-body m-0 text-callout-subtle">{title}</p>
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <ChartRow
            key={row.label}
            row={row}
            max={max}
            delay={delayOffset + index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * ScienceJury formative-study callout: headline, animated comparison bars, and
 * a strategy aside. Case-specific — data and copy are hardcoded for this study.
 */
export function ScienceJuryFormativeCallout() {
  return (
    <Callout>
      <CalloutHeading size="heading">
        The multi-agent approach identified nearly{" "}
        <span className="font-bold">twice</span> the unique issues that are more
        closely reflective of what human experts flagged.
      </CalloutHeading>

      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <ChartGroup {...alignmentChart} />
          <ChartGroup {...coverageChart} />
        </div>

        <div className="md:max-w-[302px] md:flex-1">
          <CalloutAside label="Research → Strategy">
            More feedback volume requires more design investment in how it&apos;s
            organized and surfaced.
          </CalloutAside>
        </div>
      </div>
    </Callout>
  );
}

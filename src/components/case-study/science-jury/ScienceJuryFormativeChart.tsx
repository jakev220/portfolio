import type { ChartGroup } from "@/components/case-study/ComparisonChart";
import { ComparisonChart } from "@/components/case-study/ComparisonChart";

const formativeGroups: ChartGroup[] = [
  {
    title: "Human alignment (by cosine similarity)",
    max: 0.6,
    rows: [
      { label: "Multi-agent: 0.45", value: 0.45, variant: "primary" },
      { label: "Single-agent: 0.38", value: 0.38, variant: "secondary" },
    ],
  },
  {
    title: "Unique issues covered (average % per paper)",
    max: 50,
    rows: [
      { label: "Multi-agent: 33.4%", value: 33.4, variant: "primary" },
      { label: "Single-agent: 18.2%", value: 18.2, variant: "secondary" },
    ],
  },
];

/**
 * ScienceJury formative-study chart. Data is hardcoded here because
 * `next-mdx-remote/rsc` drops JSX expression attributes — MDX can only pass
 * string props and children.
 */
export function ScienceJuryFormativeChart() {
  return <ComparisonChart groups={formativeGroups} />;
}

import type { CaseStudyCardProps } from "@/components/CaseStudyCard";

/** A work item = case-study card props minus the (toggle-controlled) variant. */
export type WorkPreviewItem = Omit<CaseStudyCardProps, "variant">;

/**
 * Placeholder work items for the home-page grid. Swap these for real,
 * MDX-driven content once the case studies are written. Cover images are left
 * empty so the cards fall back to the neutral surface placeholder.
 */
export const workPreview: WorkPreviewItem[] = [
  {
    name: "Northwind",
    affiliation: "Shopify",
    year: "2024",
    title: "Rebuilding checkout for speed and trust",
    description:
      "A ground-up redesign of the mobile checkout flow that cut completion time by 38% and lifted conversion across twelve markets.",
    href: "/work/northwind-checkout",
    linkLabel: "View case study",
    coverImage: "",
    coverAlt: "Rebuilding checkout for speed and trust",
  },
  {
    name: "Atlas",
    affiliation: "Linear",
    year: "2023",
    title: "A planning canvas for cross-functional teams",
    description:
      "An infinite canvas that connects roadmaps to the work itself, giving teams a shared place to plan, scope, and track delivery.",
    href: "/work/atlas-canvas",
    linkLabel: "View case study",
    coverImage: "",
    coverAlt: "A planning canvas for cross-functional teams",
  },
  {
    name: "Harbor",
    affiliation: "Mercury",
    year: "2023",
    title: "Bringing clarity to business banking",
    description:
      "Reframing dense financial data into a calm, glanceable dashboard so founders can understand their runway at a glance.",
    href: "/work/harbor-banking",
    linkLabel: "View case study",
    coverImage: "",
    coverAlt: "Bringing clarity to business banking",
  },
  {
    name: "Lumen",
    affiliation: "Figma",
    year: "2022",
    title: "Design tooling for motion and interaction",
    description:
      "A prototyping surface that lets designers express timing and easing directly on the canvas, no timeline panel required.",
    href: "/work/lumen-motion",
    linkLabel: "View case study",
    coverImage: "",
    coverAlt: "Design tooling for motion and interaction",
  },
];

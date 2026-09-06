import type { MDXComponents } from "mdx/types";
import { Section } from "@/components/case-study/Section";
import { SectionLead } from "@/components/case-study/SectionLead";
import { Split } from "@/components/case-study/Split";
import { MediaRow } from "@/components/case-study/MediaRow";
import { SplitHeading, RightProse, RightRail } from "@/components/case-study/SplitGrid";
import {
  Detail,
  DetailGroup,
  ProjectDetails,
} from "@/components/case-study/ProjectDetails";
import { Accent } from "@/components/case-study/Accent";
import { Subtle } from "@/components/case-study/Subtle";
import { Figure } from "@/components/case-study/Figure";
import { InsetFigure } from "@/components/case-study/InsetFigure";
import { Accordion } from "@/components/case-study/Accordion";
import { AccordionItem } from "@/components/case-study/AccordionItem";
import { FullBleedBanner } from "@/components/case-study/FullBleedBanner";
import {
  InsightCard,
  InsightCardGrid,
} from "@/components/case-study/InsightCard";
import { Metric, MetricRow } from "@/components/case-study/MetricRow";
import { FeatureChapter } from "@/components/case-study/FeatureChapter";
import {
  MediaCarousel,
  MediaCarouselSlide,
} from "@/components/case-study/MediaCarousel";
import {
  FlowDiagram,
  FlowDiagramTab,
  FlowDiagramImage,
} from "@/components/case-study/FlowDiagram";
import { ScienceJuryFormativeChart } from "@/components/case-study/science-jury/ScienceJuryFormativeChart";

/**
 * Maps MDX/Markdown elements to the portfolio design system (see tokens.ts).
 * Content (text) always comes from the MDX body — these only apply styling.
 *
 * Notes:
 * - Links get the accent color + underline. The trailing `↗` and internal/
 *   external handling are deferred to the future `Link` component.
 * - `code`/`pre` styling lives in `globals.css` under `.mdx-content` so it can
 *   distinguish inline code from highlighted code blocks (rehype-pretty-code).
 * - Capitalized keys expose case-study layout components for JSX in `.mdx`.
 */
export const mdxComponents: MDXComponents = {
  Section,
  SectionLead,
  Split,
  MediaRow,
  SplitHeading,
  RightProse,
  RightRail,
  ProjectDetails,
  Detail,
  DetailGroup,
  Accent,
  Subtle,
  Figure,
  InsetFigure,
  Accordion,
  AccordionItem,
  FullBleedBanner,
  InsightCard,
  InsightCardGrid,
  Metric,
  MetricRow,
  FeatureChapter,
  MediaCarousel,
  MediaCarouselSlide,
  FlowDiagram,
  FlowDiagramTab,
  FlowDiagramImage,
  ScienceJuryFormativeChart,
  h1: (props) => <h1 className="text-h1 text-primary mt-12 mb-4" {...props} />,
  h2: (props) => <h2 className="text-h2 text-heading mt-10 mb-3" {...props} />,
  h3: (props) => <h3 className="text-h3 text-heading mt-8 mb-2" {...props} />,
  p: (props) => <p className="text-body my-4" {...props} />,
  a: (props) => (
    <a
      className="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="text-body my-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props) => (
    <ol className="text-body my-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="text-secondary border-l-2 border-divider my-6 pl-4 italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-divider my-0" />,
  strong: (props) => <strong className="font-bold text-primary" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  // eslint-disable-next-line @next/next/no-img-element
  img: (props) => (
    // TODO: upgrade to a <Figure> (next/image + caption) component later.
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 h-auto w-full rounded-md" alt="" {...props} />
  ),
};

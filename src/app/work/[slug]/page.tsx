import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWorkSlugs, getWorkBySlug } from "@/lib/mdx";
import {
  caseStudyPaletteKeys,
  caseStudyPaletteStyle,
  type CaseStudyTone,
} from "@/lib/case-study-palette";
import { CaseStudyHeader } from "@/components/CaseStudyHeader";
import { CaseStudyToc } from "@/components/case-study/CaseStudyToc";
import { MDXContent } from "@/components/MDXContent";
import { MediaLightboxProvider } from "@/components/media-lightbox/MediaLightboxProvider";

/** Pre-render published case studies; drafts still resolve on-demand in dev. */
export function generateStaticParams() {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

function resolveSkipTone(value: string | undefined): CaseStudyTone | undefined {
  if (!value) return undefined;
  return (caseStudyPaletteKeys as readonly string[]).includes(value)
    ? (value as CaseStudyTone)
    : undefined;
}

/**
 * Drives the document `<title>` + meta description from the case study. The
 * descriptive `title` (and results `description`) carry the page's accessible
 * name / SEO summary, while the visible `<h1>` stays the short project name.
 */
export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: work.name,
    description: work.description || work.title,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  // NOTE: intentionally not gating on `work.published` yet so drafts are
  // previewable while writing. Add a `!work.published && notFound()` guard
  // here before launch.

  const paletteStyle = caseStudyPaletteStyle(slug);

  // Shares the home/About page shell: 12 columns with 16px gutters and 80px
  // outer margins at a 1440px viewport. Per-study `--cs-*` palette vars are
  // set when the slug has an entry in `caseStudyPalettes`. Header + body use
  // CSS fade/rise enters (same timing as the home hero); TOC stays outside
  // those wrappers so `position: fixed` isn’t affected by `transform`.
  return (
    <MediaLightboxProvider>
      <article
        data-case-study={slug}
        className="relative mx-auto max-w-7xl px-6 pb-16 pt-32 sm:pb-24 sm:pt-48 lg:pt-64"
        style={paletteStyle}
      >
        <CaseStudyToc />
        <div className="case-study-enter">
          <CaseStudyHeader
            name={work.name}
            title={work.title}
            coverImage={work.coverImage}
            skipLabel={work.skipLabel}
            skipHref={work.skipHref}
            skipTone={resolveSkipTone(work.skipTone)}
            skipPreview={work.skipPreview}
          />
        </div>
        <div className="case-study-body-enter mt-20">
          <MDXContent source={work.content} />
        </div>
      </article>
    </MediaLightboxProvider>
  );
}

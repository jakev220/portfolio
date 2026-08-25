import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWorkSlugs, getWorkBySlug } from "@/lib/mdx";
import { caseStudyPaletteStyle } from "@/lib/case-study-palette";
import { CaseStudyHeader } from "@/components/CaseStudyHeader";
import { MDXContent } from "@/components/MDXContent";
import { MediaLightboxProvider } from "@/components/media-lightbox/MediaLightboxProvider";

/** Pre-render published case studies; drafts still resolve on-demand in dev. */
export function generateStaticParams() {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
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
  // set when the slug has an entry in `caseStudyPalettes`.
  return (
    <MediaLightboxProvider>
      <article
        data-case-study={slug}
        className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:pb-24 sm:pt-48 lg:pt-64"
        style={paletteStyle}
      >
        <CaseStudyHeader
          name={work.name}
          title={work.title}
          coverImage={work.coverImage}
        />
        <div className="mt-16">
          <MDXContent source={work.content} />
        </div>
      </article>
    </MediaLightboxProvider>
  );
}

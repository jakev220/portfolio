import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWorkSlugs, getWorkBySlug } from "@/lib/mdx";
import { CaseStudyHeader } from "@/components/CaseStudyHeader";
import { MDXContent } from "@/components/MDXContent";

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

  // Container width matches the case-study Figma: 1024px content column with
  // 24px gutters (1072 - 2*24 = 1024 → ~208px margins at a 1440 viewport).
  return (
    <article className="mx-auto max-w-[1072px] px-6 pt-40 pb-24">
      <CaseStudyHeader
        name={work.name}
        title={work.title}
        coverImage={work.coverImage}
      />
      <div className="mt-16">
        <MDXContent source={work.content} />
      </div>
    </article>
  );
}

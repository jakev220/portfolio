import { notFound } from "next/navigation";
import { getWorkBySlug } from "@/lib/mdx";
import type { CaseStudyCardProps } from "@/components/CaseStudyCard";
import { WorkPreview } from "./WorkPreview";

// TEMPORARY preview route for CaseStudyCard / WorkGrid / WorkViewToggle.
// Safe to delete. Demonstrates the MDX-frontmatter → card-props flow. The extra
// preview fields (`name`, `affiliation`, `linkLabel`) are read via this local
// type until the real case-study frontmatter schema is finalized.
interface CardFrontmatter {
  name: string;
  affiliation?: string;
  year: string;
  title: string;
  description: string;
  linkLabel: string;
  coverImage?: string;
}

export default function CaseStudyPreviewPage() {
  const work = getWorkBySlug("_preview-stack");
  if (!work) notFound();

  const fm = work as unknown as CardFrontmatter;

  const base: Omit<CaseStudyCardProps, "variant" | "disabled"> = {
    name: fm.name,
    affiliation: fm.affiliation,
    year: fm.year,
    title: fm.title,
    description: fm.description,
    href: `/work/${work.slug}`,
    linkLabel: fm.linkLabel,
    coverImage: fm.coverImage || undefined,
    coverAlt: fm.title,
  };

  // Last item disabled to exercise the in-line disabled state.
  const items: Omit<CaseStudyCardProps, "variant">[] = [
    { ...base },
    { ...base },
    { ...base },
    { ...base, disabled: true },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <WorkPreview items={items} />
    </main>
  );
}

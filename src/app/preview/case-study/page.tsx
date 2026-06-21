import { notFound } from "next/navigation";
import { getWorkBySlug } from "@/lib/mdx";
import { CaseStudyCard, type CaseStudyCardVariant } from "@/components/CaseStudyCard";
import { WorkGrid } from "@/components/WorkGrid";

// TEMPORARY preview route for CaseStudyCard / WorkGrid. Safe to delete.
// Demonstrates the MDX-frontmatter → card-props flow. The extra preview fields
// (`name`, `affiliation`, `linkLabel`) are read via this local type until the
// real case-study frontmatter schema is finalized.
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

  const card = (variant: CaseStudyCardVariant, disabled = false) => (
    <CaseStudyCard
      name={fm.name}
      affiliation={fm.affiliation}
      year={fm.year}
      title={fm.title}
      description={fm.description}
      href={`/work/${work.slug}`}
      linkLabel={fm.linkLabel}
      coverImage={fm.coverImage || undefined}
      coverAlt={fm.title}
      variant={variant}
      disabled={disabled}
    />
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-16">
        <section>
          <p className="text-label text-secondary mb-6">Stack</p>
          <WorkGrid variant="stack">
            {card("stack")}
            {card("stack")}
          </WorkGrid>
        </section>

        <section>
          <p className="text-label text-secondary mb-6">Card</p>
          <WorkGrid variant="card">
            {card("card")}
            {card("card")}
            {card("card")}
            {card("card")}
          </WorkGrid>
        </section>

        <section>
          <p className="text-label text-secondary mb-6">
            In-line (hover a row on desktop; last row disabled)
          </p>
          <WorkGrid variant="inline">
            {card("inline")}
            {card("inline")}
            {card("inline")}
            {card("inline", true)}
          </WorkGrid>
        </section>
      </div>
    </main>
  );
}

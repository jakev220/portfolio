import { Hero } from "@/components/Hero";
import { hero } from "@/content/hero";
import { WorkSection } from "@/components/WorkSection";
import { getAllWork } from "@/lib/mdx";
import { HomeExitShell } from "@/components/HomeExitShell";

export default function HomePage() {
  // Work cards are driven by the published case-study MDX (sorted by `order`).
  const work = getAllWork().map((item) => ({
    name: item.name,
    affiliation: item.affiliation,
    year: item.year,
    title: item.title,
    description: item.description,
    href: `/work/${item.slug}`,
    linkLabel: item.linkLabel,
    coverImage: item.coverImage,
    coverAlt: item.title,
  }));

  // Desktop: ~90dvh (incl. nav clearance) so Work peeks ~10%.
  // Mobile/tablet: normal hero bottom padding — the 90dvh spacer is too tall.
  return (
    <main className="mx-auto w-full max-w-7xl px-6">
      <div className="flex flex-col pt-32 md:pt-48 lg:min-h-[90dvh] lg:pt-64">
        <Hero {...hero} />
      </div>
      <HomeExitShell>
        <WorkSection items={work} />
      </HomeExitShell>
    </main>
  );
}

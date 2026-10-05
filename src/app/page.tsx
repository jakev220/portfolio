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

  // Desktop: ~95dvh band so Work peeks ~5%. Equal flex spacers center the
  // hero in that band (nav is fixed, so no extra top bias). Mobile/tablet:
  // normal stacking — the 95dvh spacer is too tall.
  return (
    <main className="mx-auto w-full max-w-7xl px-6">
      <div className="flex flex-col pt-32 md:pt-48 lg:min-h-[95dvh] lg:pt-0">
        <div className="hidden lg:block lg:flex-1" aria-hidden />
        <Hero {...hero} />
        <div className="hidden lg:block lg:flex-1" aria-hidden />
      </div>
      <HomeExitShell>
        <WorkSection items={work} />
      </HomeExitShell>
    </main>
  );
}

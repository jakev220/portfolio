import { Hero } from "@/components/Hero";
import { hero } from "@/content/hero";
import { WorkSection } from "@/components/WorkSection";
import { getAllWork } from "@/lib/mdx";
import { Footer } from "@/components/Footer";
import { footer } from "@/content/footer";
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

  // Top padding (pt-64 ≈ 258px) is a Tailwind-default placeholder for the
  // hero's offset from the top of the page; refine with custom spacing later.
  // The hero, toggle, and grid stack with no extra gap — each section owns its
  // own padding.
  return (
    <>
      <main className="mx-auto max-w-7xl px-6 pt-64">
        <Hero {...hero} />
        <HomeExitShell>
          <WorkSection items={work} />
        </HomeExitShell>
      </main>
      <HomeExitShell>
        <Footer {...footer} />
      </HomeExitShell>
    </>
  );
}

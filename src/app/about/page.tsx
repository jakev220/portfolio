import type { Metadata } from "next";
import { about } from "@/content/about";
import { keepExploring, keepExploringPair } from "@/content/keep-exploring";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProse } from "@/components/about/AboutProse";
import { AboutJourney } from "@/components/about/AboutJourney";
import { HangStatement } from "@/components/HangStatement";
import { KeepExploring } from "@/components/case-study/KeepExploring";

export const metadata: Metadata = {
  title: "About",
  description: about.lede.body,
};

const [biography, ...restBlocks] = about.blocks;

/**
 * About page v3 — home-page shell (`max-w-7xl` → ~80px side margins at 1440)
 * with a 12-col / 16px-gap content system. Sections stack at 160px.
 */
export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-7xl px-6 pb-24">
      {/* Desktop: 90dvh peek of the lede. Mobile/tablet: token bottom padding. */}
      <div className="flex flex-col pt-32 pb-32 md:pt-48 md:pb-48 lg:min-h-[90dvh] lg:pt-64 lg:pb-0">
        <AboutHero greeting={about.greeting} photos={about.heroPhotos} />
      </div>

      <div className="flex flex-col gap-40">
        <HangStatement
          label={about.lede.label}
          body={about.lede.body}
          className="about-lede-enter"
        />

        {biography ? (
          <AboutProse
            heading={biography.heading}
            body={biography.body}
            photos={biography.photos}
            gallery={biography.gallery}
          />
        ) : null}

        <AboutJourney heading={about.resumeHeading} sections={about.resume} />

        {restBlocks.map((block) => (
          <AboutProse
            key={block.heading}
            heading={block.heading}
            body={block.body}
            photos={block.photos}
            gallery={block.gallery}
          />
        ))}

        <KeepExploring
          heading={keepExploring.heading}
          tiles={keepExploringPair("about")}
        />
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import { about } from "@/content/about";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProse } from "@/components/about/AboutProse";
import { AboutResume } from "@/components/about/AboutResume";
import { HangStatement } from "@/components/HangStatement";

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
    <article className="mx-auto max-w-7xl px-6 pt-64 pb-24">
      <div className="flex flex-col gap-40">
        <AboutHero greeting={about.greeting} photos={about.heroPhotos} />
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-4">
          <h2 className="text-h2 text-primary m-0 min-w-0 lg:col-span-4">
            {about.resumeHeading}
          </h2>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <AboutResume sections={about.resume} />
          </div>
        </div>

        {restBlocks.map((block) => (
          <AboutProse
            key={block.heading}
            heading={block.heading}
            body={block.body}
            photos={block.photos}
            gallery={block.gallery}
          />
        ))}
      </div>
    </article>
  );
}

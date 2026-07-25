import type { Metadata } from "next";
import { about } from "@/content/about";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutLede } from "@/components/about/AboutLede";
import { AboutProse } from "@/components/about/AboutProse";

export const metadata: Metadata = {
  title: "About",
  description: about.lede.body,
};

/**
 * About page v3 — home-page shell (`max-w-7xl` → ~80px side margins at 1440)
 * with a 12-col / 16px-gap content system. Sections stack at 160px.
 */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-7xl px-6 pt-64 pb-24">
      <div className="flex flex-col gap-40">
        <AboutHero greeting={about.greeting} photos={about.heroPhotos} />
        <AboutLede label={about.lede.label} body={about.lede.body} />

        {about.blocks.map((block) => (
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

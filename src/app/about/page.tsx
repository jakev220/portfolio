import type { Metadata } from "next";
import { about } from "@/content/about";
import { AboutHeader } from "@/components/about/AboutHeader";
import { AboutPhotoGrid } from "@/components/about/AboutPhotoGrid";
import { AboutProse } from "@/components/about/AboutProse";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
};

/**
 * About page — same 1024px content column + gutters as case studies
 * (`max-w-[1072px] px-6`, `pt-64`). Header + typed `blocks` stack with 128px
 * rhythm; content lives in `content/about.ts`.
 */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[1072px] px-6 pt-64 pb-24">
      <AboutHeader intro={about.intro} photos={about.photos} />

      <div className="mt-32 flex flex-col gap-32">
        {about.blocks.map((block, index) => {
          switch (block.type) {
            case "prose":
              return (
                <AboutProse
                  key={block.heading}
                  heading={block.heading}
                  body={block.body}
                />
              );
            case "lifestyle":
              return (
                <AboutPhotoGrid
                  key={`lifestyle-${index}`}
                  photos={block.photos}
                />
              );
            default: {
              const _exhaustive: never = block;
              return _exhaustive;
            }
          }
        })}
      </div>
    </article>
  );
}

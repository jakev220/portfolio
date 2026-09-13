import type { Metadata } from "next";
import { archive } from "@/content/archive";
import { ArchiveMosaic } from "@/components/archive/ArchiveMosaic";

export const metadata: Metadata = {
  title: archive.title,
  description: archive.description,
};

/**
 * Archive — mosaic gallery for prototypes and explorations that don’t need a
 * full case study. Copy and tiles live in {@link archive}.
 */
export default function ArchivePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-64 pb-24">
      <div className="flex flex-col gap-40">
        <header className="flex max-w-3xl flex-col gap-4">
          <h2 className="text-h2 text-heading m-0">{archive.title}</h2>
          <h3 className="text-h3 text-secondary m-0 font-normal">
            {archive.description}
          </h3>
        </header>

        <ArchiveMosaic items={archive.items} />
      </div>
    </main>
  );
}

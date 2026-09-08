import { ExploreTile } from "@/components/case-study/ExploreTile";

export interface KeepExploringTile {
  label: string;
  href: string;
  images: string[];
}

export interface KeepExploringNext {
  label: string;
  href?: string;
  /** Cover still; omit for a surface placeholder. */
  image?: string;
}

export interface KeepExploringProps {
  heading: string;
  about: KeepExploringTile;
  play: KeepExploringTile;
  next: KeepExploringNext;
}

/**
 * Case-study end collage: About + Play stacked on a 4-col rail, next project
 * spanning 8 cols / both rows. Gutters match case-study rows (`gap-4`).
 */
export function KeepExploring({
  heading,
  about,
  play,
  next,
}: KeepExploringProps) {
  return (
    <section
      className="flex flex-col gap-6 sm:gap-8"
      aria-labelledby="keep-exploring-heading"
    >
      <h2
        id="keep-exploring-heading"
        className="text-h2 text-heading m-0"
      >
        {heading}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2">
        <ExploreTile
          label={about.label}
          href={about.href}
          images={about.images}
          className="aspect-[5/3] lg:col-span-4"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <ExploreTile
          label={play.label}
          href={play.href}
          images={play.images}
          className="aspect-[5/3] lg:col-span-4 lg:row-start-2"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <ExploreTile
          label={next.label}
          href={next.href}
          images={next.image ? [next.image] : []}
          className="aspect-[5/3] lg:col-span-8 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-0"
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
      </div>
    </section>
  );
}

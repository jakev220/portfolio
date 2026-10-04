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

export interface KeepExploringCollageProps {
  heading: string;
  /** Case-study collage: About + Archive stacked, next project spanning. */
  about: KeepExploringTile;
  archive: KeepExploringTile;
  next: KeepExploringNext;
  /** Ignored when collage props are set — use {@link KeepExploringPairProps}. */
  tiles?: never;
}

export interface KeepExploringPairProps {
  heading: string;
  /** Equal two-column tiles (About / Archive pages). */
  tiles: KeepExploringTile[];
  about?: never;
  archive?: never;
  next?: never;
}

export type KeepExploringProps = KeepExploringCollageProps | KeepExploringPairProps;

function PairGrid({
  heading,
  tiles,
}: {
  heading: string;
  tiles: KeepExploringTile[];
}) {
  return (
    <section
      className="flex flex-col gap-6 sm:gap-8"
      aria-labelledby="keep-exploring-heading"
    >
      <h2 id="keep-exploring-heading" className="text-h2 text-heading m-0">
        {heading}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tiles.map((tile) => (
          <ExploreTile
            key={tile.href}
            label={tile.label}
            href={tile.href}
            images={tile.images}
            className="aspect-[5/3]"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ))}
      </div>
    </section>
  );
}

/**
 * End-of-page collage. Case studies use About + Archive + next project;
 * About / Archive pass `tiles` for an equal two-column pair.
 */
export function KeepExploring(props: KeepExploringProps) {
  if ("tiles" in props && props.tiles) {
    return <PairGrid heading={props.heading} tiles={props.tiles} />;
  }

  const { heading, about, archive, next } = props as KeepExploringCollageProps;

  return (
    <section
      className="flex flex-col gap-6 sm:gap-8"
      aria-labelledby="keep-exploring-heading"
    >
      <h2 id="keep-exploring-heading" className="text-h2 text-heading m-0">
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
          label={archive.label}
          href={archive.href}
          images={archive.images}
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

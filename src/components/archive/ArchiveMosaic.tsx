import type { CSSProperties, ReactNode } from "react";
import { ArchiveCarouselTile } from "@/components/archive/ArchiveCarouselTile";
import { ArchiveCycleTile } from "@/components/archive/ArchiveCycleTile";
import { ArchiveVideoTile } from "@/components/archive/ArchiveVideoTile";
import { Icon } from "@/components/Icon";
import { SmartImage } from "@/components/SmartImage";
import {
  archiveMediaKind,
  type ArchiveItem,
} from "@/content/archive";
import { externalLinkProps, isExternalHref } from "@/lib/links";

export interface ArchiveMosaicProps {
  items: ArchiveItem[];
}

/** Parse `"W / H"` → width/height. */
function aspectValue(aspect?: string): number | null {
  if (!aspect) return null;
  const parts = aspect.split("/").map((part) => Number.parseFloat(part.trim()));
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return parts[0] / parts[1];
}

/** Relative tile height assuming column width = 1. */
function estimateHeight(item: ArchiveItem): number {
  const gap = 0.04;

  if (item.stack && item.stack.length > 0) {
    return item.stack.reduce((sum, entry, index) => {
      const ratio =
        aspectValue(entry.aspect) ??
        (/\.(mp4|webm)$/i.test(entry.src) ? 16 / 9 : 3 / 4);
      return sum + 1 / ratio + (index > 0 ? gap : 0);
    }, 0);
  }

  const ratio =
    aspectValue(item.aspect) ??
    (item.frames || item.slides
      ? 1
      : item.src && /\.(mp4|webm)$/i.test(item.src)
        ? 16 / 9
        : 3 / 4);
  return 1 / ratio;
}

/**
 * Greedy masonry: each item (including stacked pairs as one unit) goes into
 * the current shortest column so heights stay balanced and pairs stay together.
 * `packAfter` pins a tile into the same column as an earlier item.
 */
function packColumns(items: ArchiveItem[], count: number): ArchiveItem[][] {
  const columns: ArchiveItem[][] = Array.from({ length: count }, () => []);
  const heights = Array.from({ length: count }, () => 0);
  const columnOf = new Map<string, number>();

  for (const item of items) {
    let target = 0;
    const anchor =
      item.packAfter != null ? columnOf.get(item.packAfter) : undefined;
    if (anchor !== undefined) {
      target = anchor;
    } else {
      for (let i = 1; i < count; i++) {
        if (heights[i] < heights[target]) target = i;
      }
    }
    columns[target].push(item);
    columnOf.set(item.id, target);
    heights[target] += estimateHeight(item) + 0.04;
  }

  return columns;
}

function TileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {children}
    </div>
  );
}

function StackStill({
  src,
  alt,
  aspect,
}: {
  src: string;
  alt: string;
  aspect?: string;
}) {
  const cropped = Boolean(aspect);
  if (cropped) {
    return (
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        <SmartImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
    );
  }
  return (
    <SmartImage
      src={src}
      alt={alt}
      width={800}
      height={1000}
      className="h-auto w-full"
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    />
  );
}

function ArchiveMedia({ item }: { item: ArchiveItem }) {
  if (item.stack && item.stack.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {item.stack.map((entry) => {
          const isVideo = /\.(mp4|webm)$/i.test(entry.src);
          return (
            <div
              key={entry.src}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              {isVideo ? (
                <ArchiveVideoTile
                  src={entry.src}
                  alt={entry.alt ?? ""}
                  aspect={entry.aspect}
                  loopDelayMs={entry.loopDelayMs}
                  playbackRate={entry.playbackRate}
                />
              ) : (
                <StackStill
                  src={entry.src}
                  alt={entry.alt ?? ""}
                  aspect={entry.aspect}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (item.slides && item.slides.length > 0) {
    return (
      <ArchiveCarouselTile
        slides={item.slides}
        label={item.alt ?? "Archive carousel"}
        aspect={item.aspect}
      />
    );
  }

  if (item.frames && item.frames.length > 0) {
    return (
      <ArchiveCycleTile
        frames={item.frames}
        alt={item.alt ?? ""}
        aspect={item.aspect}
        fit={item.fit}
      />
    );
  }

  const kind = archiveMediaKind(item);

  if (kind === "video" && item.src) {
    return (
      <ArchiveVideoTile
        src={item.src}
        alt={item.alt ?? ""}
        aspect={item.aspect}
        loopDelayMs={item.loopDelayMs}
        playbackRate={item.playbackRate}
      />
    );
  }

  const cropped = Boolean(item.aspect && item.src);
  const frameStyle: CSSProperties | undefined = item.aspect
    ? { aspectRatio: item.aspect }
    : undefined;

  let media: ReactNode = (
    <div className="aspect-[3/4] w-full" aria-hidden />
  );

  if (kind === "image" && item.src) {
    media = cropped ? (
      <SmartImage
        src={item.src}
        alt={item.alt ?? ""}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
    ) : (
      <SmartImage
        src={item.src}
        alt={item.alt ?? ""}
        width={800}
        height={1000}
        className="h-auto w-full"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
    );
  }

  if (cropped) {
    return (
      <div className="relative w-full" style={frameStyle}>
        {media}
      </div>
    );
  }

  return media;
}

function ArchiveTile({ item }: { item: ArchiveItem }) {
  if (item.stack && item.stack.length > 0) {
    return <ArchiveMedia item={item} />;
  }

  const media = <ArchiveMedia item={item} />;

  if (item.href) {
    const external = isExternalHref(item.href);
    return (
      <TileFrame>
        <a
          href={item.href}
          className="group relative block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          {...externalLinkProps(item.href)}
        >
          {media}
          {external ? (
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-border bg-lightbox-panel p-2 text-primary opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-4 sm:top-4"
            >
              <Icon name="arrow-up-right" size={20} />
            </span>
          ) : null}
        </a>
      </TileFrame>
    );
  }

  return <TileFrame>{media}</TileFrame>;
}

function MosaicColumns({
  columns,
}: {
  columns: ArchiveItem[][];
}) {
  return (
    <div
      className={`grid items-start gap-4 ${
        columns.length === 1
          ? "grid-cols-1"
          : columns.length === 2
            ? "grid-cols-2"
            : "grid-cols-3"
      }`}
    >
      {columns.map((column, index) => (
        <div key={index} className="flex min-w-0 flex-col gap-4">
          {column.map((item) => (
            <ArchiveTile key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Archive mosaic: packs tiles into balanced columns (pairs via `stack` stay
 * in the same column). Uses explicit column packing instead of CSS `columns`
 * so tall pairs don’t leave an empty lane at the bottom.
 */
export function ArchiveMosaic({ items }: ArchiveMosaicProps) {
  const one = packColumns(items, 1);
  const two = packColumns(items, 2);
  const three = packColumns(items, 3);

  return (
    <>
      <div className="sm:hidden">
        <MosaicColumns columns={one} />
      </div>
      <div className="hidden sm:block lg:hidden">
        <MosaicColumns columns={two} />
      </div>
      <div className="hidden lg:block">
        <MosaicColumns columns={three} />
      </div>
    </>
  );
}

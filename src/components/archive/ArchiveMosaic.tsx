import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArchiveCarouselTile } from "@/components/archive/ArchiveCarouselTile";
import { ArchiveCycleTile } from "@/components/archive/ArchiveCycleTile";
import { Icon } from "@/components/Icon";
import {
  archiveMediaKind,
  type ArchiveItem,
} from "@/content/archive";
import { externalLinkProps, isExternalHref } from "@/lib/links";

export interface ArchiveMosaicProps {
  items: ArchiveItem[];
}

function TileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface">
      {children}
    </div>
  );
}

function ArchiveMedia({ item }: { item: ArchiveItem }) {
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
      />
    );
  }

  const kind = archiveMediaKind(item);
  const cropped = Boolean(item.aspect && item.src);
  const frameStyle: CSSProperties | undefined = item.aspect
    ? { aspectRatio: item.aspect }
    : undefined;
  const mediaClassName = cropped
    ? "absolute inset-0 h-full w-full object-cover"
    : "h-auto w-full";

  let media: ReactNode = (
    <div className="aspect-[3/4] w-full" aria-hidden />
  );

  if (kind === "video" && item.src) {
    media = (
      <video
        src={item.src}
        className={mediaClassName}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={item.alt || undefined}
      />
    );
  } else if (kind === "image" && item.src) {
    media = cropped ? (
      <Image
        src={item.src}
        alt={item.alt ?? ""}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
    ) : (
      <Image
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

/**
 * CSS-columns mosaic for Archive media. Items without `src` / `frames` /
 * `slides` are surface placeholders; mixed heights flow as a masonry.
 * Optional `aspect` crops letterboxed captures; `frames` runs a hover-only
 * still cycle; `slides` runs a manual arrow/dot carousel.
 */
export function ArchiveMosaic({ items }: ArchiveMosaicProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <ArchiveTile key={item.id} item={item} />
      ))}
    </div>
  );
}

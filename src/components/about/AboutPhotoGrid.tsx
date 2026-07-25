import Image from "next/image";
import type { AboutPhoto } from "@/content/about";

export interface AboutPhotoGridProps {
  photos: AboutPhoto[];
}

/**
 * Variable-count lifestyle photo grid on the 12-col / 16px-gap system: each
 * tile spans 3 columns (4 across) from `md`, 2 across below. Ready to swap for
 * masonry later without changing the content contract.
 */
export function AboutPhotoGrid({ photos }: AboutPhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-12">
      {photos.map((photo, index) => (
        <div
          key={photo.src ?? `placeholder-${index}`}
          className="relative aspect-square overflow-hidden rounded-xl bg-surface md:col-span-3"
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 308px, 50vw"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

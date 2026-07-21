import Image from "next/image";
import type { AboutPhoto } from "@/content/about";

export interface AboutPhotoGridProps {
  photos: AboutPhoto[];
}

/**
 * Variable-count lifestyle photo grid for the About page. Equal square tiles
 * for now (2 cols mobile, 3 cols md+); swap the layout for masonry later
 * without changing the content contract.
 */
export function AboutPhotoGrid({ photos }: AboutPhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
      {photos.map((photo, index) => (
        <div
          key={photo.src ?? `placeholder-${index}`}
          className="relative aspect-square overflow-hidden rounded-xl bg-surface"
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 320px, 50vw"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

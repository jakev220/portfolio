import Image from "next/image";
import type { AvatarImage } from "@/components/HeroAvatar";

export interface AboutPhotoStripProps {
  photos: AvatarImage[];
}

/**
 * Four equal square portraits across the About header. Always 4-across —
 * tiles shrink on narrow viewports rather than wrapping. Matches the Figma
 * strip (16px gap, 12px radius).
 */
export function AboutPhotoStrip({ photos }: AboutPhotoStripProps) {
  return (
    <div className="grid w-full grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div
          key={photo.src || index}
          className="relative aspect-square overflow-hidden rounded-xl bg-surface"
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 244px, 25vw"
              priority={index < 2}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

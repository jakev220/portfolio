import Image from "next/image";
import { AboutPhotoGrid } from "@/components/about/AboutPhotoGrid";
import type { AboutPhoto } from "@/content/about";

export interface AboutProseProps {
  heading: string;
  body: string[];
  /** Optional equal square strip inside the body column (community photos). */
  photos?: AboutPhoto[];
  /** Optional full-width gallery below the text row, 64px beneath it. */
  gallery?: AboutPhoto[];
}

/**
 * 12-col prose row: heading spans cols 1–4, body (+ optional photo strip)
 * spans cols 6–12 (4 / 1 / 7). An optional `gallery` sits 64px below the text
 * row and spans the full content width. Stacks on small screens.
 */
export function AboutProse({
  heading,
  body,
  photos,
  gallery,
}: AboutProseProps) {
  return (
    <section className="flex flex-col gap-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-4">
        <h2 className="text-h2 text-primary m-0 min-w-0 lg:col-span-4">
          {heading}
        </h2>
        <div className="flex min-w-0 flex-col gap-16 lg:col-span-7 lg:col-start-6">
          <div className="flex flex-col gap-4">
            {body.map((paragraph) => (
              <p key={paragraph} className="text-body m-0">
                {paragraph}
              </p>
            ))}
          </div>
          {photos && photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.src ?? `about-strip-${index}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-surface"
                >
                  {photo.src ? (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 205px, 33vw"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {gallery && gallery.length > 0 ? (
        <AboutPhotoGrid photos={gallery} />
      ) : null}
    </section>
  );
}

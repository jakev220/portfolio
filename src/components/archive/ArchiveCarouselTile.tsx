"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icon";

export interface ArchiveCarouselSlide {
  src: string;
  alt?: string;
}

export interface ArchiveCarouselTileProps {
  slides: ArchiveCarouselSlide[];
  /** Accessible name for the carousel region. */
  label: string;
  /** CSS aspect-ratio value; defaults to square. */
  aspect?: string;
}

/**
 * Manual archive carousel — square stage, side arrows, and bottom dots.
 * Instant cuts between slides (no autoplay).
 */
export function ArchiveCarouselTile({
  slides,
  label,
  aspect = "1 / 1",
}: ArchiveCarouselTileProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  if (count === 0) return null;

  const go = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  const active = slides[index]!;

  return (
    <div
      className="group relative w-full"
      style={{ aspectRatio: aspect }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt ?? ""}
          fill
          className={`object-cover ${i === index ? "opacity-100" : "opacity-0"}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          aria-hidden={i !== index}
        />
      ))}

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute top-1/2 left-2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute top-1/2 right-2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <Icon name="arrow-right" size={18} />
          </button>

          <div
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
            role="tablist"
            aria-label="Slides"
          >
            {slides.map((slide, i) => {
              const selected = i === index;
              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Show slide ${i + 1} of ${count}`}
                  onClick={() => go(i)}
                  className={`cursor-pointer rounded-full transition-[width,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    selected
                      ? "h-1.5 w-4 bg-white"
                      : "size-1.5 bg-white/45 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

          <span className="sr-only" aria-live="polite">
            Slide {index + 1} of {count}
            {active.alt ? `: ${active.alt}` : ""}
          </span>
        </>
      ) : null}
    </div>
  );
}

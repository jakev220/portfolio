"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "@/components/Icon";
import { ExpandableMedia } from "@/components/media-lightbox/ExpandableMedia";

interface CarouselSlideData {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  order: number;
}

interface CarouselContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  register: (slide: Omit<CarouselSlideData, "order">) => () => void;
  slides: CarouselSlideData[];
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export interface MediaCarouselSlideProps {
  /** Image path (e.g. "/work/science-jury/extras-1.webp"). */
  src: string;
  /** Accessible name; also used as caption fallback. */
  alt: string;
  /** Visible caption under the stage. Falls back to `alt` when omitted. */
  caption?: string;
}

export interface MediaCarouselProps {
  /**
   * Stage aspect ratio as "W/H". Locks height so the carousel chrome stays
   * stable across slides. Defaults to 16/9.
   */
  ratio?: string;
  /** One or more `<MediaCarouselSlide />` children. */
  children: ReactNode;
}

function parseRatio(ratio: string): { w: number; h: number } {
  const [rawW, rawH] = ratio.split("/");
  const w = Number(rawW);
  const h = Number(rawH);
  return {
    w: Number.isFinite(w) && w > 0 ? w : 16,
    h: Number.isFinite(h) && h > 0 ? h : 9,
  };
}

/**
 * Inline case-study media carousel: one visible stage, caption, and pill
 * controls. Every slide mounts (and registers) with the page lightbox so each
 * expands as its own gallery item — not a nested carousel-in-carousel.
 *
 * Slides register through context (instead of `Children` + `type ===`) so MDX
 * / RSC client boundaries still deliver props reliably.
 */
export function MediaCarousel({ ratio = "16/9", children }: MediaCarouselProps) {
  const [slides, setSlides] = useState<CarouselSlideData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const orderRef = useMemo(() => ({ current: 0 }), []);
  const { w, h } = parseRatio(ratio);

  const register = useCallback((slide: Omit<CarouselSlideData, "order">) => {
    const order = orderRef.current++;
    setSlides((prev) => {
      const existing = prev.findIndex((entry) => entry.id === slide.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], ...slide };
        return next;
      }
      return [...prev, { ...slide, order }].sort((a, b) => a.order - b.order);
    });
    return () => {
      setSlides((prev) => prev.filter((entry) => entry.id !== slide.id));
    };
  }, [orderRef]);

  const sorted = slides;
  const count = sorted.length;
  const safeIndex = count > 0 ? Math.min(activeIndex, count - 1) : 0;
  const active = count > 0 ? sorted[safeIndex] : null;
  const caption = active
    ? (active.caption?.trim() || active.alt).trim()
    : "";
  const showNav = count > 1;

  const goTo = (next: number) => {
    if (count === 0) return;
    setActiveIndex(((next % count) + count) % count);
  };

  const value = useMemo(
    () => ({
      activeIndex: safeIndex,
      setActiveIndex,
      register,
      slides: sorted,
    }),
    [safeIndex, register, sorted],
  );

  return (
    <CarouselContext.Provider value={value}>
      <div className="flex min-w-0 flex-col items-center gap-6 sm:gap-8">
        <div
          className="relative w-full overflow-hidden rounded-xl border border-border bg-surface"
          style={{ aspectRatio: `${w} / ${h}` }}
        >
          {children}
        </div>

        <p className="text-caption m-0 min-h-[1.5em] max-w-2xl text-center text-secondary">
          {caption || "\u00a0"}
        </p>

        {showNav ? (
          <nav className="flex items-center gap-4" aria-label="Extras carousel">
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              className="cursor-pointer rounded-lg p-1.5 text-secondary transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Previous slide"
            >
              <Icon name="arrow-left" size={20} />
            </button>

            <div className="flex items-center gap-2" role="tablist">
              {sorted.map((slide, slideIndex) => {
                const selected = slideIndex === safeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show slide ${slideIndex + 1} of ${count}`}
                    onClick={() => goTo(slideIndex)}
                    className={`cursor-pointer rounded-full transition-[width,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      selected
                        ? "h-1.5 w-4 bg-secondary"
                        : "h-1.5 w-1.5 bg-divider hover:bg-secondary"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => goTo(safeIndex + 1)}
              className="cursor-pointer rounded-lg p-1.5 text-secondary transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Next slide"
            >
              <Icon name="arrow-right" size={20} />
            </button>
          </nav>
        ) : null}
      </div>
    </CarouselContext.Provider>
  );
}

/**
 * One carousel slide. Renders into the parent stage and registers with both
 * the carousel (for pills/caption) and the page media lightbox (for expand).
 */
export function MediaCarouselSlide({
  src,
  alt,
  caption,
}: MediaCarouselSlideProps) {
  const id = useId();
  const ctx = useContext(CarouselContext);

  useEffect(() => {
    if (!ctx) return;
    return ctx.register({ id, src, alt, caption });
  }, [ctx, id, src, alt, caption]);

  if (!ctx) {
    throw new Error("MediaCarouselSlide must be used within MediaCarousel");
  }

  const slideIndex = ctx.slides.findIndex((slide) => slide.id === id);
  const selected = slideIndex >= 0 && slideIndex === ctx.activeIndex;

  return (
    <div
      className={`absolute inset-0 ${
        selected ? "z-[1]" : "pointer-events-none invisible z-0"
      }`}
      aria-hidden={!selected}
    >
      <ExpandableMedia src={src} alt={alt} caption={caption} fill>
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-contain"
          sizes="(min-width: 1280px) 1232px, calc(100vw - 48px)"
          priority={slideIndex === 0}
        />
      </ExpandableMedia>
    </div>
  );
}

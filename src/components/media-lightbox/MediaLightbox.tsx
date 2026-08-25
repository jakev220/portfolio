"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import { useMediaLightbox } from "@/components/media-lightbox/MediaLightboxProvider";

/**
 * Full-viewport media overlay. Near-opaque dark (light theme) / light (dark
 * theme) scrim so the case study is barely visible; white panel holds media,
 * caption, and controls. Esc / scrim click / close to dismiss; scroll locked.
 */
export function MediaLightbox() {
  const { items, activeIndex, isOpen, close, next, prev, goTo } =
    useMediaLightbox();
  const closeRef = useRef<HTMLButtonElement>(null);

  const active = isOpen ? items[activeIndex] : null;
  const caption = active
    ? (active.caption?.trim() || active.alt).trim()
    : "";
  const showNav = items.length > 1;

  useEffect(() => {
    if (!isOpen) return;

    const { documentElement, body } = document;
    const scrollY = window.scrollY;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    // Lock scroll without leaving the page free to move behind the overlay.
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBody.overflow;
      body.style.position = previousBody.position;
      body.style.top = previousBody.top;
      body.style.left = previousBody.left;
      body.style.right = previousBody.right;
      body.style.width = previousBody.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, next, prev]);

  if (!isOpen || !active || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || "Expanded media"}
      className="fixed inset-0 z-[60] flex cursor-pointer flex-col items-center justify-center bg-lightbox-scrim px-6 py-16 sm:px-10 sm:py-20"
      onClick={close}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
        className="absolute right-4 top-4 z-10 cursor-pointer rounded-lg p-2 text-bg transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <Icon name="close" size={24} />
      </button>

      <div
        className="flex w-full max-w-5xl cursor-default flex-col items-center gap-6 rounded-xl bg-lightbox-panel px-4 py-4 sm:gap-8 sm:px-6 sm:py-6"
        onClick={(event) => event.stopPropagation()}
      >
        {/*
          Fixed stage so the panel size stays stable across gallery items.
          Media is capped to the stage (scale-down only) and centered — smaller
          assets keep their intrinsic size/quality instead of being upscaled.
        */}
        <div className="relative flex h-[min(65vh,680px)] w-full items-center justify-center">
          {active.video ? (
            <video
              key={active.video}
              className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
              src={active.video}
              poster={active.poster}
              muted
              loop
              playsInline
              autoPlay
              controls={false}
              aria-label={active.alt}
            />
          ) : active.src ? (
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              width={1600}
              height={1000}
              unoptimized
              className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />
          ) : null}
        </div>

        <p className="text-caption m-0 flex min-h-[3rem] max-w-2xl items-center justify-center text-center text-secondary">
          {caption || "\u00a0"}
        </p>

        {showNav ? (
          <nav
            className="flex items-center gap-4"
            aria-label="Media gallery"
          >
            <button
              type="button"
              onClick={prev}
              className="cursor-pointer rounded-lg p-1.5 text-secondary transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Previous media"
            >
              <Icon name="arrow-left" size={20} />
            </button>

            <div className="flex items-center gap-2" role="tablist">
              {items.map((item, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show media ${index + 1} of ${items.length}`}
                    onClick={() => goTo(index)}
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
              onClick={next}
              className="cursor-pointer rounded-lg p-1.5 text-secondary transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Next media"
            >
              <Icon name="arrow-right" size={20} />
            </button>
          </nav>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

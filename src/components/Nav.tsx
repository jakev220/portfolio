"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MEDIA_LIGHTBOX_CLOSE_EVENT,
  MEDIA_LIGHTBOX_OPEN_EVENT,
} from "@/lib/media-lightbox-ui";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavProps {
  items: NavItem[];
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Above this scroll position (near the top) the nav is always shown. */
const TOP_ZONE = 80;
/** Pointer within this many px of the viewport top reveals the nav (desktop). */
const HOT_ZONE = 100;
/** Min scroll delta before flipping hide/show, to avoid jitter. */
const DELTA = 4;

/**
 * Primary nav: right-aligned to the content edge (same max-width + gutter as the
 * page, matching where the work view toggle sits) and offset 80px from the top.
 *
 * Behavior (auto-hide + proximity reveal): always visible at the very top of the
 * page; once scrolled past it hides on scroll-down and reveals on scroll-up. On
 * pointer devices it also reveals when the cursor moves to the top edge, and it
 * always reveals when a nav control receives keyboard focus.
 *
 * Rendered as a fixed overlay; the empty area is click-through (pointer-events
 * are re-enabled only on the interactive controls).
 */
export function Nav({ items }: NavProps) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onOpen = () => setLightboxOpen(true);
    const onClose = () => setLightboxOpen(false);
    window.addEventListener(MEDIA_LIGHTBOX_OPEN_EVENT, onOpen);
    window.addEventListener(MEDIA_LIGHTBOX_CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(MEDIA_LIGHTBOX_OPEN_EVENT, onOpen);
      window.removeEventListener(MEDIA_LIGHTBOX_CLOSE_EVENT, onClose);
    };
  }, []);

  const suppressed = lightboxOpen;

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      setFloating(y >= TOP_ZONE);
      if (y < TOP_ZONE) {
        setHidden(false);
      } else if (y > lastY.current + DELTA) {
        setHidden(true);
      } else if (y < lastY.current - DELTA) {
        setHidden(false);
      }
      lastY.current = y;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY <= HOT_ZONE) setHidden(false);
    };
    if (canHover) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (canHover) window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-hidden={suppressed || undefined}
      onFocusCapture={() => {
        if (!suppressed) setHidden(false);
      }}
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        hidden || suppressed ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-end px-6 pt-20">
        {/* -mr-4 (= px-4) optically outsets the box into the gutter so the nav
            controls align to the content grid while padding stays symmetric. */}
        <div className="relative -mr-4 inline-flex items-center gap-6 rounded-xl px-4 py-2">
          {/* Frosted box that hugs the nav cluster; fades in once floating. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-xl border border-border bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none ${
              floating ? "opacity-100" : "opacity-0"
            }`}
          />
          <ul className="pointer-events-auto relative flex items-center gap-6">
            {items.map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`text-body transition-colors hover:text-primary ${
                      active ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="pointer-events-auto relative">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

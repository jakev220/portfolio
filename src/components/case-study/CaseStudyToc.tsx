"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { scrollToId } from "@/lib/scroll-to-id";

export interface TocEntry {
  id: string;
  label: string;
}

const TOC_SELECTOR = "[data-case-study-toc]";

/** Brief grace after leaving the safe triangle — keep snappy, not sticky. */
const CLOSE_MS = 40;

function collectEntries(root: ParentNode = document): TocEntry[] {
  const nodes = root.querySelectorAll<HTMLElement>(TOC_SELECTOR);
  const entries: TocEntry[] = [];
  const seen = new Set<string>();

  nodes.forEach((node) => {
    const label = node.dataset.caseStudyToc?.trim();
    const id = node.id;
    if (!label || !id || seen.has(id)) return;
    seen.add(id);
    entries.push({ id, label });
  });

  return entries;
}

/** Barycentric point-in-triangle test (inclusive edges). */
function pointInTriangle(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  if (d === 0) return false;
  const a = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / d;
  const b = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / d;
  const c = 1 - a - b;
  return a >= -0.001 && b >= -0.001 && c >= -0.001;
}

function prefersHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Desktop-only sticky case-study table of contents. Discovers sections from
 * {@link SectionLead} nodes marked with `data-case-study-toc`. Fine-pointer
 * hover opens the panel; a safe triangle between the handle and panel keeps
 * it open while the cursor moves diagonally. Click still toggles for
 * keyboard / coarse pointers. Escape closes. Scroll-spy drives a sliding pill
 * behind the active entry; links scroll to the section (smooth, or instant
 * when `prefers-reduced-motion`).
 */
export function CaseStudyToc() {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [indicator, setIndicator] = useState({
    top: 0,
    height: 0,
    ready: false,
  });
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  /** Cursor exit point from the handle — apex of the safe triangle. */
  const exitPointRef = useRef<{ x: number; y: number } | null>(null);
  const panelId = useId();

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPanel = useCallback(() => {
    clearCloseTimer();
    exitPointRef.current = null;
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      exitPointRef.current = null;
      setOpen(false);
    }, CLOSE_MS);
  }, [clearCloseTimer]);

  const refreshEntries = useCallback(() => {
    setEntries(collectEntries());
  }, []);

  useEffect(() => {
    refreshEntries();

    const root = document.querySelector("[data-case-study]");
    if (!root) return;

    const observer = new MutationObserver(() => refreshEntries());
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [refreshEntries]);

  // Scroll-spy: which section's top edge has crossed the upper third of the viewport.
  useEffect(() => {
    if (entries.length === 0) return;

    const onScroll = () => {
      const marker = window.innerHeight * 0.28;
      let current: string | null = entries[0]?.id ?? null;

      for (const entry of entries) {
        const el = document.getElementById(entry.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= marker) current = entry.id;
        else break;
      }

      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);

  const updateIndicator = useCallback(() => {
    if (!open || !activeId) {
      setIndicator((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }

    const list = listRef.current;
    const button = itemRefs.current.get(activeId);
    if (!list || !button) return;

    const listRect = list.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setIndicator({
      top: buttonRect.top - listRect.top + list.scrollTop,
      height: buttonRect.height,
      ready: true,
    });
  }, [activeId, open]);

  // Keep the active-section pill aligned with its row (open, scroll-spy, resize).
  useLayoutEffect(() => {
    updateIndicator();
    if (!open) return;

    const list = listRef.current;
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);

    let observer: ResizeObserver | undefined;
    if (list && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(onResize);
      observer.observe(list);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [updateIndicator, open, entries]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        exitPointRef.current = null;
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, clearCloseTimer]);

  // Safe triangle: while open, keep the panel up if the cursor is over the
  // handle, the panel, or the triangle from the handle-exit point to the
  // panel’s near edge (covers diagonal travel across the gap).
  useEffect(() => {
    if (!open || !prefersHover()) return;

    const onPointerMove = (event: PointerEvent) => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const x = event.clientX;
      const y = event.clientY;
      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const overTrigger =
        x >= triggerRect.left &&
        x <= triggerRect.right &&
        y >= triggerRect.top &&
        y <= triggerRect.bottom;
      const overPanel =
        x >= panelRect.left &&
        x <= panelRect.right &&
        y >= panelRect.top &&
        y <= panelRect.bottom;

      if (overTrigger || overPanel) {
        clearCloseTimer();
        if (overTrigger) exitPointRef.current = { x, y };
        else exitPointRef.current = null;
        return;
      }

      const apex = exitPointRef.current;
      if (apex) {
        // Panel sits to the right of the handle — near edge is the left side.
        const inTriangle = pointInTriangle(
          x,
          y,
          apex.x,
          apex.y,
          panelRect.left,
          panelRect.top,
          panelRect.left,
          panelRect.bottom,
        );
        if (inTriangle) {
          clearCloseTimer();
          return;
        }
      }

      scheduleClose();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [open, clearCloseTimer, scheduleClose]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  const goTo = (id: string) => {
    scrollToId(id);
    setActiveId(id);
    clearCloseTimer();
    exitPointRef.current = null;
    setOpen(false);
  };

  const onTriggerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!prefersHover()) return;
    exitPointRef.current = { x: event.clientX, y: event.clientY };
    openPanel();
  };

  const onTriggerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!prefersHover()) return;
    exitPointRef.current = { x: event.clientX, y: event.clientY };
    // Don’t close immediately — pointermove + triangle decide.
  };

  const onPanelEnter = () => {
    if (!prefersHover()) return;
    exitPointRef.current = null;
    openPanel();
  };

  const onPanelLeave = (event: ReactPointerEvent<HTMLElement>) => {
    if (!prefersHover()) return;
    // Leaving the panel away from the handle → close; toward handle is
    // covered by moving back onto the trigger.
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const { clientX: x, clientY: y } = event;
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return;
      }
    }
    scheduleClose();
  };

  if (entries.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:left-6 lg:block">
      <div className="pointer-events-auto flex items-center">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close table of contents" : "Open table of contents"}
          onClick={() => {
            clearCloseTimer();
            exitPointRef.current = null;
            setOpen((prev) => !prev);
          }}
          onPointerEnter={onTriggerEnter}
          onPointerLeave={onTriggerLeave}
          className="flex flex-col items-center justify-center gap-2.5 rounded-lg border border-transparent bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] px-3 py-3.5 backdrop-blur-md transition-colors hover:bg-surface aria-expanded:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            aria-hidden
            width="20"
            height={entries.length * 12 - 10}
            viewBox={`0 0 20 ${entries.length * 12 - 10}`}
            className="overflow-visible text-divider"
          >
            {entries.map((entry, index) => {
              const active = entry.id === activeId;
              return (
                <rect
                  key={entry.id}
                  x={active ? -1 : 0}
                  y={active ? index * 12 - 0.5 : index * 12}
                  width={active ? 22 : 20}
                  height={active ? 3 : 2}
                  rx={active ? 1.5 : 1}
                  fill="currentColor"
                  className={
                    active
                      ? "text-primary transition-colors duration-300"
                      : "transition-colors duration-300"
                  }
                />
              );
            })}
          </svg>
        </button>

        {open ? (
          <nav
            ref={panelRef}
            id={panelId}
            aria-label="Case study contents"
            onPointerEnter={onPanelEnter}
            onPointerLeave={onPanelLeave}
            className="ml-2 w-56 rounded-xl border border-border bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] px-3 py-3.5 backdrop-blur-md"
          >
            <p className="text-label text-secondary m-0 px-2">Contents</p>
            <hr className="border-divider my-3" />
            <ul
              ref={listRef}
              className="relative m-0 flex list-none flex-col gap-0.5 p-0"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute left-0 right-0 rounded-lg bg-surface motion-reduce:transition-none ${
                  indicator.ready
                    ? "transition-[top,height,opacity] duration-300 ease-out"
                    : ""
                }`}
                style={{
                  top: indicator.top,
                  height: indicator.height,
                  opacity: indicator.ready ? 1 : 0,
                }}
              />
              {entries.map((entry) => {
                const active = entry.id === activeId;
                return (
                  <li key={entry.id} className="relative z-10 m-0 min-w-0">
                    <button
                      type="button"
                      ref={(node) => {
                        if (node) itemRefs.current.set(entry.id, node);
                        else itemRefs.current.delete(entry.id);
                      }}
                      onClick={() => goTo(entry.id)}
                      aria-current={active ? "true" : undefined}
                      className={`block w-full cursor-pointer truncate rounded-lg px-2 py-1.5 text-left text-body transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        active
                          ? "text-heading"
                          : "text-secondary hover:text-heading"
                      }`}
                    >
                      {entry.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface TocEntry {
  id: string;
  label: string;
}

const TOC_SELECTOR = "[data-case-study-toc]";

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

/**
 * Desktop-only sticky case-study table of contents. Discovers sections from
 * {@link SectionLead} nodes marked with `data-case-study-toc`. Handle shows
 * one line per section; click toggles the panel. Scroll-spy drives a sliding
 * pill behind the active entry; links smooth-scroll to the section.
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
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const panelId = useId();

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

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  if (entries.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:left-6 lg:block"
    >
      <div className="pointer-events-auto flex items-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close table of contents" : "Open table of contents"}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center gap-2.5 rounded-lg border border-transparent px-3 py-3.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            open ? "bg-surface" : "hover:bg-surface"
          }`}
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
                    active ? "text-primary transition-colors duration-300" : "transition-colors duration-300"
                  }
                />
              );
            })}
          </svg>
        </button>

        {open ? (
          <nav
            id={panelId}
            aria-label="Case study contents"
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

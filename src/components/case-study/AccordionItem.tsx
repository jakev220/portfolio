"use client";

import { useId, useState, type ReactNode } from "react";
import { Figure } from "@/components/case-study/Figure";
import { RightProse } from "@/components/case-study/SplitGrid";

export interface AccordionItemProps {
  /** Primary trigger label — rendered as an `h3`. */
  title: string;
  /** Optional secondary line beneath the title. */
  subtitle?: string;
  /** Expanded body — MDX prose passed as children. */
  children: ReactNode;
  /** Optional still image below the title/body row (see `Figure`). */
  mediaSrc?: string;
  /** Optional video — takes precedence over `mediaSrc`. */
  mediaVideo?: string;
  mediaPoster?: string;
  /** Required when `mediaSrc` or `mediaVideo` is set. */
  mediaAlt?: string;
  /** Figure aspect ratio (e.g. `"16/9"`). Defaults to `16/9`. */
  mediaRatio?: string;
  /** Video playback speed (string for MDX, e.g. `"0.75"`). */
  mediaPlaybackRate?: string;
}

function AccordionIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-[29px] w-[29px] shrink-0 items-center justify-center text-secondary"
    >
      <svg
        viewBox="0 0 14 14"
        width={14}
        height={14}
        fill="currentColor"
        className={`transition-transform duration-[400ms] ease-out ${
          open ? "rotate-45" : "group-hover:rotate-[25deg]"
        }`}
      >
        <path d="M6 0h2v6h6v2H8v6H6V8H0V6h6V0z" />
      </svg>
    </span>
  );
}

function TriggerContent({
  title,
  subtitle,
  open,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
}) {
  return (
    <>
      <AccordionIcon open={open} />
      <span className="flex min-w-0 flex-col gap-2">
        <h3 className="text-h3 text-heading m-0">{title}</h3>
        {subtitle ? (
          <span className="text-body text-secondary">{subtitle}</span>
        ) : null}
      </span>
    </>
  );
}

const unfoldClassName =
  "grid transition-[grid-template-rows] duration-[400ms] ease-out motion-reduce:transition-none";

/**
 * A single collapsible case-study row. Content and divider inset 12px (`px-3`
 * `py-3`) per the Figma spec. Closed: the full padded row is the click target
 * (hover surface + 25° icon tilt). Expanded: mirrors the shared 4 / 1 / 7 grid
 * geometry inside the inset; the full-height left column closes the panel so
 * body text stays selectable. Icon rotates 45° when open. Optional `media*`
 * props render a {@link Figure} in a centered 10-col band below the title/body
 * row; body and media share one continuous height unfold.
 */
export function AccordionItem({
  title,
  subtitle,
  children,
  mediaSrc,
  mediaVideo,
  mediaPoster,
  mediaAlt = "",
  mediaRatio = "16/9",
  mediaPlaybackRate,
}: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggle = () => setOpen((prev) => !prev);
  const hasMedia = Boolean(mediaVideo || mediaSrc);
  const unfoldStyle = { gridTemplateRows: open ? "1fr" : "0fr" };

  const triggerClassName =
    "cursor-pointer items-start gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  return (
    <div
      className={`group relative flex flex-col gap-6 rounded-xl px-3 py-3 ${
        open ? "" : "transition-colors hover:bg-surface"
      }`}
    >
      {!open ? (
        <button
          type="button"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={toggle}
          className={`absolute inset-0 z-10 grid w-full grid-cols-1 text-left lg:grid-cols-12 lg:gap-4 ${triggerClassName} bg-transparent p-3`}
        >
          <span className="flex w-full min-w-0 items-start gap-2 lg:col-span-4">
            <TriggerContent title={title} subtitle={subtitle} open={false} />
          </span>
          <span
            aria-hidden
            className="hidden lg:col-span-7 lg:col-start-6 lg:block"
          />
        </button>
      ) : null}

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 lg:gap-4 ${
          open ? "gap-y-8" : "gap-y-0"
        }`}
      >
        <div
          className={`relative min-h-full min-w-0 lg:col-span-4 ${
            !open ? "pointer-events-none" : ""
          }`}
        >
          {open ? (
            <>
              <div aria-hidden className="invisible flex items-start gap-2">
                <TriggerContent title={title} subtitle={subtitle} open />
              </div>
              <button
                type="button"
                aria-expanded
                aria-controls={panelId}
                onClick={toggle}
                className={`absolute inset-0 z-10 flex ${triggerClassName} bg-transparent p-0`}
              >
                <TriggerContent title={title} subtitle={subtitle} open />
              </button>
            </>
          ) : (
            <div aria-hidden className="invisible flex items-start gap-2">
              <TriggerContent title={title} subtitle={subtitle} open={false} />
            </div>
          )}
        </div>

        <div className="min-w-0 lg:col-span-7 lg:col-start-6">
          <div
            id={panelId}
            aria-hidden={!open}
            className={unfoldClassName}
            style={unfoldStyle}
          >
            <div className="min-h-0 overflow-hidden">
              <RightProse className="cursor-text">{children}</RightProse>
            </div>
          </div>
        </div>

        {hasMedia ? (
          <div
            aria-hidden={!open}
            className={`min-w-0 lg:col-span-10 lg:col-start-2 ${unfoldClassName}`}
            style={unfoldStyle}
          >
            <div className="min-h-0 overflow-hidden">
              <Figure
                src={mediaSrc}
                video={mediaVideo}
                poster={mediaPoster}
                alt={mediaAlt}
                ratio={mediaRatio}
                playbackRate={mediaPlaybackRate}
                className="my-0"
              />
            </div>
          </div>
        ) : null}
      </div>

      <hr className="border-divider" />
    </div>
  );
}

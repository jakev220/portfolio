"use client";

import { useId, useState, type ReactNode } from "react";

export interface AccordionItemProps {
  /** Primary trigger label — rendered as an `h3`. */
  title: string;
  /** Optional secondary line beneath the title. */
  subtitle?: string;
  /** Expanded body — MDX prose passed as children. */
  children: ReactNode;
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

/**
 * A single collapsible case-study row. Content and divider inset 12px (`px-3`
 * `py-3`) per the Figma spec. Closed: the full padded row is the click target
 * (hover surface + 25° icon tilt). Expanded: mirrors the shared 4 / 1 / 7 grid
 * geometry inside the inset; the full-height left column closes the panel so
 * body text stays selectable. Icon rotates 45° when open.
 */
export function AccordionItem({ title, subtitle, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggle = () => setOpen((prev) => !prev);

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

        <div className="min-w-0 cursor-text text-body lg:col-span-7 lg:col-start-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <div
            id={panelId}
            aria-hidden={!open}
            className="grid transition-[grid-template-rows] duration-[400ms] ease-out"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="text-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-divider" />
    </div>
  );
}

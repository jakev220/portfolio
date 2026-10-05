"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/Icon";
import { ThemePreferenceList, ThemeToggle } from "@/components/ThemeToggle";
import { useChromeVisibility } from "@/lib/chrome-visibility";
import {
  applyThemePreference,
  readThemePreference,
  type ThemePreference,
} from "@/lib/theme";

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

/**
 * Primary nav: right-aligned to the content edge (same max-w + gutter as the
 * page). Desktop keeps inline links + theme cycle. Below `md`, chrome is a
 * square `menu.svg` control (the L→R collapse is the resting shape vs the
 * desktop cluster — not the open animation). Open: modal panel with the shared
 * fade/rise enter; Work / Archive / About, then Light / Dark / System.
 *
 * Auto-hide + proximity reveal via `useChromeVisibility` (shared with the
 * case-study back control).
 */
export function Nav({ items }: NavProps) {
  const pathname = usePathname();
  const { hidden, floating, suppressed, reveal } = useChromeVisibility();
  const [menuOpen, setMenuOpen] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>("light");
  const menuId = useId();

  useEffect(() => {
    setPreference(readThemePreference());
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemePreference("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const onThemeChange = (next: ThemePreference) => {
    applyThemePreference(next);
    setPreference(next);
  };

  const closeMenu = () => setMenuOpen(false);

  const frostClass =
    "border border-border bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] backdrop-blur-md";

  return (
    <nav
      aria-hidden={suppressed || undefined}
      onFocusCapture={reveal}
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-end px-6 pt-20">
        {/* Desktop: inline links + theme toggle */}
        <div className="relative hidden items-center gap-6 rounded-xl px-4 py-2 sm:-mr-4 md:inline-flex">
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-xl ${frostClass} transition-opacity duration-300 motion-reduce:transition-none ${
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

        {/* Mobile: square control; menu opens as a fade/rise modal (not a width slide). */}
        <div className="relative inline-flex sm:-mr-4 md:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-haspopup="dialog"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className={`pointer-events-auto relative z-20 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-primary transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${frostClass} ${
              floating || menuOpen ? "opacity-100" : "opacity-90"
            }`}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={20} />
          </button>

          {menuOpen ? (
            <>
              <button
                type="button"
                aria-label="Dismiss menu"
                className="pointer-events-auto fixed inset-0 z-10 cursor-default bg-transparent"
                onClick={closeMenu}
              />
              <div
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className={`nav-menu-enter pointer-events-auto absolute right-0 top-full z-20 mt-2 w-56 rounded-xl ${frostClass}`}
              >
                <div className="flex flex-col gap-4 px-4 py-3">
                  <ul className="flex flex-col gap-1">
                    {items.map(({ label, href }) => {
                      const active = isActive(pathname, href);
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            onClick={closeMenu}
                            className={`text-body block rounded-lg px-3 py-2 transition-colors hover:bg-surface ${
                              active ? "text-primary" : "text-secondary"
                            }`}
                          >
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="border-t border-border pt-3">
                    <ThemePreferenceList
                      preference={preference}
                      onChange={onThemeChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

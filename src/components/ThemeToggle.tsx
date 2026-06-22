"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

type Theme = "light" | "dark";

/**
 * Light/dark mode toggle. Ghost icon button matching the work view toggle's
 * hover/pressed states — but, unlike the view toggle, it never shows a selected
 * border ring. Theme is applied by toggling the `dark` class on <html> and
 * persisted to localStorage (initial class is set pre-paint in the root layout
 * to avoid a flash).
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* ignore storage failures (e.g. private mode) */
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-primary transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none active:bg-border"
    >
      <Icon name="mode" />
    </button>
  );
}

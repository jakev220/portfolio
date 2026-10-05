"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import {
  applyThemePreference,
  preferenceResolvesDark,
  readThemePreference,
  type ThemePreference,
} from "@/lib/theme";

/**
 * Compact desktop control: cycles Light → Dark → System. Mobile nav exposes
 * the same three options as an explicit list (see Nav menu).
 */
export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("light");

  useEffect(() => {
    setPreference(readThemePreference());
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemePreference("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const cycle = () => {
    const order: ThemePreference[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(preference) + 1) % order.length]!;
    applyThemePreference(next);
    setPreference(next);
  };

  const resolvedDark = preferenceResolvesDark(preference);
  const label =
    preference === "system"
      ? `Theme: System (${resolvedDark ? "dark" : "light"}). Switch to Light`
      : preference === "dark"
        ? "Theme: Dark. Switch to System"
        : "Theme: Light. Switch to Dark";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      aria-pressed={resolvedDark}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-primary transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none active:bg-border"
    >
      <Icon name="mode" />
    </button>
  );
}

const PREFERENCE_LABELS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

/**
 * Explicit Light / Dark / System choices for the mobile nav menu.
 */
export function ThemePreferenceList({
  preference,
  onChange,
}: {
  preference: ThemePreference;
  onChange: (next: ThemePreference) => void;
}) {
  return (
    <ul className="flex flex-col gap-2" aria-label="Theme">
      {PREFERENCE_LABELS.map(({ value, label }) => {
        const selected = preference === value;
        return (
          <li key={value}>
            <button
              type="button"
              onClick={() => onChange(value)}
              aria-pressed={selected}
              className={`text-body w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none ${
                selected ? "text-primary" : "text-secondary"
              }`}
            >
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

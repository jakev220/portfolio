/** Persisted appearance preference (`localStorage` key `theme`). */
export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/** Whether `<html>` should have the `dark` class for this preference. */
export function preferenceResolvesDark(preference: ThemePreference): boolean {
  if (preference === "dark") return true;
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

export function readThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "light";
}

export function applyThemePreference(preference: ThemePreference): void {
  document.documentElement.classList.toggle(
    "dark",
    preferenceResolvesDark(preference),
  );
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

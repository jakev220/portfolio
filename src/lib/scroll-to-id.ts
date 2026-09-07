/**
 * In-page scroll helpers. Smooth by default; instant when the user prefers
 * reduced motion (matches skip CTAs + case-study TOC).
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll to an element by id. Uses smooth scrolling unless
 * `prefers-reduced-motion: reduce` is set (then `auto` / instant).
 * Optionally updates the URL hash via `history.pushState` (no jump).
 */
export function scrollToId(
  id: string,
  { updateHash = true }: { updateHash?: boolean } = {},
): boolean {
  if (!id || typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });

  if (updateHash) {
    const next = `#${id}`;
    if (window.location.hash !== next) {
      window.history.pushState(null, "", next);
    }
  }

  return true;
}

/** Parse `#section-id` (or bare id) and {@link scrollToId}. */
export function scrollToHash(
  href: string,
  options?: { updateHash?: boolean },
): boolean {
  const raw = href.startsWith("#") ? href.slice(1) : href;
  if (!raw) return false;
  try {
    return scrollToId(decodeURIComponent(raw), options);
  } catch {
    return scrollToId(raw, options);
  }
}

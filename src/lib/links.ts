/**
 * Link helpers shared across the site so internal/external behavior stays
 * consistent everywhere (and the future shared Link component can reuse them).
 *
 * External links (other sites) get a trailing ↗ and open in a new tab.
 * Internal links (starting with "/" or "#") get neither.
 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Anchor props to spread for external links (no-op object for internal). */
export function externalLinkProps(href: string) {
  return isExternalHref(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

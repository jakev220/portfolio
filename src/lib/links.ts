/**
 * Link helpers shared across the site so internal/external behavior stays
 * consistent. Prefer {@link Link} from `@/components/Link` for text CTAs
 * (inbound `→`, outbound `↗` + new tab).
 *
 * External links (other sites) open in a new tab. Internal links (starting
 * with "/" or "#") do not.
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

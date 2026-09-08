import type { ReactNode } from "react";
import NextLink from "next/link";
import { externalLinkProps, isExternalHref } from "@/lib/links";

export interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

function isMailto(href: string): boolean {
  return href.startsWith("mailto:");
}

/**
 * Site text link — accent, underlined.
 * - Internal (`/` / `#`): trailing `→`, Next.js client navigation
 * - External (`http(s)`): trailing `↗`, new tab
 * - `mailto:`: trailing `↗`
 */
export function Link({ href, children, className = "" }: LinkProps) {
  const classes = [
    "text-accent underline underline-offset-2 transition-opacity hover:opacity-70",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes} {...externalLinkProps(href)}>
        {children}
        <span aria-hidden> ↗</span>
      </a>
    );
  }

  if (isMailto(href)) {
    return (
      <a href={href} className={classes}>
        {children}
        <span aria-hidden> ↗</span>
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes}>
      {children}
      <span aria-hidden> →</span>
    </NextLink>
  );
}

import type { ReactNode } from "react";
import NextLink from "next/link";
import { externalLinkProps, isExternalHref } from "@/lib/links";

export interface LinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
  /**
   * Non-navigating in-site link treatment (trailing `→`). Use when the
   * destination isn’t ready yet — still looks like a text link for hover
   * affordances (e.g. cursor-follow previews).
   */
  disabled?: boolean;
}

function isMailto(href: string): boolean {
  return href.startsWith("mailto:");
}

const baseClasses =
  "text-accent underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const disabledClasses =
  "cursor-default text-secondary underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

/**
 * Site text link — accent, underlined.
 * - Internal (`/` / `#`): trailing `→`, Next.js client navigation
 * - External (`http(s)`): trailing `↗`, new tab
 * - `mailto:`: trailing `↗`
 * - `disabled`: trailing `→`, muted secondary (non-navigating)
 */
export function Link({
  href = "",
  children,
  className = "",
  disabled = false,
}: LinkProps) {
  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        tabIndex={0}
        className={[disabledClasses, className].filter(Boolean).join(" ")}
      >
        {children}
        <span aria-hidden> →</span>
      </span>
    );
  }

  const classes = [baseClasses, className].filter(Boolean).join(" ");

  if (!href) {
    return null;
  }

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

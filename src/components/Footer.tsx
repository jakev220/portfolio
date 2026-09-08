import { FooterClock } from "@/components/FooterClock";
import { Link } from "@/components/Link";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /** Outbound contact links (Mail / LinkedIn / Resumé). */
  contact: FooterLink[];
  /** Quiet meta: copyright + location for the live clock. */
  meta: {
    copyright: string;
    location: string;
  };
}

/**
 * Minimal site footer — one row: copyright, live Pacific geo/time, then
 * horizontal outbound {@link Link}s (24px gaps). Type uses `text-body`.
 */
export function Footer({ contact, meta }: FooterProps) {
  return (
    <footer className="w-full pb-12 pt-24 sm:pb-16 sm:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="text-body text-secondary m-0 shrink-0">
          {meta.copyright}
        </p>

        <p className="text-body text-secondary m-0 shrink-0">
          <FooterClock location={meta.location} />
        </p>

        <nav
          aria-label="Contact"
          className="flex flex-wrap items-center gap-6 sm:justify-end"
        >
          {contact.map((link) => (
            <Link key={link.href} href={link.href} className="text-body">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

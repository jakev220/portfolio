import Image from "next/image";
import { FooterClock } from "@/components/FooterClock";
import { externalLinkProps } from "@/lib/links";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /** Connect message: heading + supporting body. */
  message: { heading: string; body: string };
  /** Stacked external/contact links (email, LinkedIn, resume, …). */
  links: FooterLink[];
  /** "Want to see more?" explore card. */
  explore: {
    heading: string;
    /** Overlay title shown bottom-left of the media. */
    title: string;
    image?: string;
    imageAlt?: string;
    href: string;
  };
  /** Bottom meta row. `location` feeds the live Pacific-time clock. */
  meta: { copyright: string; built: string; location: string };
}

/** Bottom-of-media scrim so overlay text stays legible over any image. */
const SCRIM =
  "linear-gradient(to top, color-mix(in srgb, var(--color-text-primary) 90%, transparent), transparent)";

/** Accent contact link. These all lead off-site, so each gets the ↗ and opens
 *  in a new tab (keeping the visitor on the portfolio). */
function FooterLinkItem({ label, href }: FooterLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-body text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
    >
      {label}
      <span aria-hidden> ↗</span>
    </a>
  );
}

/**
 * Site footer. Three-column grid (content-agnostic via props):
 * - column 1: connect message + stacked links
 * - columns 2–3: "Want to see more?" + an explore media card
 * Then a bottom meta row (left / center / right aligned) whose right cell shows
 * the live Pacific time with a sun/moon glyph.
 */
export function Footer({ message, links, explore, meta }: FooterProps) {
  return (
    <footer className="mx-auto max-w-7xl px-6 pb-16">
      {/* main content — 1 + 2 columns */}
      <div className="grid grid-cols-1 gap-12 pt-12 md:grid-cols-3 md:gap-8 md:pt-16">
        {/* connect */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-h2 text-primary">{message.heading}</h2>
            <p className="text-body text-secondary">{message.body}</p>
          </div>
          <nav aria-label="Contact" className="flex flex-col items-start gap-2">
            {links.map((link) => (
              <FooterLinkItem key={link.href} {...link} />
            ))}
          </nav>
        </div>

        {/* explore */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <h2 className="text-h2 text-primary">{explore.heading}</h2>
          <a
            href={explore.href}
            {...externalLinkProps(explore.href)}
            className="group relative block aspect-[843/366] overflow-hidden rounded-xl bg-surface"
          >
            {explore.image ? (
              <Image
                src={explore.image}
                alt={explore.imageAlt ?? ""}
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                className="object-cover"
              />
            ) : null}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: SCRIM }}
            />
            <span className="absolute bottom-6 left-6 text-h3 text-white">
              {explore.title}
            </span>
          </a>
        </div>
      </div>

      {/* bottom meta — 3 equal columns, left / center / right */}
      <div className="grid grid-cols-1 gap-2 pt-12 text-caption text-secondary md:grid-cols-3 md:gap-8 md:pt-16">
        <p>{meta.copyright}</p>
        <p className="md:text-center">{meta.built}</p>
        <p className="md:text-right">
          <FooterClock location={meta.location} />
        </p>
      </div>
    </footer>
  );
}

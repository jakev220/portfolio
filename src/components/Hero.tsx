import Image from "next/image";
import { HeroFolder } from "@/components/HeroFolder";

export interface HeroLink {
  /** Visible link text (the trailing ↗ is added by the component). */
  label: string;
  /** Destination. */
  href: string;
}

export interface HeroSubItem {
  /** Sentence text up to (not including) the link. */
  prefix: string;
  /** The linked phrase within the sentence. */
  link: HeroLink;
  /** Trailing punctuation after the link (e.g. "."). */
  suffix?: string;
}

export interface HeroProps {
  /** Name shown first, emphasized. */
  name: string;
  /** Connector copy between name and role (e.g. "is a"). */
  lead: string;
  /** Role phrase, emphasized. */
  role: string;
  /** Two display lines of supporting copy. */
  tagline: [string, string];
  /** "Currently …" line. */
  current: HeroSubItem;
  /** "Previously …" line. */
  previous: HeroSubItem;
  /** Optional avatar image; falls back to a neutral placeholder. */
  avatarSrc?: string;
  /** Alt text for the avatar. */
  avatarAlt?: string;
}

/** Avatar slot — 40px circle. Placeholder surface until a photo is provided. */
function HeroAvatar({ src, alt }: { src?: string; alt?: string }) {
  return (
    <span className="inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface align-middle">
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      ) : null}
    </span>
  );
}

/**
 * Subhero sentence with a single inline accent link. The link styling mirrors
 * the case-study cards and will be replaced by the shared Link component later.
 */
function SubheroLine({ prefix, link, suffix }: HeroSubItem) {
  return (
    <p>
      {prefix}{" "}
      <a
        href={link.href}
        className="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
      >
        {link.label}
        <span aria-hidden> ↗</span>
      </a>
      {suffix}
    </p>
  );
}

/**
 * Home-page hero. Content arrives via props (no hardcoded copy). Static for now;
 * the avatar and folder micro-interactions are layered on in a later pass.
 */
export function Hero({
  name,
  lead,
  role,
  tagline,
  current,
  previous,
  avatarSrc,
  avatarAlt,
}: HeroProps) {
  return (
    <section className="flex flex-col gap-4 pt-16">
      {/* hero text — semantic h1, visually text-h2 */}
      <h1 className="text-h2">
        <span className="flex flex-wrap items-center gap-x-[7px] gap-y-1">
          <span className="text-primary">{name}</span>
          <HeroAvatar src={avatarSrc} alt={avatarAlt} />
          <span className="text-secondary">{lead}</span>
          <HeroFolder role={role} />
        </span>
        <span className="block text-secondary">{tagline[0]}</span>
        <span className="block text-secondary">{tagline[1]}</span>
      </h1>

      {/* subhero */}
      <div className="text-body text-secondary">
        <SubheroLine {...current} />
        <SubheroLine {...previous} />
      </div>
    </section>
  );
}

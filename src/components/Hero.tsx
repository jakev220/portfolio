import { HeroAvatar, type AvatarImage } from "@/components/HeroAvatar";
import { HeroFolder } from "@/components/HeroFolder";
import { externalLinkProps, isExternalHref } from "@/lib/links";

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
  /** Avatar cycle frames; first is the resting image. Empty → placeholder. */
  avatarImages?: AvatarImage[];
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
        {...externalLinkProps(link.href)}
        className="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
      >
        {link.label}
        {isExternalHref(link.href) && <span aria-hidden> ↗</span>}
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
  avatarImages,
}: HeroProps) {
  return (
    <section className="flex flex-col gap-4 pt-16 pb-32 md:pb-48">
      {/* hero text — semantic h1, visually text-h2 */}
      <h1 className="text-h2">
        <span className="flex flex-wrap items-center gap-x-[7px] gap-y-1">
          <HeroAvatar name={name} images={avatarImages} />
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

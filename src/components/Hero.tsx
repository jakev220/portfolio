"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroAvatar, type AvatarImage } from "@/components/HeroAvatar";
import { HeroFolder } from "@/components/HeroFolder";
import { externalLinkProps, isExternalHref } from "@/lib/links";
import {
  EXIT_EASE,
  HOME_EXIT_EVENT,
  HOME_EXIT_MS,
} from "@/lib/about-transition";

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

function ExitFade({
  play,
  children,
  className,
}: {
  play: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      animate={{ opacity: play ? 0 : 1 }}
      transition={{
        duration: play ? HOME_EXIT_MS / 1000 : 0,
        ease: EXIT_EASE,
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Home-page hero. Eases in on first paint via CSS (same 0.85s fade/rise as the
 * About greeting) so refresh doesn’t wait on hydration. On the name→About
 * transition, surrounding copy fades out while the avatar reel rises and fades
 * on its own timeline.
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
  const reduceMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const onExit = () => setExiting(true);
    window.addEventListener(HOME_EXIT_EVENT, onExit);
    return () => window.removeEventListener(HOME_EXIT_EVENT, onExit);
  }, []);

  const play = exiting && !reduceMotion;

  return (
    <section className="hero-enter flex flex-col gap-4 pt-16 pb-32 md:pb-48">
      {/* hero text — semantic h1, visually text-h2 */}
      <h1 className="text-h2">
        <span className="flex flex-wrap items-center gap-x-[7px] gap-y-1">
          <HeroAvatar name={name} images={avatarImages} />
          <ExitFade play={play} className="text-secondary">
            {lead}
          </ExitFade>
          <ExitFade play={play}>
            <HeroFolder role={role} />
          </ExitFade>
        </span>
        <ExitFade play={play} className="block text-secondary">
          {tagline[0]}
        </ExitFade>
        <ExitFade play={play} className="block text-secondary">
          {tagline[1]}
        </ExitFade>
      </h1>

      {/* subhero */}
      <motion.div
        className="text-body text-secondary"
        animate={{ opacity: play ? 0 : 1 }}
        transition={{
          duration: play ? HOME_EXIT_MS / 1000 : 0,
          ease: EXIT_EASE,
        }}
      >
        <SubheroLine {...current} />
        <SubheroLine {...previous} />
      </motion.div>
    </section>
  );
}

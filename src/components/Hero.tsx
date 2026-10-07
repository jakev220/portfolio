"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CursorFollowPreview } from "@/components/CursorFollowPreview";
import { HeroAvatar, type AvatarImage } from "@/components/HeroAvatar";
import { HeroFolder } from "@/components/HeroFolder";
import { Link } from "@/components/Link";
import { SmartImage } from "@/components/SmartImage";
import {
  EXIT_EASE,
  HOME_EXIT_EVENT,
  HOME_EXIT_MS,
} from "@/lib/about-transition";

export interface HeroLink {
  /** Visible link text (trailing → / ↗ added by `Link`). */
  label: string;
  /** Destination. Omit when `disabled` — nothing to navigate to yet. */
  href?: string;
  /**
   * Non-navigating in-site link (trailing `→`). Pair with `previewLabel` for
   * a “work in progress” cursor-follow frame.
   */
  disabled?: boolean;
  /**
   * Optional single still for a cursor-follow preview on fine-pointer hover
   * (e.g. case-study cover). Decorative; omit for a plain text link.
   */
  previewImage?: string;
  /**
   * Empty cursor-follow frame with this label centered (e.g. “Work in
   * progress”). Ignored when `previewImage` is set.
   */
  previewLabel?: string;
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

/** Subhero sentence with a single inline accent link (`→` in-site, `↗` out). */
function SubheroLine({ prefix, link, suffix }: HeroSubItem) {
  const hoverCapable = useRef(false);
  const [visible, setVisible] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });

  const previewImage = link.previewImage;
  const previewLabel = previewImage ? undefined : link.previewLabel;
  const hasPreview = Boolean(previewImage || previewLabel);

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const showPreview = () => {
    if (!hasPreview || !hoverCapable.current) return;
    setVisible(true);
  };
  const trackCursor = (event: MouseEvent) => {
    if (!hasPreview || !hoverCapable.current) return;
    setPoint({ x: event.clientX, y: event.clientY });
  };
  const hidePreview = () => setVisible(false);

  return (
    <p>
      {prefix}{" "}
      <span
        className="whitespace-nowrap"
        onMouseEnter={showPreview}
        onMouseMove={trackCursor}
        onMouseLeave={hidePreview}
      >
        <Link href={link.href} disabled={link.disabled}>
          {link.label}
        </Link>
        {suffix}
      </span>
      {hasPreview ? (
        <CursorFollowPreview visible={visible} point={point} placement="right">
          {previewImage ? (
            <SmartImage
              src={previewImage}
              alt=""
              fill
              sizes="240px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4">
              <p className="text-label text-secondary m-0 text-center">
                {previewLabel}
              </p>
            </div>
          )}
        </CursorFollowPreview>
      ) : null}
    </p>
  );
}

function ExitFade({
  play,
  children,
  className,
  style,
}: {
  play: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.span
      className={className}
      style={style}
      // Avoid a mount opacity tween fighting the CSS `.hero-enter` fade.
      initial={false}
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
 *
 * Tagline lines are authored as a pair and rendered with a hard break — avoids
 * the post-hydration wrap snap from measuring a fluid max-width.
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
    <section className="hero-enter flex flex-col gap-4 pt-8 pb-32 md:pt-16 md:pb-48 lg:pt-0 lg:pb-0">
      <h1 className="text-h2 max-w-2xl">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
          <br />
          {tagline[1]}
        </ExitFade>
      </h1>

      {/* subhero */}
      <motion.div
        className="text-body text-secondary"
        initial={false}
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

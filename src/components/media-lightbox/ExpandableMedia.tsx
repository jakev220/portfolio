"use client";

import { useEffect, useId, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { useMediaLightbox } from "@/components/media-lightbox/MediaLightboxProvider";
import type { LightboxMediaItem } from "@/components/media-lightbox/types";

export interface ExpandableMediaProps {
  /** Still image path. Ignored when `video` is set. */
  src?: string;
  video?: string;
  poster?: string;
  alt?: string;
  /** Visible lightbox caption; falls back to `alt`. */
  caption?: string;
  /**
   * When true, fills the parent (absolute inset-0) — for aspect-locked /
   * cover media. Otherwise wraps in-flow media (images with intrinsic height).
   */
  fill?: boolean;
  children: ReactNode;
}

/**
 * Hover (or always-on touch) expand control. Clicking the media or the expand
 * icon opens the page media lightbox.
 */
export function ExpandableMedia({
  src,
  video,
  poster,
  alt = "",
  caption,
  fill = false,
  children,
}: ExpandableMediaProps) {
  const id = useId();
  const { register, open } = useMediaLightbox();
  const hasMedia = Boolean(video || src);

  useEffect(() => {
    if (!hasMedia) return;
    const item: LightboxMediaItem = {
      id,
      src,
      video,
      poster,
      alt,
      caption,
    };
    return register(item);
  }, [hasMedia, id, src, video, poster, alt, caption, register]);

  if (!hasMedia) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => open(id)}
      aria-label={alt ? `Expand: ${alt}` : "Expand media"}
      className={`group cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        fill ? "absolute inset-0" : "relative block w-full"
      }`}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-border bg-lightbox-panel p-2 text-cs-ink opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 sm:right-4 sm:top-4"
      >
        <Icon name="expand" size={20} />
      </span>
    </button>
  );
}

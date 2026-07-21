import { AboutPhotoStrip } from "@/components/about/AboutPhotoStrip";
import type { AvatarImage } from "@/components/HeroAvatar";

export interface AboutHeaderProps {
  /** Intro headline beneath the photo strip. */
  intro: string;
  /** Four portrait frames (shared with the home hero avatar cycle). */
  photos: AvatarImage[];
}

/**
 * About page header: 4-across photo strip + full-width intro headline.
 * 64px gap between strip and copy matches the Figma header container.
 */
export function AboutHeader({ intro, photos }: AboutHeaderProps) {
  return (
    <header className="flex flex-col gap-16">
      <AboutPhotoStrip photos={photos} />
      <h1 className="text-h2 text-primary">{intro}</h1>
    </header>
  );
}

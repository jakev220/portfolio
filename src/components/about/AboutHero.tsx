import { AboutHeroCollage } from "@/components/about/AboutHeroCollage";
import type { AboutGreeting, AboutHeroPhoto } from "@/content/about";

export interface AboutHeroProps {
  greeting: AboutGreeting;
  photos: AboutHeroPhoto[];
}

/**
 * About hero: greeting on a 4-col rail, photo collage on a 6-col rail
 * (cols 7–12), with a 2-col gutter between — 12-col / 16px gap system.
 *
 * Entrance is CSS (`.about-hero-tile-*` / `.about-hero-greeting`) so refresh
 * and soft nav both start on first paint — same approach as the home hero.
 */
export function AboutHero({ greeting, photos }: AboutHeroProps) {
  return (
    <header className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-4">
      <div className="about-hero-greeting flex flex-col gap-0 md:col-span-4">
        <p className="text-h2 text-primary m-0">{greeting.primary}</p>
        <p className="text-h2 text-secondary m-0">{greeting.secondary}</p>
      </div>
      <div className="md:col-span-6 md:col-start-7">
        <AboutHeroCollage photos={photos} />
      </div>
    </header>
  );
}

import { AboutHeroCollage } from "@/components/about/AboutHeroCollage";
import type { AboutGreeting, AboutHeroPhoto } from "@/content/about";

export interface AboutHeroProps {
  greeting: AboutGreeting;
  photos: AboutHeroPhoto[];
}

/**
 * About hero: greeting on a 4-col rail, photo collage on a 7-col rail
 * (cols 6–12), with a 1-col gutter between — shared 4 / 1 / 7 grid.
 *
 * Entrance is CSS (`.about-hero-tile-*` / `.about-hero-greeting`) so refresh
 * and soft nav both start on first paint — same approach as the home hero.
 */
export function AboutHero({ greeting, photos }: AboutHeroProps) {
  return (
    <header className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-4">
      <div className="about-hero-greeting flex min-w-0 flex-col gap-0 lg:col-span-4">
        <p className="text-h2 text-primary m-0">{greeting.primary}</p>
        <p className="text-h2 text-secondary m-0">{greeting.secondary}</p>
      </div>
      <div className="min-w-0 lg:col-span-7 lg:col-start-6">
        <AboutHeroCollage photos={photos} />
      </div>
    </header>
  );
}

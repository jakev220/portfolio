import Image from "next/image";
import { ExpandableMedia } from "@/components/media-lightbox/ExpandableMedia";

export interface CaseStudyHeaderProps {
  /** Large primary heading — the project / product name (e.g. "ScienceJury"). */
  name: string;
  /** Secondary subtitle beneath the name — the descriptive headline. */
  title: string;
  /** Optional cover image path; omitted renders the neutral surface placeholder. */
  coverImage?: string;
}

/**
 * Frontmatter-driven case-study header. Spans all 12 columns with a title
 * block, wide cover media (rounded) or neutral placeholder, then a divider.
 * The project-details meta + brief live in a separate `<ProjectDetails>` MDX
 * section beneath the header.
 *
 * Accessibility: `name` is the page's single `<h1>`; the descriptive `title`
 * is paired with it via `<hgroup>` as a subheading (rather than a second
 * heading). The route also feeds `title`/`description` into the document
 * `<title>` + meta description for screen-reader page naming and SEO.
 *
 * Spacing maps Figma item-spacing to Tailwind defaults (32 / 8 → gap-8 / gap-2).
 */
export function CaseStudyHeader({ name, title, coverImage }: CaseStudyHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-6 sm:gap-8">
      <hgroup className="flex min-w-0 flex-col gap-2">
        <h1 className="text-h1 text-primary break-words">{name}</h1>
        {title ? <p className="text-h2 break-words">{title}</p> : null}
      </hgroup>

      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface sm:aspect-[1024/500]">
        {coverImage ? (
          <ExpandableMedia src={coverImage} alt={name} caption={name} fill>
            <Image
              src={coverImage}
              alt={name}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1280px) 1232px, calc(100vw - 48px)"
            />
          </ExpandableMedia>
        ) : null}
      </div>

      <hr className="border-divider" />
    </header>
  );
}

import Image from "next/image";
import { Button } from "@/components/Button";
import { ExpandableMedia } from "@/components/media-lightbox/ExpandableMedia";
import type { CaseStudyTone } from "@/lib/case-study-palette";

export interface CaseStudyHeaderProps {
  /** Large primary heading — the project / product name (e.g. "ScienceJury"). */
  name: string;
  /** Secondary subtitle beneath the name — the descriptive headline. */
  title: string;
  /** Optional cover image path; omitted renders the neutral surface placeholder. */
  coverImage?: string;
  /**
   * Optional skip CTA (e.g. "Skip to final design").
   * Rendered only when both `skipLabel` and `skipHref` are set.
   * Anchored to the bottom-right of the subtitle row at `lg+`.
   * Hash targets smooth-scroll (instant when reduced motion).
   */
  skipLabel?: string;
  /** Target for the skip CTA (typically a section id, e.g. `#solution`). */
  skipHref?: string;
  /** Case-study palette tone for the skip button (`purple`, `orange`, …). */
  skipTone?: CaseStudyTone;
}

/**
 * Frontmatter-driven case-study header. Full-width project name, then a row
 * with descriptive subtitle on an 8-col band and an optional skip CTA anchored
 * bottom-right at `lg+`. Cover media (rounded) or neutral placeholder, then a
 * divider. Project-details meta + brief live in a separate `<ProjectDetails>`
 * MDX section beneath the header.
 *
 * Accessibility: `name` is the page's single `<h1>`; the descriptive `title`
 * sits directly beneath as a subheading (not a second heading level). The
 * route also feeds `title`/`description` into the document `<title>` + meta
 * description for screen-reader page naming and SEO.
 *
 * Spacing maps Figma item-spacing to the case-study stack rhythm
 * (`gap-12` / `sm:gap-16` at the header block).
 */
export function CaseStudyHeader({
  name,
  title,
  coverImage,
  skipLabel,
  skipHref,
  skipTone,
}: CaseStudyHeaderProps) {
  const showSkip = Boolean(skipLabel && skipHref);

  return (
    <header className="flex min-w-0 flex-col gap-12 sm:gap-16">
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-h1 text-primary break-words">{name}</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-4">
          <div className="min-w-0 lg:col-span-8">
            {title ? <p className="text-h2 break-words">{title}</p> : null}
          </div>

          {showSkip ? (
            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <Button
                href={skipHref}
                variant="primary"
                tone={skipTone}
                size="lg"
                icon="arrow-down"
                iconPosition="end"
              >
                {skipLabel}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

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

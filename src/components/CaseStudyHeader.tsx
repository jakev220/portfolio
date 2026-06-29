import Image from "next/image";

export interface CaseStudyHeaderProps {
  /** Large primary heading — the project / product name (e.g. "ScienceJury"). */
  name: string;
  /** Secondary subtitle beneath the name — the descriptive headline. */
  title: string;
  /** Optional cover image path; omitted renders the neutral surface placeholder. */
  coverImage?: string;
}

/**
 * Frontmatter-driven case-study header. Matches the Figma "header" frame at
 * 1024px: a title block (name + descriptive subtitle), cover media (1024×500,
 * rounded) or a neutral placeholder, then a divider. The project-details meta
 * + brief live in a separate `<ProjectDetails>` MDX section beneath the header.
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
    <header className="flex flex-col gap-8">
      <hgroup className="flex flex-col gap-2">
        <h1 className="text-h1 text-primary">{name}</h1>
        {title ? <p className="text-h2">{title}</p> : null}
      </hgroup>

      <div className="relative aspect-[1024/500] overflow-hidden rounded-xl bg-surface">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        ) : null}
      </div>

      <hr className="border-divider" />
    </header>
  );
}

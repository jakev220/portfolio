import Image from "next/image";

/** View states for the home-page work section. `inline` is not implemented yet. */
export type CaseStudyCardVariant = "stack" | "card" | "inline";

export interface CaseStudyCardProps {
  /** Short project name shown in the preheader. */
  name: string;
  /** Optional affiliation/client shown after the project name. */
  affiliation?: string;
  /** Year shown at the right edge of the preheader. */
  year: string;
  /** Large display title. */
  title: string;
  /** Supporting description paragraph. */
  description: string;
  /** Destination for the card's link (e.g. the case study page). */
  href: string;
  /** Visible link text (no hardcoded copy — comes from content). */
  linkLabel: string;
  /** Optional cover image path; falls back to an empty surface placeholder. */
  coverImage?: string;
  /** Alt text for the cover image. */
  coverAlt?: string;
  /** Layout state. Defaults to `stack`. */
  variant?: CaseStudyCardVariant;
}

export function CaseStudyCard({
  name,
  affiliation,
  year,
  title,
  description,
  href,
  linkLabel,
  coverImage,
  coverAlt,
  variant = "stack",
}: CaseStudyCardProps) {
  // Shared content block (identical across variants): preheader, title,
  // description, then the link. Gaps match the Figma (24 / 16 / 8).
  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* preheader */}
        <div className="flex items-center gap-2 text-label text-secondary">
          <span>{name}</span>
          {affiliation ? (
            <>
              <span aria-hidden className="size-1 shrink-0 rounded-full bg-secondary" />
              <span className="flex-1">{affiliation}</span>
            </>
          ) : null}
          <span className={affiliation ? "" : "ml-auto"}>{year}</span>
        </div>

        {/* title — visual h2, semantic h3 (subordinate to the work section heading) */}
        <h3 className="text-h2 text-primary">{title}</h3>

        {/* description */}
        <p className="text-body text-primary">{description}</p>
      </div>

      {/* link container — plain anchor for now; the Link component will add
          next/link + internal/external handling and own the trailing glyph. */}
      <div className="flex gap-6">
        <a
          href={href}
          className="inline-flex items-center gap-1 text-body text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
        >
          {linkLabel}
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );

  // Media box. Aspect ratio differs per variant (stack is wide, card is squarer).
  const renderMedia = (aspectClassName: string, sizes: string) => (
    <div
      className={`relative ${aspectClassName} overflow-hidden rounded-xl bg-surface`}
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={coverAlt ?? title}
          fill
          className="object-cover"
          sizes={sizes}
        />
      ) : null}
    </div>
  );

  // card: vertical — media on top, content below (32px gap).
  if (variant === "card") {
    return (
      <article className="flex flex-col gap-8">
        {renderMedia("aspect-[608/540]", "(min-width: 1024px) 50vw, 100vw")}
        {content}
      </article>
    );
  }

  // stack (default): content (~1/3) beside media (~2/3) on large screens,
  // stacked on small screens. `inline` falls back here until implemented.
  return (
    <article className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-1">{content}</div>
      <div className="lg:col-span-2">
        {renderMedia("aspect-[842/540]", "(min-width: 1024px) 66vw, 100vw")}
      </div>
    </article>
  );
}

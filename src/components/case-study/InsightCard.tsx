import type { ReactNode } from "react";
import type { CaseStudyTone } from "@/lib/case-study-palette";
import type { TypographyToken } from "@/lib/tokens";

/** Shorthand aliases kept for existing MDX; prefer a typography token. */
type CalloutSizeAlias = "title" | "heading" | "body";

export type CalloutSize = TypographyToken | CalloutSizeAlias;

export interface CalloutFieldsProps {
  /**
   * Bold h1 glyph at the top. Use "→", '"', "!", or "*". Omit for a
   * text-only callout.
   */
  glyph?: string;
  /** Optional line above the main statement. */
  preText?: string;
  /** Optional line below (e.g. attribution or follow-on). */
  postText?: string;
  /**
   * Type size for the main callout. Any design-system text token
   * (`h1`–`h3`, `body`, `callout-title`, …) or the aliases `title` /
   * `heading` / `body` (→ callout fluid scale). Defaults to `body`.
   */
  size?: CalloutSize;
  children: ReactNode;
}

export interface InsightCardProps extends CalloutFieldsProps {
  /** Palette fill — maps to `--cs-*` on the case-study article. */
  tone?: CaseStudyTone;
  /**
   * Minimum card height. `"240"` → 200px on small screens, 240px at lg+
   * (Figma formative / insight card fill height).
   */
  minHeight?: "240";
}

export interface InsightCardGridProps {
  /** `row` — equal cards in a horizontal row. `stack` — full-width vertical. */
  layout?: "row" | "stack";
  children: ReactNode;
}

const toneClass: Record<CaseStudyTone, string> = {
  lavender: "bg-cs-lavender",
  orange: "bg-cs-orange",
  yellow: "bg-cs-yellow",
  blue: "bg-cs-blue",
  purple: "bg-cs-purple",
};

const aliasToToken: Record<CalloutSizeAlias, TypographyToken> = {
  title: "callout-title",
  heading: "callout-heading",
  body: "callout-body",
};

/**
 * Static map so Tailwind JIT can see every `text-*` class. Nested MDX `<p>`
 * tags are forced to the same size so `text-body` from the MDX map can't win.
 */
const sizeClass: Record<TypographyToken, string> = {
  caption: "text-caption [&_p]:text-caption [&_p]:leading-[inherit]",
  label: "text-label [&_p]:text-label [&_p]:leading-[inherit]",
  body: "text-body [&_p]:text-body [&_p]:leading-[inherit]",
  h3: "text-h3 [&_p]:text-h3 [&_p]:leading-[inherit]",
  h2: "text-h2 [&_p]:text-h2 [&_p]:leading-[inherit]",
  h1: "text-h1 [&_p]:text-h1 [&_p]:leading-[inherit]",
  "callout-title":
    "text-callout-title [&_p]:text-callout-title [&_p]:leading-[inherit]",
  "callout-heading":
    "text-callout-heading [&_p]:text-callout-heading [&_p]:leading-[inherit]",
  "callout-body":
    "text-callout-body [&_p]:text-callout-body [&_p]:leading-[inherit]",
};

function resolveSize(size: CalloutSize): TypographyToken {
  if (size in aliasToToken) {
    return aliasToToken[size as CalloutSizeAlias];
  }
  return size as TypographyToken;
}

/**
 * Shared callout content stack used by insight cards and the full-bleed
 * banner: glyph → pre-text → callout → post-text.
 *
 * Glyph sits flush on the pre-text (0 gap; glyph uses `leading-none`).
 * Pre and callout are one body line apart (`gap-4`). Post-text (e.g. quote
 * attribution) uses `mt-auto` so it pins to the bottom when the card fills
 * height — matching Figma's auto spacing between callout and author.
 */
export function CalloutFields({
  glyph,
  preText,
  postText,
  size = "body",
  children,
}: CalloutFieldsProps) {
  const token = resolveSize(size);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {glyph ? (
        <p className="text-h1 m-0 font-bold leading-none" aria-hidden>
          {glyph}
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {preText ? <p className="text-body m-0">{preText}</p> : null}
        <div
          className={`m-0 ${sizeClass[token]} [&_em]:italic [&_p]:m-0 [&_p+p]:mt-4 [&_strong]:font-bold`}
        >
          {children}
        </div>
        {postText ? (
          <p className="text-body m-0 mt-auto pt-4">{postText}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Colored insight / quote / problem card. One polymorphic surface for the
 * formative and results card grids — tone, glyph, and type size vary by use.
 */
const minHeightClass = {
  "240": "min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]",
} as const;

export function InsightCard({
  tone = "orange",
  glyph,
  size = "body",
  preText,
  postText,
  minHeight,
  children,
}: InsightCardProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col rounded-xl px-3 pb-6 pt-3 text-cs-ink [&_strong]:text-cs-ink ${toneClass[tone]} ${
        minHeight ? minHeightClass[minHeight] : "min-h-0"
      }`}
    >
      <CalloutFields
        glyph={glyph}
        preText={preText}
        postText={postText}
        size={size}
      >
        {children}
      </CalloutFields>
    </div>
  );
}

/**
 * Lays out `InsightCard` children. `row` distributes them across equal columns
 * once the container is wide enough; `stack` keeps them full-width.
 */
export function InsightCardGrid({
  layout = "row",
  children,
}: InsightCardGridProps) {
  if (layout === "stack") {
    return <div className="flex flex-col gap-4">{children}</div>;
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      {children}
    </div>
  );
}

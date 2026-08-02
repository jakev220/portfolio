import type { CaseStudyTone } from "@/lib/case-study-palette";
import {
  CalloutFields,
  type CalloutFieldsProps,
} from "@/components/case-study/InsightCard";

export interface FullBleedBannerProps extends CalloutFieldsProps {
  /** Palette tone — maps to `--cs-*` on the case-study article. */
  tone?: CaseStudyTone;
}

const toneClass: Record<CaseStudyTone, string> = {
  lavender: "bg-cs-lavender",
  orange: "bg-cs-orange",
  yellow: "bg-cs-yellow",
  blue: "bg-cs-blue",
  purple: "bg-cs-purple",
};

/**
 * Edge-to-edge case-study band. Same callout structure as `InsightCard`
 * (glyph → pre-text → callout → post-text), but breaks out of the article
 * shell to the viewport while keeping text inside the shared 12-col / 80px
 * padded content grid.
 */
export function FullBleedBanner({
  tone = "lavender",
  glyph,
  preText,
  postText,
  size = "callout-title",
  children,
}: FullBleedBannerProps) {
  return (
    <div
      className={`relative left-1/2 w-screen -translate-x-1/2 ${toneClass[tone]}`}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:py-32">
        <div className="text-cs-ink [&_strong]:text-cs-ink">
          <CalloutFields
            glyph={glyph}
            preText={preText}
            postText={postText}
            size={size}
          >
            {children}
          </CalloutFields>
        </div>
      </div>
    </div>
  );
}

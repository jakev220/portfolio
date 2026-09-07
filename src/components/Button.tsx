import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import type { CaseStudyTone } from "@/lib/case-study-palette";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "plain"
  | "tinted";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Visual role. Matches Apple HIG / alert patterns:
   * - `primary` — filled accent (filled)
   * - `secondary` — gray fill, primary label (gray)
   * - `destructive` — gray fill, red label
   * - `plain` — no fill, accent label
   * - `tinted` — soft accent fill, accent label
   */
  variant?: ButtonVariant;
  /**
   * Case-study palette tone for `primary` / `plain` / `tinted` fills and
   * labels (`--cs-*`). Omit to use the site accent blue. Secondary and
   * destructive ignore tone.
   */
  tone?: CaseStudyTone;
  /** Touch-friendly sizes; `md` is 48px, `lg` is 56px (Apple alert-like). */
  size?: ButtonSize;
  /** Optional icon from the site `Icon` registry. */
  icon?: IconName;
  /** Icon placement relative to the label. Ignored when `iconOnly`. */
  iconPosition?: "start" | "end";
  /**
   * Renders a square capsule with only the icon. Requires `aria-label`
   * (or `title`) for accessibility.
   */
  iconOnly?: boolean;
  /** Stretch to the parent width (alert / form footers). */
  fullWidth?: boolean;
  /**
   * When set, renders a Next.js `Link` with the same styles (for CTAs).
   * `disabled` becomes non-interactive + `aria-disabled`.
   */
  href?: string;
  /** Label text / nodes. Omit when `iconOnly`. */
  children?: ReactNode;
}

const stateClass =
  "hover:opacity-90 active:opacity-80 disabled:opacity-40";

const variantClass: Record<ButtonVariant, string> = {
  primary: `bg-accent text-white focus-visible:outline-accent ${stateClass}`,
  secondary: `bg-[color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] text-primary focus-visible:outline-accent ${stateClass}`,
  destructive: `bg-[color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] text-destructive focus-visible:outline-destructive ${stateClass}`,
  plain: `bg-transparent text-accent focus-visible:outline-accent hover:opacity-70 active:opacity-60 disabled:opacity-40`,
  tinted: `bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-accent focus-visible:outline-accent ${stateClass}`,
};

/** Filled primary using a case-study `--cs-*` tone (+ contrasting ink). */
const tonePrimaryClass: Record<CaseStudyTone, string> = {
  lavender: `bg-cs-lavender text-cs-ink focus-visible:outline-cs-lavender ${stateClass}`,
  orange: `bg-cs-orange text-cs-ink focus-visible:outline-cs-orange ${stateClass}`,
  yellow: `bg-cs-yellow text-cs-ink focus-visible:outline-cs-yellow ${stateClass}`,
  blue: `bg-cs-blue text-cs-ink focus-visible:outline-cs-blue ${stateClass}`,
  purple: `bg-cs-purple text-white focus-visible:outline-cs-purple ${stateClass}`,
};

const tonePlainClass: Record<CaseStudyTone, string> = {
  lavender: `bg-transparent text-cs-lavender focus-visible:outline-cs-lavender hover:opacity-70 active:opacity-60 disabled:opacity-40`,
  orange: `bg-transparent text-cs-orange focus-visible:outline-cs-orange hover:opacity-70 active:opacity-60 disabled:opacity-40`,
  yellow: `bg-transparent text-cs-yellow focus-visible:outline-cs-yellow hover:opacity-70 active:opacity-60 disabled:opacity-40`,
  blue: `bg-transparent text-cs-blue focus-visible:outline-cs-blue hover:opacity-70 active:opacity-60 disabled:opacity-40`,
  purple: `bg-transparent text-cs-purple focus-visible:outline-cs-purple hover:opacity-70 active:opacity-60 disabled:opacity-40`,
};

const toneTintedClass: Record<CaseStudyTone, string> = {
  lavender: `bg-[color-mix(in_srgb,var(--cs-lavender)_28%,transparent)] text-cs-ink focus-visible:outline-cs-lavender ${stateClass}`,
  orange: `bg-[color-mix(in_srgb,var(--cs-orange)_22%,transparent)] text-cs-ink focus-visible:outline-cs-orange ${stateClass}`,
  yellow: `bg-[color-mix(in_srgb,var(--cs-yellow)_35%,transparent)] text-cs-ink focus-visible:outline-cs-yellow ${stateClass}`,
  blue: `bg-[color-mix(in_srgb,var(--cs-blue)_25%,transparent)] text-cs-ink focus-visible:outline-cs-blue ${stateClass}`,
  purple: `bg-[color-mix(in_srgb,var(--cs-purple)_15%,transparent)] text-cs-purple focus-visible:outline-cs-purple ${stateClass}`,
};

function resolveVariantClass(
  variant: ButtonVariant,
  tone?: CaseStudyTone,
): string {
  if (!tone) return variantClass[variant];
  if (variant === "primary") return tonePrimaryClass[tone];
  if (variant === "plain") return tonePlainClass[tone];
  if (variant === "tinted") return toneTintedClass[tone];
  return variantClass[variant];
}

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-10 gap-1.5 px-4 text-body-large",
  md: "h-12 gap-2 px-5 text-body-large",
  lg: "h-14 gap-2.5 px-6 text-body-large",
};

const iconOnlySizeClass: Record<ButtonSize, string> = {
  sm: "size-10 p-0",
  md: "size-12 p-0",
  lg: "size-14 p-0",
};

const iconPx: Record<ButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 22,
};

/**
 * Apple-inspired capsule button. Labels and icons come from props (no
 * hardcoded copy). Optional `tone` tints primary/plain/tinted from the
 * case-study `--cs-*` palette. Use `href` for navigation CTAs; otherwise a
 * native `<button>`. Icon-only buttons must supply an accessible name.
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/buttons
 */
export function Button({
  variant = "primary",
  tone,
  size = "md",
  icon,
  iconPosition = "start",
  iconOnly = false,
  fullWidth = false,
  href,
  type = "button",
  disabled = false,
  className = "",
  children,
  "aria-label": ariaLabel,
  ...rest
}: ButtonProps) {
  if (iconOnly && !ariaLabel && !rest.title) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Button: iconOnly requires aria-label (or title) for accessibility.",
      );
    }
  }

  const classes = [
    "inline-flex shrink-0 items-center justify-center rounded-full transition-opacity",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none",
    resolveVariantClass(variant, tone),
    iconOnly ? iconOnlySizeClass[size] : sizeClass[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconNode = icon ? (
    <Icon name={icon} size={iconPx[size]} aria-hidden />
  ) : null;

  const content = iconOnly ? (
    iconNode
  ) : (
    <>
      {icon && iconPosition === "start" ? iconNode : null}
      {children ? <span className="min-w-0 truncate">{children}</span> : null}
      {icon && iconPosition === "end" ? iconNode : null}
    </>
  );

  if (href) {
    if (disabled) {
      return (
        <span
          className={`${classes} pointer-events-none cursor-not-allowed opacity-40`}
          aria-disabled="true"
          aria-label={ariaLabel}
          role="link"
        >
          {content}
        </span>
      );
    }

    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      {...rest}
    >
      {content}
    </button>
  );
}

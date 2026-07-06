import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

export interface CalloutProps {
  /** Eyebrow label above the heading (e.g. "Core design challenge"). */
  label?: string;
  children: ReactNode;
}

export interface CalloutHeadingProps {
  /**
   * `title` — large callout headline (fluid h2→h1). `heading` — section-scale
   * headline (fluid h3→h2). Defaults to `title`.
   */
  size?: "title" | "heading";
  children: ReactNode;
}

const calloutHeadingSizeClass = {
  title: "text-callout-title [&_p]:text-callout-title",
  heading: "text-callout-heading [&_p]:text-callout-heading",
} as const;

/**
 * Content-only slot for a callout headline. `Callout` wraps the children in the
 * styled container (like `SplitHeading` → `Split`) so MDX block paragraphs
 * inside multiline JSX don't pick up the global `p` → `text-body` mapping.
 */
export function CalloutHeading({ children }: CalloutHeadingProps) {
  return <>{children}</>;
}

export function isCalloutHeading(
  child: ReturnType<typeof Children.toArray>[number],
): child is ReactElement<CalloutHeadingProps> {
  return isValidElement(child) && child.type === CalloutHeading;
}

/**
 * Full-width dark callout card for case-study emphasis blocks. Always renders
 * with a fixed dark palette (`.callout` scope in globals.css), independent of
 * the site light/dark theme. Padding and headline type scale fluidly with
 * viewport (see `.callout` in globals.css); stacks body slots below the label
 * + heading group with a fluid gap matching callout padding (up to 64px).
 */
export function Callout({ label, children }: CalloutProps) {
  const childArray = Children.toArray(children);
  const headingEl = childArray.find(isCalloutHeading);
  const rest = childArray.filter(
    (child) =>
      !isCalloutHeading(child) &&
      !(typeof child === "string" && child.trim() === ""),
  );

  const hasHeader = label || headingEl;

  return (
    <div className="callout flex w-full flex-col gap-[var(--callout-gap)] rounded-xl">
      {hasHeader ? (
        <div className="flex flex-col gap-2.5">
          {label ? (
            <p className="text-label m-0 text-callout-muted">{label}</p>
          ) : null}
          {headingEl ? (
            <div
              className={`m-0 ${calloutHeadingSizeClass[headingEl.props.size ?? "title"]} [&_p]:m-0`}
            >
              {headingEl.props.children}
            </div>
          ) : null}
        </div>
      ) : null}
      {rest}
    </div>
  );
}

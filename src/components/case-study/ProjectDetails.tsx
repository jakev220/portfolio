import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

export interface DetailProps {
  /** Group label (e.g. "Timeline", "Team", "Venue"). */
  label: string;
  /**
   * The value(s). Inline text and components (e.g. `<Subtle>`) stay on one line;
   * separate the value into blank-line-delimited paragraphs in MDX to stack
   * multiple lines (e.g. a team list).
   */
  children: ReactNode;
}

/**
 * A single meta group inside `<ProjectDetails>`. This is a marker/data component
 * — `ProjectDetails` reads its props to render the left column, so `<Detail>` is
 * never rendered on its own.
 *
 * NOTE: meta is authored as child components (not an array prop) because
 * `next-mdx-remote/rsc` drops JSX *expression* attributes — only string
 * attributes and children survive the MDX compile.
 */
export function Detail({ children }: DetailProps) {
  return <>{children}</>;
}

export interface ProjectDetailsProps {
  /** Right-column label above the brief prose. */
  briefLabel?: string;
  /** `<Detail>` groups (left column) plus the brief prose (right column). */
  children: ReactNode;
}

/**
 * Case-study "project details" section — the block beneath the header. Matches
 * the Figma at 1024px: a meta column (Timeline / Team / Venue …) beside the
 * project brief, 400 + 64 gap + 560, stacking below `md`.
 *
 * Authoring (MDX):
 *   <ProjectDetails>
 *     <Detail label="Timeline">October – December 2025</Detail>
 *     ...
 *     The brief, as ordinary MDX prose.
 *   </ProjectDetails>
 *
 * `<Detail>` children fill the meta column; everything else is the brief.
 */
export function ProjectDetails({
  briefLabel = "Project brief",
  children,
}: ProjectDetailsProps) {
  const childArray = Children.toArray(children);
  const isDetail = (
    child: ReturnType<typeof Children.toArray>[number],
  ): child is ReactElement<DetailProps> =>
    isValidElement(child) && child.type === Detail;

  const details = childArray.filter(isDetail);
  const brief = childArray.filter(
    (child) =>
      !isDetail(child) && !(typeof child === "string" && child.trim() === ""),
  );

  return (
    <section className="flex flex-col gap-8 md:flex-row md:gap-16">
      <div className="md:w-[400px] md:flex-none">
        <div className="flex flex-col gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex flex-col gap-1">
              <p className="text-label text-secondary">{detail.props.label}</p>
              <div className="text-body [&>p]:m-0 [&>p+p]:mt-1">
                {detail.props.children}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-label text-secondary">{briefLabel}</p>
        <div className="text-body [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {brief}
        </div>
      </div>
    </section>
  );
}

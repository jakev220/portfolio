import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { RightProse } from "@/components/case-study/SplitGrid";

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
 * A single meta group inside `<ProjectDetails>`. Marker/data component —
 * `ProjectDetails` reads its props to render columns, so `<Detail>` is never
 * rendered on its own.
 *
 * NOTE: meta is authored as child components (not an array prop) because
 * `next-mdx-remote/rsc` drops JSX *expression* attributes — only string
 * attributes and children survive the MDX compile.
 */
export function Detail({ children }: DetailProps) {
  return <>{children}</>;
}

export interface DetailGroupProps {
  /** Group label (e.g. "Project description", "What I owned", "Impact"). */
  label: string;
  children: ReactNode;
}

/**
 * A labeled block in the project-details right rail (description / owned /
 * impact). Same marker pattern as `<Detail>`.
 */
export function DetailGroup({ children }: DetailGroupProps) {
  return <>{children}</>;
}

export interface ProjectDetailsProps {
  /** `<Detail>` groups (left) + `<DetailGroup>` blocks (right). */
  children: ReactNode;
}

/**
 * Case-study project details beneath the header. Uses the shared 12-column
 * layout: four columns of metadata, a one-column hang, and seven columns for
 * description / ownership / impact groups (prose at 6 of 7).
 *
 * Authoring (MDX):
 *   <ProjectDetails>
 *     <Detail label="Timeline">October – December 2025</Detail>
 *     <DetailGroup label="Project description">...</DetailGroup>
 *     <DetailGroup label="What I owned">...</DetailGroup>
 *     <DetailGroup label="Impact">...</DetailGroup>
 *   </ProjectDetails>
 */
export function ProjectDetails({ children }: ProjectDetailsProps) {
  const childArray = Children.toArray(children);
  const isDetail = (
    child: ReturnType<typeof Children.toArray>[number],
  ): child is ReactElement<DetailProps> =>
    isValidElement(child) && child.type === Detail;
  const isDetailGroup = (
    child: ReturnType<typeof Children.toArray>[number],
  ): child is ReactElement<DetailGroupProps> =>
    isValidElement(child) && child.type === DetailGroup;

  const details = childArray.filter(isDetail);
  const groups = childArray.filter(isDetailGroup);

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-4">
      <div className="min-w-0 lg:col-span-4">
        <div className="flex flex-col gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex flex-col gap-1">
              <p className="text-label text-secondary m-0">
                {detail.props.label}
              </p>
              <div className="text-body [&>p]:m-0 [&>p+p]:mt-1">
                {detail.props.children}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7 lg:col-start-6">
        <RightProse>
          <div className="flex flex-col gap-4">
            {groups.map((group, index) => (
              <div key={index} className="flex flex-col gap-1">
                <p className="text-label text-secondary m-0">
                  {group.props.label}
                </p>
                <div className="text-body [&>p]:m-0 [&>p+p]:mt-1 [&>ul]:my-0">
                  {group.props.children}
                </div>
              </div>
            ))}
          </div>
        </RightProse>
      </div>
    </section>
  );
}

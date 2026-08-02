import { Figure, type FigureProps } from "@/components/case-study/Figure";

/**
 * 10-column centered figure (inset one column on each side of the 12-col grid).
 * Used under solution chapter text rows.
 */
export function InsetFigure(props: FigureProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
      <div className="min-w-0 lg:col-span-10 lg:col-start-2">
        <Figure {...props} className="my-0" />
      </div>
    </div>
  );
}

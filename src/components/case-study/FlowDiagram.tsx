"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@/components/Icon";

interface FlowTabData {
  id: string;
  label: string;
  order: number;
}

interface FlowDiagramContextValue {
  activeId: string | null;
  register: (tab: Omit<FlowTabData, "order">) => () => void;
  tabs: FlowTabData[];
}

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

const FlowDiagramContext = createContext<FlowDiagramContextValue | null>(null);

const INITIAL_VIEWPORT: Viewport = { x: 0, y: 0, scale: 1 };
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 1.2;
const PAN_STEP = 64;
const WHEEL_ZOOM_INTENSITY = 0.0035;

export interface FlowDiagramTabProps {
  /** Tab trigger label in the header line-tab list. */
  label: string;
  /** Diagram content for this tab. Placeholder OK until charts land. */
  children?: ReactNode;
}

export interface FlowDiagramProps {
  /** Header label left of the tab list (e.g. chapter or diagram name). */
  title?: string;
  /**
   * Canvas aspect ratio as "W/H". Locks the stage height under the header.
   * Defaults to 16/9.
   */
  ratio?: string;
  /** One or more `<FlowDiagramTab />` children. */
  children: ReactNode;
}

function parseRatio(ratio: string): { w: number; h: number } {
  const [rawW, rawH] = ratio.split("/");
  const w = Number(rawW);
  const h = Number(rawH);
  return {
    w: Number.isFinite(w) && w > 0 ? w : 16,
    h: Number.isFinite(h) && h > 0 ? h : 9,
  };
}

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/** Zoom so the content point under (cx, cy) in stage space stays fixed. */
function zoomAt(
  view: Viewport,
  nextScale: number,
  cx: number,
  cy: number,
): Viewport {
  const scale = clampScale(nextScale);
  if (scale === view.scale) return view;
  const contentX = (cx - view.x) / view.scale;
  const contentY = (cy - view.y) / view.scale;
  return {
    scale,
    x: cx - contentX * scale,
    y: cy - contentY * scale,
  };
}

type ControlAction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "reset"
  | "zoom-in"
  | "zoom-out";

const CONTROL_GRID: Array<ControlAction | null> = [
  null,
  "up",
  "zoom-in",
  "left",
  "reset",
  "right",
  null,
  "down",
  "zoom-out",
];

const CONTROL_META: Record<
  ControlAction,
  { icon: IconName; label: string }
> = {
  up: { icon: "arrow-up", label: "Pan up" },
  down: { icon: "arrow-down", label: "Pan down" },
  left: { icon: "arrow-left", label: "Pan left" },
  right: { icon: "arrow-right", label: "Pan right" },
  reset: { icon: "refresh", label: "Reset view" },
  "zoom-in": { icon: "zoom-in", label: "Zoom in" },
  "zoom-out": { icon: "zoom-out", label: "Zoom out" },
};

/** Solid white chrome for header chips and control buttons. */
const chromeClassName = "border border-border bg-bg";

/**
 * Design-strategy `ink-08` plate (black-08 over white). Fixed solid so dark mode
 * keeps the same canvas — same values as {@link Figure}'s `frame="ink-08"`.
 */
const INK_08_FILL = "#FBFBFB";

/**
 * Full-width case-study canvas for read-only user-flow diagrams.
 *
 * Shell: white header (title + line tabs) above a bordered ink-08 stage with
 * pan/zoom. Charts stay read-only; tabs register through context (same pattern
 * as {@link MediaCarousel}).
 */
export function FlowDiagram({
  title,
  ratio = "16/9",
  children,
}: FlowDiagramProps) {
  const [tabs, setTabs] = useState<FlowTabData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [dragging, setDragging] = useState(false);
  const orderRef = useMemo(() => ({ current: 0 }), []);
  const baseId = useId();
  const { w, h } = parseRatio(ratio);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    originX: number;
    originY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const viewportRef = useRef(viewport);
  const activeTabRef = useRef<string | null>(null);

  const applyViewport = useCallback(
    (updater: Viewport | ((prev: Viewport) => Viewport)) => {
      setViewport((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    [],
  );

  // Keep ref in sync for drag origins; wheel/buttons use functional updates.
  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  const register = useCallback(
    (tab: Omit<FlowTabData, "order">) => {
      const order = orderRef.current++;
      setTabs((prev) => {
        const existing = prev.findIndex((entry) => entry.id === tab.id);
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = { ...next[existing], ...tab };
          return next;
        }
        return [...prev, { ...tab, order }].sort((a, b) => a.order - b.order);
      });
      return () => {
        setTabs((prev) => prev.filter((entry) => entry.id !== tab.id));
      };
    },
    [orderRef],
  );

  const sorted = tabs;
  const safeActiveId =
    activeId && sorted.some((tab) => tab.id === activeId)
      ? activeId
      : (sorted[0]?.id ?? null);

  // Reset framing when switching tabs — ignore the initial null → first-tab settle.
  useEffect(() => {
    if (!safeActiveId) return;
    if (
      activeTabRef.current !== null &&
      activeTabRef.current !== safeActiveId
    ) {
      applyViewport(INITIAL_VIEWPORT);
    }
    activeTabRef.current = safeActiveId;
  }, [safeActiveId, applyViewport]);

  const stageCenter = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { cx: 0, cy: 0 };
    const rect = stage.getBoundingClientRect();
    return { cx: rect.width / 2, cy: rect.height / 2 };
  }, []);

  const runControl = useCallback(
    (action: ControlAction) => {
      applyViewport((view) => {
        switch (action) {
          case "up":
            return { ...view, y: view.y + PAN_STEP };
          case "down":
            return { ...view, y: view.y - PAN_STEP };
          case "left":
            return { ...view, x: view.x + PAN_STEP };
          case "right":
            return { ...view, x: view.x - PAN_STEP };
          case "reset":
            return INITIAL_VIEWPORT;
          case "zoom-in": {
            const { cx, cy } = stageCenter();
            return zoomAt(view, view.scale * ZOOM_STEP, cx, cy);
          }
          case "zoom-out": {
            const { cx, cy } = stageCenter();
            return zoomAt(view, view.scale / ZOOM_STEP, cx, cy);
          }
          default:
            return view;
        }
      });
    },
    [applyViewport, stageCenter],
  );

  // Pinch-to-zoom only (trackpad sets ctrlKey). Plain scroll leaves the page alone.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;

      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * rect.height
            : event.deltaY;
      const factor = Math.exp(-delta * WHEEL_ZOOM_INTENSITY * 4);

      applyViewport((view) => zoomAt(view, view.scale * factor, cx, cy));
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [applyViewport]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, textarea, select, [role='tab']")) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startX: viewportRef.current.x,
      startY: viewportRef.current.y,
    };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.originX;
    const dy = event.clientY - drag.originY;
    applyViewport({
      ...viewportRef.current,
      x: drag.startX + dx,
      y: drag.startY + dy,
      scale: viewportRef.current.scale,
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  const value = useMemo(
    () => ({
      activeId: safeActiveId,
      register,
      tabs: sorted,
    }),
    [safeActiveId, register, sorted],
  );

  const tablistId = `${baseId}-tablist`;
  const titleId = title ? `${baseId}-title` : undefined;

  return (
    <FlowDiagramContext.Provider value={value}>
      <div className="my-0 flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-bg">
        <div className="flex min-w-0 items-stretch bg-bg">
          {title ? (
            <>
              <p
                id={titleId}
                className="text-body-large text-heading m-0 shrink-0 px-5 py-3.5 font-medium sm:px-6 sm:py-4"
              >
                {title}
              </p>
              <div aria-hidden className="w-px shrink-0 self-stretch bg-border" />
            </>
          ) : null}

          {sorted.length > 0 ? (
            <div
              id={tablistId}
              role="tablist"
              aria-label={title ? undefined : "Flow diagrams"}
              aria-labelledby={titleId}
              className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3.5 sm:gap-x-6 sm:px-6 sm:py-4"
            >
              {sorted.map((tab) => {
                const selected = tab.id === safeActiveId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`${tab.id}-tab`}
                    aria-selected={selected}
                    aria-controls={`${tab.id}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(tab.id)}
                    className={`cursor-pointer border-b-2 pb-1 text-body transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      selected
                        ? "border-heading text-heading"
                        : "border-transparent text-secondary hover:text-heading"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div
          ref={stageRef}
          className={`relative w-full min-w-0 touch-none overflow-hidden border-t border-border ${
            dragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{ aspectRatio: `${w} / ${h}`, backgroundColor: INK_08_FILL }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="absolute inset-0 z-0 origin-top-left will-change-transform"
            style={{
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            }}
          >
            {children}
          </div>

          <div
            className="absolute bottom-5 right-5 z-20 grid grid-cols-3 gap-1.5 sm:bottom-6 sm:right-6 sm:gap-2"
            role="group"
            aria-label="Diagram controls"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {CONTROL_GRID.map((action, index) => {
              if (!action) {
                return (
                  <span
                    key={`empty-${index}`}
                    aria-hidden
                    className="size-9 sm:size-10"
                  />
                );
              }
              const { icon, label } = CONTROL_META[action];
              return (
                <button
                  key={action}
                  type="button"
                  aria-label={label}
                  onClick={() => runControl(action)}
                  className={`flex size-9 cursor-pointer items-center justify-center rounded-lg text-secondary transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-10 ${chromeClassName}`}
                >
                  <Icon name={icon} size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FlowDiagramContext.Provider>
  );
}

/**
 * One diagram tab. Registers its label with the parent. Content mounts only
 * while selected so inactive diagram assets stay unloaded.
 */
export function FlowDiagramTab({ label, children }: FlowDiagramTabProps) {
  const ctx = useContext(FlowDiagramContext);
  if (!ctx) {
    throw new Error("FlowDiagramTab must be used inside FlowDiagram");
  }

  const id = useId();
  const { activeId, register } = ctx;
  const selected = activeId === id;

  useEffect(() => {
    return register({ id, label });
  }, [id, label, register]);

  return (
    <div
      role="tabpanel"
      id={`${id}-panel`}
      aria-labelledby={`${id}-tab`}
      hidden={!selected}
      className={`absolute inset-0 flex items-center justify-center p-8 sm:p-12 ${
        selected ? "" : "pointer-events-none"
      }`}
    >
      {selected
        ? (children ?? (
            <div className="flex max-w-sm flex-col items-center gap-2 text-center">
              <p className="text-label text-secondary m-0">Diagram placeholder</p>
              <p className="text-body text-heading m-0">{label}</p>
            </div>
          ))
        : null}
    </div>
  );
}

/**
 * Read-only diagram asset for a tab. Uses `unoptimized` so already-compressed
 * WebPs aren't re-encoded. Draggable off so pan gestures stay on the stage.
 */
export function FlowDiagramImage({
  src,
  alt,
  width = "5120",
  height = "2704",
}: {
  src: string;
  alt: string;
  /** Intrinsic width (string for MDX). Defaults to 5120. */
  width?: string;
  /** Intrinsic height (string for MDX). Defaults to 2704. */
  height?: string;
}) {
  const w = Number(width) || 5120;
  const h = Number(height) || 2704;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- already-optimized WebP; avoid Next re-encode
    <img
      src={src}
      alt={alt}
      width={w}
      height={h}
      draggable={false}
      decoding="async"
      className="pointer-events-none h-auto max-h-full w-auto max-w-full select-none object-contain"
    />
  );
}

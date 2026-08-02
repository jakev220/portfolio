"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

export interface MetricProps {
  /**
   * Target number as a string (e.g. "84", "4.7"). Strings are required because
   * `next-mdx-remote/rsc` drops JSX expression attributes.
   */
  value: string;
  /** Digits after the decimal, as a string (e.g. "1"). */
  decimals?: string;
  /** Prefix rendered before the number (e.g. "+"). */
  prefix?: string;
  /** Suffix rendered after the number (e.g. "%", " / 7"). */
  suffix?: string;
  /** Supporting description beneath the value. */
  label: string;
}

export interface MetricRowProps {
  children: React.ReactNode;
}

function useCountUp(target: number, enabled: boolean, decimals: number) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 24,
    mass: 0.8,
  });
  const [display, setDisplay] = useState(
    enabled ? (0).toFixed(decimals) : target.toFixed(decimals),
  );

  useEffect(() => {
    if (!enabled) {
      setDisplay(target.toFixed(decimals));
      return;
    }
    motionValue.set(0);
    motionValue.set(target);
  }, [enabled, target, motionValue, decimals]);

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return unsubscribe;
  }, [spring, decimals, enabled]);

  return display;
}

/**
 * One metric cell: vertical accent bar, counting value, and description.
 * Counts up when scrolled into view (honors reduced motion).
 */
export function Metric({
  value,
  decimals,
  prefix = "",
  suffix = "",
  label,
}: MetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const numeric = Number.parseFloat(value);
  const resolvedDecimals =
    decimals !== undefined
      ? Number.parseInt(decimals, 10)
      : Number.isInteger(numeric)
        ? 0
        : 1;
  const display = useCountUp(
    Number.isFinite(numeric) ? numeric : 0,
    Boolean(inView && !reduceMotion),
    resolvedDecimals,
  );

  return (
    <div ref={ref} className="flex min-w-0 flex-1 gap-2">
      <div
        aria-hidden
        className="w-1 shrink-0 self-stretch rounded-full bg-primary"
      />
      <div className="flex min-w-0 flex-col gap-1 py-4 pl-2">
        <p className="text-h1 m-0 text-primary">
          <motion.span>{`${prefix}${display}${suffix}`}</motion.span>
        </p>
        <p className="text-body m-0 text-secondary">{label}</p>
      </div>
    </div>
  );
}

/**
 * Responsive metric strip — stacks below lg; equal cells in a row once the
 * shared 4 / 1 / 7 grid is active.
 */
export function MetricRow({ children }: MetricRowProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">{children}</div>
  );
}

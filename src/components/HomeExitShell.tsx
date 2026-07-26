"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EXIT_EASE,
  HOME_EXIT_EVENT,
  HOME_EXIT_MS,
} from "@/lib/about-transition";

/**
 * Fades the home page (hero copy, work, footer) out when the name→About
 * transition begins, so the route change doesn’t hard-cut mid-frame.
 */
export function HomeExitShell({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const onExit = () => setExiting(true);
    window.addEventListener(HOME_EXIT_EVENT, onExit);
    return () => window.removeEventListener(HOME_EXIT_EVENT, onExit);
  }, []);

  const play = exiting && !reduceMotion;

  return (
    <motion.div
      animate={{ opacity: play ? 0 : 1 }}
      transition={{ duration: play ? HOME_EXIT_MS / 1000 : 0, ease: EXIT_EASE }}
      className={exiting ? "pointer-events-none" : undefined}
    >
      {children}
    </motion.div>
  );
}

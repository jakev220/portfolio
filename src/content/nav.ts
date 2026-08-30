import type { NavItem } from "@/components/Nav";

/**
 * Primary navigation. Edit labels/destinations here — the Nav component stays
 * content-agnostic and derives the active item from the current route.
 * `/play` is not built yet (404 until the page exists).
 */
export const navItems: NavItem[] = [
  { label: "Work", href: "/" },
  { label: "Play", href: "/play" },
  { label: "About", href: "/about" },
];

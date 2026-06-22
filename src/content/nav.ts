import type { NavItem } from "@/components/Nav";

/**
 * Primary navigation. Edit labels/destinations here — the Nav component stays
 * content-agnostic and derives the active item from the current route.
 * (Play/About routes don't exist yet, so those links 404 until built.)
 */
export const navItems: NavItem[] = [
  { label: "Work", href: "/" },
  { label: "Play", href: "/play" },
  { label: "About", href: "/about" },
];

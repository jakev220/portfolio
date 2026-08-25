"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MediaLightbox } from "@/components/media-lightbox/MediaLightbox";
import type { LightboxMediaItem } from "@/components/media-lightbox/types";

interface MediaLightboxContextValue {
  /** Register a media item; returns an unregister function. */
  register: (item: LightboxMediaItem) => () => void;
  /** Open the lightbox at the given registered id. */
  open: (id: string) => void;
  close: () => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  items: LightboxMediaItem[];
  activeIndex: number;
  isOpen: boolean;
}

const MediaLightboxContext = createContext<MediaLightboxContextValue | null>(
  null,
);

/**
 * Page-scoped media gallery for case-study routes (`/work/[slug]`). Expandable
 * figures register on mount; the lightbox walks every registered item on the page.
 */
export function MediaLightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LightboxMediaItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const register = useCallback((item: LightboxMediaItem) => {
    setItems((prev) => {
      const existing = prev.findIndex((entry) => entry.id === item.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = item;
        return next;
      }
      return [...prev, item];
    });
    return () => {
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
    };
  }, []);

  const activeIndex = activeId
    ? items.findIndex((entry) => entry.id === activeId)
    : -1;
  const isOpen = activeIndex >= 0;

  const open = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) setActiveId(item.id);
    },
    [items],
  );

  const next = useCallback(() => {
    if (items.length === 0 || activeIndex < 0) return;
    const nextIndex = (activeIndex + 1) % items.length;
    const item = items[nextIndex];
    if (item) setActiveId(item.id);
  }, [activeIndex, items]);

  const prev = useCallback(() => {
    if (items.length === 0 || activeIndex < 0) return;
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const item = items[prevIndex];
    if (item) setActiveId(item.id);
  }, [activeIndex, items]);

  const value = useMemo(
    () => ({
      register,
      open,
      close,
      goTo,
      next,
      prev,
      items,
      activeIndex,
      isOpen,
    }),
    [
      register,
      open,
      close,
      goTo,
      next,
      prev,
      items,
      activeIndex,
      isOpen,
    ],
  );

  return (
    <MediaLightboxContext.Provider value={value}>
      {children}
      <MediaLightbox />
    </MediaLightboxContext.Provider>
  );
}

export function useMediaLightbox(): MediaLightboxContextValue {
  const ctx = useContext(MediaLightboxContext);
  if (!ctx) {
    throw new Error("useMediaLightbox must be used within MediaLightboxProvider");
  }
  return ctx;
}

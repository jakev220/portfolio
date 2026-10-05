"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Blocking theme bootstrap for first paint. Rendered only on the server and
 * during hydration — React 19 / Next 16 warn if a `<script>` is created during
 * later client renders (e.g. soft navigations).
 */
export function ThemeInitScript({ script }: { script: string }) {
  const renderScript = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  if (!renderScript) return null;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

import { thumbHashToDataURL } from "thumbhash";
import { BLUR_THUMBHASH_BY_PATH } from "@/lib/blur-map.generated";

const dataUrlCache = new Map<string, string>();

/**
 * Resolve a public path (e.g. `/work/…/cover.webp`) to a Tiny blur data URL
 * for `next/image` `placeholder="blur"`. Returns `undefined` when no hash
 * was generated for that asset.
 */
export function getBlurDataURL(src: string | undefined): string | undefined {
  if (!src || src.startsWith("data:") || src.startsWith("http")) return undefined;

  const cached = dataUrlCache.get(src);
  if (cached) return cached;

  const hashB64 = BLUR_THUMBHASH_BY_PATH[src];
  if (!hashB64) return undefined;

  try {
    const bytes =
      typeof atob === "function"
        ? Uint8Array.from(atob(hashB64), (c) => c.charCodeAt(0))
        : Uint8Array.from(Buffer.from(hashB64, "base64"));
    const dataUrl = thumbHashToDataURL(bytes);
    dataUrlCache.set(src, dataUrl);
    return dataUrl;
  } catch {
    return undefined;
  }
}

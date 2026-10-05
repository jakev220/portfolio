import Image, { type ImageProps } from "next/image";
import { getBlurDataURL } from "@/lib/blur";

export type SmartImageProps = ImageProps;

/**
 * `next/image` wrapper that applies a build-time ThumbHash blur placeholder
 * when one exists for the `src` path. Falls through unchanged when missing
 * (parent `bg-surface` remains the fallback).
 */
export function SmartImage({ src, placeholder, blurDataURL, ...rest }: SmartImageProps) {
  const path = typeof src === "string" ? src : undefined;
  const generated = getBlurDataURL(path);
  const resolvedBlur = blurDataURL ?? generated;
  const resolvedPlaceholder =
    placeholder ?? (resolvedBlur ? "blur" : undefined);

  return (
    <Image
      src={src}
      placeholder={resolvedPlaceholder}
      blurDataURL={resolvedBlur}
      {...rest}
    />
  );
}

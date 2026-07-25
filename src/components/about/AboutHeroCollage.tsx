import Image from "next/image";
import type { AboutHeroPhoto } from "@/content/about";

export interface AboutHeroCollageProps {
  photos: AboutHeroPhoto[];
}

/**
 * 2×2 bento collage: wide + square on row 1, square + wide on row 2.
 * Expects four photos in that order. 16px gaps; tiles use `rounded-xl`.
 */
export function AboutHeroCollage({ photos }: AboutHeroCollageProps) {
  const [topWide, topSquare, bottomSquare, bottomWide] = photos;

  return (
    <div className="flex w-full flex-col gap-4">
      <CollageRow wide={topWide} square={topSquare} wideFirst />
      <CollageRow wide={bottomWide} square={bottomSquare} wideFirst={false} />
    </div>
  );
}

function CollageRow({
  wide,
  square,
  wideFirst,
}: {
  wide?: AboutHeroPhoto;
  square?: AboutHeroPhoto;
  wideFirst: boolean;
}) {
  const wideTile = (
    <div
      key="wide"
      className="relative aspect-[416/200] min-w-0 overflow-hidden rounded-xl bg-surface"
    >
      {wide?.src ? (
        <Image
          src={wide.src}
          alt={wide.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 416px, 66vw"
        />
      ) : null}
    </div>
  );

  const squareTile = (
    <div
      key="square"
      className="relative aspect-square min-w-0 overflow-hidden rounded-xl bg-surface"
    >
      {square?.src ? (
        <Image
          src={square.src}
          alt={square.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 200px, 33vw"
        />
      ) : null}
    </div>
  );

  return (
    <div
      className={`grid gap-4 ${
        wideFirst ? "grid-cols-[416fr_200fr]" : "grid-cols-[200fr_416fr]"
      }`}
    >
      {wideFirst ? (
        <>
          {wideTile}
          {squareTile}
        </>
      ) : (
        <>
          {squareTile}
          {wideTile}
        </>
      )}
    </div>
  );
}

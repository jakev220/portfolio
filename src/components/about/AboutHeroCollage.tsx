import Image from "next/image";
import type { AboutHeroPhoto } from "@/content/about";

export interface AboutHeroCollageProps {
  photos: AboutHeroPhoto[];
}

/**
 * 2×2 bento collage: wide + square on row 1, square + wide on row 2.
 * Expects four photos in that order. 16px gaps; tiles use `rounded-xl`.
 * Entrance stagger is CSS (`.about-hero-tile-*`) so it starts on first paint.
 */
export function AboutHeroCollage({ photos }: AboutHeroCollageProps) {
  const [topWide, topSquare, bottomSquare, bottomWide] = photos;

  return (
    <div className="flex w-full flex-col gap-4">
      <CollageRow
        wide={topWide}
        square={topSquare}
        wideFirst
        wideOrder={0}
        squareOrder={1}
      />
      <CollageRow
        wide={bottomWide}
        square={bottomSquare}
        wideFirst={false}
        // Visual L→R on the bottom row: square then wide.
        squareOrder={2}
        wideOrder={3}
      />
    </div>
  );
}

function CollageRow({
  wide,
  square,
  wideFirst,
  wideOrder,
  squareOrder,
}: {
  wide?: AboutHeroPhoto;
  square?: AboutHeroPhoto;
  wideFirst: boolean;
  wideOrder: number;
  squareOrder: number;
}) {
  const wideTile = (
    <CollageTile key="wide" photo={wide} order={wideOrder} aspect="wide" />
  );

  const squareTile = (
    <CollageTile
      key="square"
      photo={square}
      order={squareOrder}
      aspect="square"
    />
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

function CollageTile({
  photo,
  order,
  aspect,
}: {
  photo?: AboutHeroPhoto;
  order: number;
  aspect: "wide" | "square";
}) {
  return (
    <div
      className={`about-hero-tile about-hero-tile-${order} relative min-w-0 overflow-hidden rounded-xl bg-surface ${
        aspect === "wide" ? "aspect-[416/200]" : "aspect-square"
      }`}
    >
      {photo?.src ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover"
          sizes={
            aspect === "wide"
              ? "(min-width: 1024px) 416px, 66vw"
              : "(min-width: 1024px) 200px, 33vw"
          }
          priority={order < 2}
        />
      ) : null}
    </div>
  );
}

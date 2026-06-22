"use client";

import { useEffect, useState } from "react";

/** Jake is in San Diego — always show Pacific time regardless of the viewer. */
const TIME_ZONE = "America/Los_Angeles";
/** Daytime window (24h) → sun; otherwise moon. */
const DAY_START = 6;
const DAY_END = 18;

const SUN = "☼";
const MOON = "⏾";

function format(date: Date): { label: string; isDay: boolean } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const label = `${get("hour")}:${get("minute")}${get("dayPeriod").toLowerCase()}`;

  const hour =
    Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        hour12: false,
      }).format(date),
    ) % 24;
  const isDay = hour >= DAY_START && hour < DAY_END;

  return { label, isDay };
}

/**
 * Live Pacific-time meta: "{sun|moon} {time}, {location}". Time is computed on
 * the client (and refreshed each minute) to avoid a server/client mismatch;
 * before mount only the location shows.
 */
export function FooterClock({ location }: { location: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span>{location}</span>;

  const { label, isDay } = format(now);
  return (
    <span>
      <span aria-hidden>{isDay ? SUN : MOON}</span> {label}, {location}
    </span>
  );
}

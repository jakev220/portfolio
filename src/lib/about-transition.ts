/** Home → About transition: shared timing + the home exit signal. */

/** Dispatched on `window` when the home exit choreography should start. */
export const HOME_EXIT_EVENT = "portfolio:home-about-exit";

/** Soft page fade (everything except the reel’s own rise). */
export const HOME_EXIT_MS = 780;
/** Reel rise + fade — finishes just after the page fade. */
export const REEL_EXIT_MS = 900;
/** Opacity fade starts after the rise begins (see HeroAvatar). */
export const REEL_FADE_DELAY_MS = 180;
/** Navigate once the home fade has settled. */
export const NAVIGATE_DELAY_MS = 780;

export const EXIT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Start the home exit sequence (About plays its entrance on mount). */
export function beginHomeAboutExit(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(HOME_EXIT_EVENT));
  }
}

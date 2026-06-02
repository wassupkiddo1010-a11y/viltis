/** Shared breakpoint tokens — keep JS and CSS in sync. */

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Primary phone/tablet cutoff used across the mobile view layer. */
export const MOBILE_MAX = BREAKPOINTS.md;

export const MEDIA_QUERIES = {
  xs: `(max-width: ${BREAKPOINTS.xs}px)`,
  sm: `(max-width: ${BREAKPOINTS.sm}px)`,
  mobile: `(max-width: ${MOBILE_MAX}px)`,
  desktop: `(min-width: ${MOBILE_MAX + 1}px)`,
  coarsePointer: "(hover: none) and (pointer: coarse)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

export function matchesMobileViewport(width: number): boolean {
  return width <= MOBILE_MAX;
}

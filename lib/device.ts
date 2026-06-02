/** Client-side helpers for responsive performance tuning. */

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  return cores <= 4 || memory <= 4;
}

/** Skip WebGL, heavy scroll FX, and continuous animations. */
export function shouldDisableHeavyEffects(): boolean {
  return (
    isMobileViewport() ||
    prefersReducedMotion() ||
    isCoarsePointer() ||
    isLowEndDevice()
  );
}

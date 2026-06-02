"use client";

import { useSyncExternalStore } from "react";
import { MEDIA_QUERIES, MOBILE_MAX } from "@/lib/breakpoints";

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia(MEDIA_QUERIES.mobile);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(MEDIA_QUERIES.mobile).matches;
}

function getMobileServerSnapshot() {
  return false;
}

/** True when viewport width is ≤768px (phone / small tablet). */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot);
}

function subscribeQuery(query: string, callback: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** Generic media-query hook with SSR-safe default. */
export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (cb) => subscribeQuery(query, cb),
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

export { MOBILE_MAX, MEDIA_QUERIES };

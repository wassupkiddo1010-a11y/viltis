"use client";

import { useSyncExternalStore } from "react";
import { BREAKPOINTS } from "@/lib/breakpoints";

export interface CarouselLayout {
  cardW: number;
  cardH: number;
  gap: number;
}

function layoutForWidth(width: number): CarouselLayout {
  if (width <= BREAKPOINTS.xs) return { cardW: 280, cardH: 420, gap: 20 };
  if (width <= BREAKPOINTS.md) return { cardW: 300, cardH: 460, gap: 28 };
  if (width <= BREAKPOINTS.lg) return { cardW: 360, cardH: 520, gap: 40 };
  return { cardW: 420, cardH: 590, gap: 52 };
}

function subscribeLayout(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

function getLayoutSnapshot(): CarouselLayout {
  return layoutForWidth(window.innerWidth);
}

function getLayoutServerSnapshot(): CarouselLayout {
  return layoutForWidth(1024);
}

/** Responsive case-study carousel dimensions (desktop defaults on SSR). */
export function useCarouselLayout(): CarouselLayout {
  return useSyncExternalStore(subscribeLayout, getLayoutSnapshot, getLayoutServerSnapshot);
}

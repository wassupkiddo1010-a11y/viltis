"use client";

import { useEffect } from "react";
import { shouldDisableHeavyEffects } from "@/lib/device";

/** Adds `perf-reduced` to <html> so CSS can disable expensive effects site-wide. */
export function PerformanceMode() {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      if (shouldDisableHeavyEffects()) {
        root.classList.add("perf-reduced");
      } else {
        root.classList.remove("perf-reduced");
      }
    };

    apply();
    window.addEventListener("resize", apply, { passive: true });
    return () => window.removeEventListener("resize", apply);
  }, []);

  return null;
}

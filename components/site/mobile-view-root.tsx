"use client";

import { useEffect } from "react";
import { MEDIA_QUERIES } from "@/lib/breakpoints";

/**
 * Activates the dedicated mobile view layer on phones without altering desktop markup.
 * Adds `mobile-view` to <html> so css/mobile.css can scope phone-only enhancements.
 */
export function MobileViewRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const mq = window.matchMedia(MEDIA_QUERIES.mobile);

    const apply = () => {
      const isMobile = mq.matches;
      root.classList.toggle("mobile-view", isMobile);
      body.classList.toggle("has-mobile-chrome", isMobile);
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return null;
}

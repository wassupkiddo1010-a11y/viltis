"use client";

import { useEffect } from "react";
import { HOME_SECTIONS_HTML } from "./home-sections-content";

export function HomeSections() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selector = [
      ".section__header",
      ".service-card",
      ".solution-card",
      ".outcome-block",
      ".case-study-card",
      ".testimonial-slider",
      ".cta-section__inner",
      ".contact-form",
    ].join(", ");

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach((el) => el.classList.add("scroll-reveal"));

    document.querySelectorAll(".services__grid, .solutions__grid, .outcomes__grid, .case-studies__grid").forEach((grid) => {
      grid.querySelectorAll(".scroll-reveal").forEach((el, index) => {
        (el as HTMLElement).style.setProperty("--reveal-delay", `${index * 80}ms`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HOME_SECTIONS_HTML }} />;
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./hero";
import { IndustryCards } from "@/components/ui/industry-cards";
import { shouldDisableHeavyEffects } from "@/lib/device";

export function HeroScrollScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wipe = wipeRef.current;
    if (!section || !wipe) return;

    // On mobile / low-end devices skip GSAP and reveal industries immediately
    if (shouldDisableHeavyEffects()) {
      wipe.style.display = "none";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(wipe, { xPercent: 0 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(wipe, {
            xPercent: 100,
            duration: 0.7,
            ease: "power3.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(wipe, {
            xPercent: 0,
            duration: 0.6,
            ease: "power3.inOut",
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Hero />
      <section ref={sectionRef} className="transition-section">
        <div className="transition-section__panel">
          <IndustryCards noAnimation />
        </div>
        <div ref={wipeRef} className="black-wipe" aria-hidden="true" />
      </section>
    </>
  );
}

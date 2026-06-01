"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./hero";
import { IndustryCards } from "@/components/ui/industry-cards";

export function HeroScrollScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const wipeRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const wipe    = wipeRef.current;
    if (!section || !wipe) return;

    gsap.set(wipe, { xPercent: 0 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger     : section,
        start       : "top 80%",
        // Scrolling down — curtain wipes off to the right
        onEnter     : () => {
          gsap.to(wipe, {
            xPercent : 100,
            duration : 0.7,
            ease     : "power3.inOut",
          });
        },
        // Scrolling back up — curtain slides back in
        onLeaveBack : () => {
          gsap.to(wipe, {
            xPercent : 0,
            duration : 0.6,
            ease     : "power3.inOut",
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

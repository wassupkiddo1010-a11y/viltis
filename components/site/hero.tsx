"use client";

import Link from "next/link";
import Image from "next/image";
import { RotatingText } from "@/components/ui/rotating-text";
import { DigitalLoomBackground } from "./digital-loom-background";

const ROTATING_WORDS = [
  "pharmaceutical",
  "life sciences",
  "biotech",
  "medical device",
  "diagnostics",
];

export function Hero() {
  return (
    <section className="hero" id="hero">
      <DigitalLoomBackground />
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__mesh" aria-hidden="true" />
      <div className="hero__fade-bottom" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow hero__reveal" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
            Transform Ideas into Impact
          </p>
          <h1
            className="hero__headline hero__reveal hero__reveal--scale"
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
          >
            Partner with Viltis for Expert Solutions
          </h1>
          <p
            className="hero__subtitle hero__reveal"
            style={{ "--reveal-delay": "360ms" } as React.CSSProperties}
          >
            At Viltis, we provide effective solutions and highly skilled consultants for organizations of{" "}
            <RotatingText words={ROTATING_WORDS} interval={2500} mode="slide" className="rotating-text" />
          </p>
          <div
            className="hero__actions hero__reveal"
            style={{ "--reveal-delay": "540ms" } as React.CSSProperties}
          >
            <Link href="/services" className="btn btn--primary">
              Explore Services
            </Link>
            <Link href="/schedule-a-call" className="btn btn--outline">
              Schedule a Consultation
            </Link>
          </div>
          <ul
            className="hero__chips hero__reveal"
            style={{ "--reveal-delay": "720ms" } as React.CSSProperties}
            aria-label="Industries served"
          >
            <li className="hero__chip">Pharmaceuticals</li>
            <li className="hero__chip">Biotechnology</li>
            <li className="hero__chip">Medical Devices</li>
            <li className="hero__chip">Diagnostics</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

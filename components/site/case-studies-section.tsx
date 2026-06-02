"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate as motionAnimate,
} from "framer-motion";
import { useCarouselLayout } from "@/hooks/use-carousel-layout";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── SVG Glyphs ────────────────────────────────────────────────────────── */
function GlyphHex({ color }: { color: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
      <polygon points="30,3 53,16.5 53,43.5 30,57 7,43.5 7,16.5" stroke={color} strokeWidth="1.6" />
      <circle cx="30" cy="30" r="7" stroke={color} strokeWidth="1.4" />
      <line x1="30" y1="10" x2="30" y2="23" stroke={color} strokeWidth="1.2" />
      <line x1="30" y1="37" x2="30" y2="50" stroke={color} strokeWidth="1.2" />
      <line x1="10" y1="30" x2="23" y2="30" stroke={color} strokeWidth="1.2" />
      <line x1="37" y1="30" x2="50" y2="30" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function GlyphMolecule({ color }: { color: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
      <circle cx="20" cy="30" r="14" stroke={color} strokeWidth="1.6" />
      <circle cx="40" cy="30" r="14" stroke={color} strokeWidth="1.6" />
      <circle cx="30" cy="30" r="4.5" fill={color} />
    </svg>
  );
}

function GlyphTriangle({ color }: { color: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
      <polygon points="30,5 57,53 3,53" stroke={color} strokeWidth="1.6" />
      <line x1="18" y1="41" x2="42" y2="41" stroke={color} strokeWidth="1.3" />
      <line x1="22" y1="32" x2="38" y2="32" stroke={color} strokeWidth="1.3" />
      <line x1="26" y1="23" x2="34" y2="23" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

function GlyphLayers({ color }: { color: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
      <rect x="18" y="24" width="30" height="22" rx="2" stroke={color} strokeWidth="1.6" />
      <rect x="13" y="18" width="30" height="22" rx="2" stroke={color} strokeWidth="1.3" opacity="0.75" />
      <rect x="8" y="12" width="30" height="22" rx="2" stroke={color} strokeWidth="1.1" opacity="0.45" />
    </svg>
  );
}

function GlyphHeart({ color }: { color: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
      <path
        d="M30 50C22 42 8 32 8 21C8 14 13 9 20 9C24 9 28 12 30 17C32 12 36 9 40 9C47 9 52 14 52 21C52 32 38 42 30 50Z"
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  );
}

function GlyphPulse({ color }: { color: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
      <polyline
        points="3,30 15,30 19,13 23,47 27,13 31,47 35,30 57,30"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Card data ─────────────────────────────────────────────────────────── */
interface CaseCard {
  id: string;
  title: string;
  tagline: string;
  url: string;
  colorFull: string;
  colorMuted: string;
  textColor: string;
  Glyph: React.FC<{ color: string }>;
}

const CARDS: CaseCard[] = [
  {
    id: "manufacturing",
    title: "MANUFACTURING QUALITY & PROCESS TEAM",
    tagline: "QUALITY SYSTEMS AND PROCESS\nCAPABILITY FOR REGULATED\nMANUFACTURING",
    url: "https://viltis.com/case-studies/case-study-manufacturing-quality-and-process-team/",
    colorFull: "#1B3B29",
    colorMuted: "#2E4A3A",
    textColor: "#EDE9E0",
    Glyph: GlyphHex,
  },
  {
    id: "biologics-cmc",
    title: "BIOLOGICS CMC PIP",
    tagline: "CHEMISTRY, MANUFACTURING AND\nCONTROLS FOR A COMPLEX\nBIOLOGICS PIPELINE",
    url: "https://viltis.com/case-studies/case-study-biologics-cmc-pip/",
    colorFull: "#FBFCB4",
    colorMuted: "#EAEBCF",
    textColor: "#111111",
    Glyph: GlyphMolecule,
  },
  {
    id: "phase-iii",
    title: "PHASE III BIOLOGIC, SCD",
    tagline: "LATE-STAGE CLINICAL OPERATIONS\nFOR A SICKLE CELL DISEASE\nBIOLOGIC PROGRAM",
    url: "https://viltis.com/case-studies/phase-iii-biologic-sickle-cell-disease-scd/",
    colorFull: "#ADADE6",
    colorMuted: "#C6C6EC",
    textColor: "#111111",
    Glyph: GlyphTriangle,
  },
  {
    id: "dhf",
    title: "DHF REMEDIATION — CLASS I DEVICES",
    tagline: "DESIGN HISTORY FILE REMEDIATION\nSUPPORT FOR CLASS I\nMEDICAL DEVICES",
    url: "https://viltis.com/case-studies/dhf-remediation-support-for-class-i-medical-devices/",
    colorFull: "#DEFD4B",
    colorMuted: "#DEE0B0",
    textColor: "#111111",
    Glyph: GlyphLayers,
  },
  {
    id: "abbott-1",
    title: "ABBOTT CARDIOVASCULAR — DESIGN & DEV",
    tagline: "DESIGN AND DEVELOPMENT\nSUPPORT FOR ABBOTT'S\nCARDIOVASCULAR DIVISION",
    url: "https://viltis.com/case-studies/design-and-development-support-for-abbotts-cardiovascular-division/",
    colorFull: "#1B3B29",
    colorMuted: "#2E4A3A",
    textColor: "#EDE9E0",
    Glyph: GlyphHeart,
  },
  {
    id: "abbott-2",
    title: "ABBOTT CARDIOVASCULAR — DESIGN & DEV II",
    tagline: "PHASE II DESIGN AND DEVELOPMENT,\nABBOTT CARDIOVASCULAR\nDIVISION",
    url: "https://viltis.com/case-studies/design-and-development-support-for-abbotts-cardiovascular-division-1/",
    colorFull: "#FBFCB4",
    colorMuted: "#EAEBCF",
    textColor: "#111111",
    Glyph: GlyphPulse,
  },
];

/* ─── Bracket frame (reusable) ──────────────────────────────────────────── */
function BracketFrame({ color, inset = 14 }: { color: string; inset?: number }) {
  const s: React.CSSProperties = { position: "absolute", width: 22, height: 22, pointerEvents: "none" };
  const b = `1.5px solid ${color}`;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <span style={{ ...s, top: inset, left: inset, borderTop: b, borderLeft: b }} />
      <span style={{ ...s, top: inset, right: inset, borderTop: b, borderRight: b }} />
      <span style={{ ...s, bottom: inset, left: inset, borderBottom: b, borderLeft: b }} />
      <span style={{ ...s, bottom: inset, right: inset, borderBottom: b, borderRight: b }} />
    </div>
  );
}

/* ─── Active Card ───────────────────────────────────────────────────────── */
function ActiveCard({ card, layout }: { card: CaseCard; layout: { cardW: number; cardH: number } }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cs-card"
      style={{
        width: layout.cardW,
        height: layout.cardH,
        background: hovered ? card.colorFull : card.colorMuted,
        color: card.textColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BracketFrame color={card.textColor} inset={14} />

      {/* Title */}
      <h3 className="cs-card__title" style={{ color: card.textColor }}>
        {card.title}
      </h3>

      {/* Glyph */}
      <div className="cs-card__glyph">
        <card.Glyph color={card.textColor} />
      </div>

      {/* Tagline */}
      <p className="cs-card__tagline" style={{ color: card.textColor }}>
        {card.tagline}
      </p>

      {/* Footer */}
      <div className="cs-card__footer">
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cs-card__go-btn cs-card__go-btn--always"
          onClick={(e) => e.stopPropagation()}
        >
          GO TO WEBSITE
        </a>
        <span
          className="cs-card__website-label cs-card__website-label--desktop"
          style={{ color: card.textColor }}
          aria-hidden="true"
        >
          WEBSITE
        </span>
      </div>
    </div>
  );
}

/* ─── Ghost Card ────────────────────────────────────────────────────────── */
function GhostCard({
  card,
  layout,
  onClick,
}: {
  card: CaseCard;
  layout: { cardW: number; cardH: number };
  onClick: () => void;
}) {
  return (
    <div
      className="cs-ghost"
      style={{ width: layout.cardW, height: layout.cardH }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`View ${card.title}`}
    >
      <div className="cs-ghost__glyph">
        <card.Glyph color="#4a4a4a" />
      </div>
      <p className="cs-ghost__title">{card.title}</p>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
export function CaseStudiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [inCarousel, setInCarousel] = useState(false);
  const layout = useCarouselLayout();
  const isMobile = useIsMobile();
  const { cardW, cardH, gap } = layout;

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const dragStartX = useRef(0);
  const xAtDragStart = useRef(0);
  const isDraggingRef = useRef(false);
  const isFirstRender = useRef(true);

  const snapToIndex = useCallback(
    (index: number, instant = false) => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const targetX = w / 2 - index * (cardW + gap) - cardW / 2;
      if (instant) {
        x.set(targetX);
      } else {
        motionAnimate(x, targetX, {
          type: "spring",
          stiffness: 290,
          damping: 30,
          mass: 0.85,
        });
      }
    },
    [x, cardW, gap]
  );

  /* Initial snap (one rAF so layout has resolved) */
  useEffect(() => {
    requestAnimationFrame(() => snapToIndex(activeIndex, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Animate on index change (skip the very first mount) */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    snapToIndex(activeIndex);
  }, [activeIndex, snapToIndex]);

  /* Re-snap on container resize or layout change */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => snapToIndex(activeIndex, true));
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIndex, snapToIndex]);

  useEffect(() => {
    snapToIndex(activeIndex, true);
  }, [cardW, gap, activeIndex, snapToIndex]);

  /* Wheel navigation */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let last = 0;
    const handler = (e: WheelEvent) => {
      const now = Date.now();
      if (now - last < 420) return;
      last = now;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (d > 30) setActiveIndex((i) => Math.min(i + 1, CARDS.length - 1));
      else if (d < -30) setActiveIndex((i) => Math.max(i - 1, 0));
    };
    el.addEventListener("wheel", handler, { passive: true });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  /* Pointer drag */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    xAtDragStart.current = x.get();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    if (!isDraggingRef.current) return;
    x.set(xAtDragStart.current + (e.clientX - dragStartX.current));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const dx = e.clientX - dragStartX.current;
    let next = activeIndex;
    if (dx < -(cardW / 5) && activeIndex < CARDS.length - 1) next = activeIndex + 1;
    else if (dx > cardW / 5 && activeIndex > 0) next = activeIndex - 1;
    if (next !== activeIndex) setActiveIndex(next);
    else snapToIndex(activeIndex);
  };

  return (
    <section className="cs-section" id="case-studies">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="container cs-header">
        <p className="cs-eyebrow">Case Studies</p>
        <h2 className="cs-heading">
          Our companies don't just enter markets.
          <br />
          They define them.
        </h2>
        <p className="cs-subpara">
          Top-tier professionals lead your team through project inception to final
          completion. Successful timeline management ensures objectives are met
          within budget consideration.
        </p>
        <button className="cs-explore-btn" type="button">
          <span className="cs-ebracket cs-ebracket--tl" />
          <span className="cs-ebracket cs-ebracket--tr" />
          <span className="cs-ebracket cs-ebracket--bl" />
          <span className="cs-ebracket cs-ebracket--br" />
          Explore Case Studies
        </button>
      </div>

      {/* ── Carousel ──────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="cs-carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setInCarousel(true)}
        onMouseLeave={() => setInCarousel(false)}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <motion.div className="cs-track" style={{ x, gap }}>
          {CARDS.map((card, i) =>
            i === activeIndex ? (
              <ActiveCard key={card.id} card={card} layout={{ cardW, cardH }} />
            ) : (
              <GhostCard
                key={card.id}
                card={card}
                layout={{ cardW, cardH }}
                onClick={() => setActiveIndex(i)}
              />
            )
          )}
        </motion.div>

        {/* Drag pill — desktop only */}
        <AnimatePresence>
          {inCarousel && !isDragging && !isMobile && (
            <motion.div
              className="cs-drag-pill"
              style={{ left: mousePos.x, top: mousePos.y }}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.15 }}
            >
              DRAG
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dot nav */}
      <div className="cs-dots">
        {CARDS.map((card, i) => (
          <button
            key={card.id}
            className={`cs-dot${i === activeIndex ? " cs-dot--active" : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to ${card.title}`}
          />
        ))}
      </div>
    </section>
  );
}

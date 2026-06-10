"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate as motionAnimate,
} from "framer-motion";

/* ─── Layout constants ──────────────────────────────────────────────────── */
const DESKTOP_CARD_W = 420;
const DESKTOP_CARD_H = 590;
const DESKTOP_GAP = 52;

interface CarouselMetrics {
  cardW: number;
  cardH: number;
  gap: number;
}

function getCarouselMetrics(containerWidth: number): CarouselMetrics {
  if (containerWidth <= 768) {
    const cardW = Math.min(340, Math.max(280, containerWidth - 40));
    return {
      cardW,
      cardH: Math.round(cardW * (DESKTOP_CARD_H / DESKTOP_CARD_W)),
      gap: 20,
    };
  }
  return { cardW: DESKTOP_CARD_W, cardH: DESKTOP_CARD_H, gap: DESKTOP_GAP };
}

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
  slug: string;
  title: string;
  tagline: string;
  colorFull: string;
  colorMuted: string;
  textColor: string;
  Glyph: React.FC<{ color: string }>;
}

const CARDS: CaseCard[] = [
  {
    id: "manufacturing",
    slug: "manufacturing-quality-and-process-team",
    title: "MANUFACTURING QUALITY & PROCESS TEAM",
    tagline: "QUALITY SYSTEMS AND PROCESS\nCAPABILITY FOR REGULATED\nMANUFACTURING",
    colorFull: "#1B3B29",
    colorMuted: "#2E4A3A",
    textColor: "#EDE9E0",
    Glyph: GlyphHex,
  },
  {
    id: "biologics-cmc",
    slug: "biologics-cmc-pip",
    title: "BIOLOGICS CMC PIP",
    tagline: "CHEMISTRY, MANUFACTURING AND\nCONTROLS FOR A COMPLEX\nBIOLOGICS PIPELINE",
    colorFull: "#FBFCB4",
    colorMuted: "#EAEBCF",
    textColor: "#111111",
    Glyph: GlyphMolecule,
  },
  {
    id: "phase-iii",
    slug: "phase-iii-biologic-sickle-cell-disease",
    title: "PHASE III BIOLOGIC, SCD",
    tagline: "LATE-STAGE CLINICAL OPERATIONS\nFOR A SICKLE CELL DISEASE\nBIOLOGIC PROGRAM",
    colorFull: "#ADADE6",
    colorMuted: "#C6C6EC",
    textColor: "#111111",
    Glyph: GlyphTriangle,
  },
  {
    id: "dhf",
    slug: "dhf-remediation-class-i-medical-devices",
    title: "DHF REMEDIATION — CLASS I DEVICES",
    tagline: "DESIGN HISTORY FILE REMEDIATION\nSUPPORT FOR CLASS I\nMEDICAL DEVICES",
    colorFull: "#DEFD4B",
    colorMuted: "#DEE0B0",
    textColor: "#111111",
    Glyph: GlyphLayers,
  },
  {
    id: "abbott-1",
    slug: "abbott-cardiovascular-design-development",
    title: "ABBOTT CARDIOVASCULAR — DESIGN & DEV",
    tagline: "DESIGN AND DEVELOPMENT\nSUPPORT FOR ABBOTT'S\nCARDIOVASCULAR DIVISION",
    colorFull: "#1B3B29",
    colorMuted: "#2E4A3A",
    textColor: "#EDE9E0",
    Glyph: GlyphHeart,
  },
  {
    id: "abbott-2",
    slug: "abbott-cardiovascular-design-development-ii",
    title: "ABBOTT CARDIOVASCULAR — DESIGN & DEV II",
    tagline: "PHASE II DESIGN AND DEVELOPMENT,\nABBOTT CARDIOVASCULAR\nDIVISION",
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
function ActiveCard({
  card,
  width,
  height,
  isCoarse,
}: {
  card: CaseCard;
  width: number;
  height: number;
  isCoarse: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const showCta = hovered || isCoarse;

  return (
    <div
      className="cs-card"
      style={{
        width,
        height,
        background: hovered ? card.colorFull : card.colorMuted,
        color: card.textColor,
      }}
      onMouseEnter={() => !isCoarse && setHovered(true)}
      onMouseLeave={() => !isCoarse && setHovered(false)}
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
        <AnimatePresence mode="wait">
          {showCta ? (
            <motion.span
              key="go"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/case-studies/${card.slug}`}
                className="cs-card__go-btn"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                VIEW CASE STUDY
              </Link>
            </motion.span>
          ) : (
            <motion.span
              key="label"
              className="cs-card__website-label"
              style={{ color: card.textColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            >
              CASE STUDY
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Ghost Card ────────────────────────────────────────────────────────── */
function GhostCard({
  card,
  width,
  height,
  onClick,
}: {
  card: CaseCard;
  width: number;
  height: number;
  onClick: () => void;
}) {
  return (
    <div
      className="cs-ghost"
      style={{ width, height }}
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
  const [metrics, setMetrics] = useState<CarouselMetrics>({
    cardW: DESKTOP_CARD_W,
    cardH: DESKTOP_CARD_H,
    gap: DESKTOP_GAP,
  });
  const [isCoarse, setIsCoarse] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const dragStartX = useRef(0);
  const xAtDragStart = useRef(0);
  const isDraggingRef = useRef(false);
  const isFirstRender = useRef(true);
  const activeIndexRef = useRef(0);
  const metricsRef = useRef(metrics);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const apply = () => setIsCoarse(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const snapToIndex = useCallback(
    (index: number, instant = false) => {
      const el = containerRef.current;
      if (!el) return;
      const { cardW, gap } = metricsRef.current;
      const w = el.offsetWidth;
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
    [x]
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

  /* Re-snap on container resize */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateMetrics = () => {
      const next = getCarouselMetrics(el.offsetWidth);
      setMetrics(next);
      metricsRef.current = next;
      snapToIndex(activeIndexRef.current, true);
    };

    const ro = new ResizeObserver(updateMetrics);
    ro.observe(el);
    updateMetrics();
    return () => ro.disconnect();
  }, [snapToIndex]);

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
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
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
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }

    const { cardW } = metricsRef.current;
    const dx = e.clientX - dragStartX.current;
    const threshold = Math.max(40, cardW / 4);
    const current = activeIndexRef.current;
    let next = current;

    if (dx < -threshold && current < CARDS.length - 1) next = current + 1;
    else if (dx > threshold && current > 0) next = current - 1;

    if (next !== current) setActiveIndex(next);
    else snapToIndex(current);
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
        <Link href="/case-studies" className="cs-explore-btn">
          <span className="cs-ebracket cs-ebracket--tl" />
          <span className="cs-ebracket cs-ebracket--tr" />
          <span className="cs-ebracket cs-ebracket--bl" />
          <span className="cs-ebracket cs-ebracket--br" />
          Explore Case Studies
        </Link>
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
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          ["--cs-card-w" as string]: `${metrics.cardW}px`,
          ["--cs-card-h" as string]: `${metrics.cardH}px`,
          ["--cs-gap" as string]: `${metrics.gap}px`,
        }}
      >
        <motion.div className="cs-track" style={{ x, gap: metrics.gap }}>
          {CARDS.map((card, i) =>
            i === activeIndex ? (
              <ActiveCard
                key={card.id}
                card={card}
                width={metrics.cardW}
                height={metrics.cardH}
                isCoarse={isCoarse}
              />
            ) : (
              <GhostCard
                key={card.id}
                card={card}
                width={metrics.cardW}
                height={metrics.cardH}
                onClick={() => setActiveIndex(i)}
              />
            )
          )}
        </motion.div>

        {/* Drag pill */}
        <AnimatePresence>
          {inCarousel && !isDragging && (
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

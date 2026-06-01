"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

/* ─── Data ───────────────────────────────────────────────────────────────── */
interface RowData {
  id: string;
  title: string;
  subtitle?: string;
  desc: string;
}


const SOLUTIONS: RowData[] = [
  {
    id: "contingent",
    title: "Contingent Resourcing",
    subtitle: "Specialized expertise, delivered fast.",
    desc: "Viltis provides highly qualified life sciences professionals to support urgent and short-term business needs. We deliver specialized talent across regulatory, quality, clinical, engineering, and scientific functions—often within 24–48 hours. Our flexible resourcing model enables organizations to respond quickly to changing priorities while keeping critical initiatives moving forward.",
  },
  {
    id: "project-teams",
    title: "Sourcing Project Teams",
    subtitle: "Purpose-built teams for complex initiatives.",
    desc: "For initiatives that require multiple skill sets or sustained execution, Viltis assembles dedicated project teams aligned to your scope, timeline, and delivery goals. Our consultants integrate seamlessly with your organization to support cross-functional programs or specialized workstreams, providing continuity, accountability, and execution confidence.",
  },
  {
    id: "fsp",
    title: "FSP",
    subtitle: "Predictable delivery with retained oversight.",
    desc: "For long-term or mission-critical programs, Viltis offers Functional Services Provision models that assume responsibility for defined functions or work packages. We manage staffing, execution, and performance against agreed objectives while you retain strategic control. This approach improves cost predictability, reduces operational risk, and enables scalable delivery—on-site or remote.",
  },
];

/* ─── Corner brackets ────────────────────────────────────────────────────── */
function Brackets() {
  return (
    <motion.div
      className="vwqf-brackets"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-hidden="true"
    >
      <span className="vwqf-bracket vwqf-bracket--tl" />
      <span className="vwqf-bracket vwqf-bracket--tr" />
      <span className="vwqf-bracket vwqf-bracket--bl" />
      <span className="vwqf-bracket vwqf-bracket--br" />
    </motion.div>
  );
}

/* ─── List row ───────────────────────────────────────────────────────────── */
function ListRow({
  item,
  index,
  activeId,
  onEnter,
  showLink,
}: {
  item: RowData;
  index: number;
  activeId: string | null;
  onEnter: (id: string) => void;
  showLink?: boolean;
}) {
  const isActive = activeId === item.id;
  const reduced = useReducedMotion();

  let opacity: number;
  if (activeId === null) {
    opacity = Math.max(0.16, 1 - index * 0.32);
  } else {
    const activeIdx = SOLUTIONS.findIndex((r) => r.id === activeId);
    const dist = Math.abs(index - activeIdx);
    opacity = isActive ? 1 : Math.max(0.1, 1 - dist * 0.38);
  }

  return (
    <li
      className={`vwqf-row${isActive ? " vwqf-row--active" : ""}`}
      style={{ opacity, transition: "opacity 0.42s cubic-bezier(0.22,1,0.36,1)" }}
      onMouseEnter={() => onEnter(item.id)}
    >
      <AnimatePresence>{isActive && <Brackets />}</AnimatePresence>

      <h3 className="vwqf-row__title">{item.title.toUpperCase()}</h3>

      <AnimatePresence>
        {isActive && (
          <motion.div
            key={item.id + "-desc"}
            className="vwqf-row__body"
            initial={reduced ? false : { opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.subtitle && (
              <p className="vwqf-row__subtitle">{item.subtitle}</p>
            )}
            <p className="vwqf-row__desc">{item.desc}</p>
            {showLink && (
              <Link href="#contact" className="vwqf-row__link">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ─── Solutions list ─────────────────────────────────────────────────────── */
function SolutionsList() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="vwqf-list" onMouseLeave={() => setActive(null)}>
      {SOLUTIONS.map((s, i) => (
        <ListRow
          key={s.id}
          item={s}
          index={i}
          activeId={active}
          onEnter={setActive}
        />
      ))}
    </ul>
  );
}

/* ─── Exported section ───────────────────────────────────────────────────── */
export function CoreExpertiseSection() {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className="vwqf-section"
      id="solutions"
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container vwqf-section__inner">
        <header className="vwqf-section__header">
          <p className="vwqf-section__eyebrow">Solutions</p>
          <h2 className="vwqf-section__title">
            Helping You Deliver Results in High-Stakes Environments
          </h2>
        </header>
        <SolutionsList />
      </div>
    </motion.section>
  );
}

/* kept as a no-op export so any lingering import doesn't break the build */
export function SolutionsSection() {
  return null;
}

"use client";

import React from "react";
import { motion } from "framer-motion";

/* ─── Testimonials data ─────────────────────────────────────────────────── */
export const testimonials = [
  {
    text: "Viltis deployed a qualified QA consultant within 24 hours of our request. Their depth in GMP systems helped us pass the inspection with zero critical findings.",
    name: "Sarah Mitchell",
    role: "VP Quality, BioNovata",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "The regulatory strategist Viltis placed understood our EU MDR pathway immediately. Submission planning was on track within the first week.",
    name: "James Okafor",
    role: "Head of Regulatory Affairs, Meridian Therapeutics",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "We needed clinical operations support for a Phase III trial at short notice. Viltis delivered a credentialed CRA ready to start in 48 hours.",
    name: "Dr. Priya Nair",
    role: "Clinical Development Director, Orbis Bio",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text: "Their FSP model gave us the flexibility to scale quality resources up and down without the overhead of permanent headcount.",
    name: "Marcus Webb",
    role: "COO, Clearpath MedTech",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    text: "The CMC consultant Viltis provided brought deep biologic manufacturing experience that was directly applicable to our IND submission.",
    name: "Dr. Leila Amiri",
    role: "VP Scientific Affairs, Helix Origins",
    image: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    text: "Viltis assembled a cross-functional team for our device remediation program in under two weeks. The quality of each consultant was genuinely impressive.",
    name: "Tom Fitzgerald",
    role: "Program Director, Calix Devices",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    text: "Our PV team was understaffed heading into an aggregate report deadline. Viltis placed two experienced safety scientists who integrated flawlessly.",
    name: "Yasmin Choudhry",
    role: "Global Pharmacovigilance Lead, Strata Pharma",
    image: "https://randomuser.me/api/portraits/women/82.jpg",
  },
  {
    text: "What differentiates Viltis is accountability. They don't just fill roles — they ensure the consultant is performing and the project is moving.",
    name: "Robert Hagen",
    role: "SVP Regulatory & Quality, NorthBridge Bio",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    text: "We've used Viltis across three consecutive programs. Their understanding of our pipeline means ramp-up time is almost zero on each engagement.",
    name: "Anna Linden",
    role: "Chief Scientific Officer, Arca Biologics",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

/* ─── One scrolling row ─────────────────────────────────────────────────── */
interface RowProps {
  items: typeof testimonials;
  /** Negative CSS animation-delay (seconds) to shift phase */
  phaseOffset: number;
  /** Row index for aria labelling */
  rowIndex: number;
}

function TestimonialRow({ items, phaseOffset, rowIndex }: RowProps) {
  const doubled = [...items, ...items];

  return (
    <div className="tm-row" aria-label={`Testimonials row ${rowIndex + 1}`}>
      <div
        className="tm-track"
        style={{ animationDelay: `${phaseOffset}s` }}
      >
        {doubled.map((t, i) => (
          <div key={i} className="tm-card">
            <p className="tm-card__text">{t.text}</p>
            <div className="tm-card__author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt={t.name}
                width={36}
                height={36}
                className="tm-card__avatar"
              />
              <div>
                <p className="tm-card__name">{t.name}</p>
                <p className="tm-card__role">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Exported section component ────────────────────────────────────────── */
// Rotate array so each row starts from a different card — more visual variety
function rotate<T>(arr: T[], by: number): T[] {
  return [...arr.slice(by), ...arr.slice(0, by)];
}

// Every row shows ALL 9 testimonials (rotated) — doubled = 18 cards ≈ 6048px
// at 320px card width, which is always wider than 2× any viewport. No gaps.
const ROW_1 = testimonials;
const ROW_2 = rotate(testimonials, 3);
const ROW_3 = rotate(testimonials, 6);

const DURATION = 28; // seconds per full loop (9 cards is naturally slower)

export function TestimonialsColumns() {
  return (
    <section className="testimonials section section--alt" id="about">
      <div className="container">
        <motion.div
          className="tm-header"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section__eyebrow">Client Perspectives</p>
          <h2 className="section__title">Trusted by life sciences leaders</h2>
          <p className="tm-header__sub">
            From inspection-ready quality programs to Phase III clinical operations
            — what clients say about working with Viltis.
          </p>
        </motion.div>
      </div>

      {/* Three rows — same speed, 1/3-cycle phase offset each */}
      <div className="tm-rows-wrap">
        <TestimonialRow items={ROW_1} phaseOffset={0}                  rowIndex={0} />
        <TestimonialRow items={ROW_2} phaseOffset={-(DURATION / 3)}    rowIndex={1} />
        <TestimonialRow items={ROW_3} phaseOffset={-(DURATION * 2 / 3)} rowIndex={2} />
      </div>
    </section>
  );
}

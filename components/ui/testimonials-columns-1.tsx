"use client";

import React from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS, type Testimonial } from "@/lib/content/testimonials";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function expandForMarquee(items: Testimonial[], minCount = 6): Testimonial[] {
  if (items.length === 0) return [];
  const out: Testimonial[] = [];
  while (out.length < minCount) out.push(...items);
  return out.slice(0, minCount);
}

const MARQUEE_ITEMS = expandForMarquee(TESTIMONIALS, 6);

interface RowProps {
  items: Testimonial[];
  phaseOffset: number;
  rowIndex: number;
}

function TestimonialRow({ items, phaseOffset, rowIndex }: RowProps) {
  const doubled = [...items, ...items];

  return (
    <div className="tm-row" aria-label={`Testimonials row ${rowIndex + 1}`}>
      <div className="tm-track" style={{ animationDelay: `${phaseOffset}s` }}>
        {doubled.map((t, i) => (
          <div key={`${t.name}-${i}`} className="tm-card">
            <p className="tm-card__text">&ldquo;{t.text}&rdquo;</p>
            <div className="tm-card__author">
              <span className="tm-card__avatar tm-card__avatar--initials" aria-hidden="true">
                {getInitials(t.name)}
              </span>
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

function rotate<T>(arr: T[], by: number): T[] {
  return [...arr.slice(by), ...arr.slice(0, by)];
}

const ROW_1 = MARQUEE_ITEMS;
const ROW_2 = rotate(MARQUEE_ITEMS, 2);
const DURATION = 32;

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
          <h2 className="section__title">What our clients say about us</h2>
          <p className="tm-header__sub">
            Real feedback from life sciences leaders and consultants who have partnered with Viltis.
          </p>
        </motion.div>
      </div>

      <div className="tm-rows-wrap">
        <TestimonialRow items={ROW_1} phaseOffset={0} rowIndex={0} />
        <TestimonialRow items={ROW_2} phaseOffset={-(DURATION / 2)} rowIndex={1} />
      </div>
    </section>
  );
}

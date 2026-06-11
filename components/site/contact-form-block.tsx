"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site-config";

interface ContactFormBlockProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function ContactFormBlock({
  title = "How can we help?",
  subtitle = "Tell us about your program needs and timeline. Our team will respond promptly.",
  compact = false,
}: ContactFormBlockProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className={`contact-block${compact ? " contact-block--compact" : ""}`} id="contact-form">
      <div className="contact-block__inner">
        <div className="contact-block__copy">
          <h2 className="contact-block__title">{title}</h2>
          <p className="contact-block__sub">{subtitle}</p>
          <div className="contact-block__meta">
            <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
            <span aria-hidden="true">·</span>
            <a href={`tel:${SITE_PHONE_TEL}`}>{SITE_PHONE}</a>
          </div>
          <Link href="/schedule-a-call" className="btn btn--secondary btn--sm contact-block__schedule">
            Schedule a Call
          </Link>
        </div>
        <form className="contact-form contact-block__form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="cf-name">Full Name</label>
              <input type="text" id="cf-name" name="name" required placeholder="Your name" />
            </div>
            <div className="contact-form__field">
              <label htmlFor="cf-email">Email</label>
              <input type="email" id="cf-email" name="email" required placeholder="you@company.com" />
            </div>
          </div>
          <div className="contact-form__field">
            <label htmlFor="cf-phone">Phone</label>
            <input type="tel" id="cf-phone" name="phone" placeholder="(555) 000-0000" />
          </div>
          <div className="contact-form__field">
            <label htmlFor="cf-need">Area of Need</label>
            <select id="cf-need" name="need" defaultValue="">
              <option value="">Select a service area</option>
              <option value="quality">Quality</option>
              <option value="regulatory">Regulatory</option>
              <option value="clinical">Clinical</option>
              <option value="engineering">Engineering</option>
              <option value="scientific">Scientific</option>
              <option value="pharmacovigilance">Pharmacovigilance</option>
              <option value="resourcing">Consultant Resourcing</option>
            </select>
          </div>
          <div className="contact-form__field">
            <label htmlFor="cf-message">Message</label>
            <textarea id="cf-message" name="message" rows={4} placeholder="Describe your needs" />
          </div>
          <button type="submit" className="btn btn--primary contact-form__submit" disabled={submitted}>
            {submitted ? "Message Sent" : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}

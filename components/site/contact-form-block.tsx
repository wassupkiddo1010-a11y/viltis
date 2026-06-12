"use client";

import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import {
  FORMSPREE_CONTACT_FORM_ID,
  SITE_EMAIL,
  SITE_PHONE,
  SITE_PHONE_TEL,
} from "@/lib/site-config";

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
  const [state, handleSubmit] = useForm(FORMSPREE_CONTACT_FORM_ID);

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
        {state.succeeded ? (
          <div className="contact-form contact-block__form contact-form--success">
            <p className="contact-form__success">Thank you — your message has been sent. We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form className="contact-form contact-block__form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="cf-name">Full Name</label>
                <input type="text" id="cf-name" name="name" required placeholder="Your name" />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="contact-form__error" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="cf-email">Email</label>
                <input type="email" id="cf-email" name="email" required placeholder="you@company.com" />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="contact-form__error" />
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
              <ValidationError prefix="Message" field="message" errors={state.errors} className="contact-form__error" />
            </div>
            <ValidationError errors={state.errors} className="contact-form__error" />
            <button type="submit" className="btn btn--primary contact-form__submit" disabled={state.submitting}>
              {state.submitting ? "Sending…" : "Submit Inquiry"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

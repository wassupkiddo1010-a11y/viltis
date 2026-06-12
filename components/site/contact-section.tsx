"use client";

import Link from "next/link";
import { useForm, ValidationError } from "@formspree/react";
import { TestimonialsColumns } from "@/components/ui/testimonials-columns-1";
import { FORMSPREE_CONTACT_FORM_ID } from "@/lib/site-config";

export function ContactSection() {
  const [state, handleSubmit] = useForm(FORMSPREE_CONTACT_FORM_ID);

  return (
    <section className="cta-section" id="contact">
      <div className="container cta-section__inner">
        <div className="cta-section__content">
          <h2 className="cta-section__title">Need specialized life sciences support?</h2>
          <p className="cta-section__subtitle">
            Connect with Viltis to discuss your regulatory, quality, clinical, scientific, engineering, or
            pharmacovigilance needs.
          </p>
          <div className="cta-section__actions">
            <Link href="/schedule-a-call" className="btn btn--primary">
              Schedule a Consultation
            </Link>
            <a href="mailto:info@viltis.com" className="btn btn--secondary">
              Request Consultant Support
            </a>
          </div>
        </div>
        {state.succeeded ? (
          <div className="contact-form contact-form--success">
            <p className="contact-form__success">Thank you — your message has been sent. We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 className="contact-form__title">Send a message</h3>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required placeholder="Your name" />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="contact-form__error" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="you@company.com" />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="contact-form__error" />
              </div>
            </div>
            <div className="contact-form__field">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" name="company" placeholder="Organization name" />
            </div>
            <div className="contact-form__field">
              <label htmlFor="need">Area of Need</label>
              <select id="need" name="need" defaultValue="">
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
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Describe your program needs and timeline" />
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

export function TestimonialsSection() {
  return <TestimonialsColumns />;
}

"use client";

import { FormEvent, useState } from "react";
import { TestimonialsColumns } from "@/components/ui/testimonials-columns-1";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
    setTimeout(() => setSubmitted(false), 2500);
  };

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
            <a href="mailto:info@viltis.com" className="btn btn--primary">
              Schedule a Consultation
            </a>
            <a href="mailto:info@viltis.com" className="btn btn--secondary">
              Request Consultant Support
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3 className="contact-form__title">Send a message</h3>
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="contact-form__field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="you@company.com" />
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
          </div>
          <button type="submit" className="btn btn--primary contact-form__submit" disabled={submitted}>
            {submitted ? "Message Sent" : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return <TestimonialsColumns />;
}

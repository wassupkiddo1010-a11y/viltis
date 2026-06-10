"use client";

import Link from "next/link";
import Image from "next/image";
import { SERVICE_CATEGORIES } from "@/lib/content/services-catalog";
import { SITE_EMAIL, SOCIAL_LINKS } from "@/lib/site-config";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container footer__intro">
        <Link href="/" className="footer__logo-link" aria-label="Viltis home">
          <Image
            src="/assets/viltis-logo.png"
            alt=""
            className="footer__logo-mark"
            width={36}
            height={38}
          />
        </Link>
        <p className="footer__about">
          Viltis delivers specialized life sciences consulting and expert resourcing for pharmaceutical, biotech,
          medical device, and diagnostics organizations. We connect regulated teams with the quality, regulatory,
          clinical, and technical talent needed to move critical programs forward.
        </p>
      </div>

      <div className="container">
        <div className="footer__divider" role="presentation" />
      </div>

      <div className="container footer__nav">
        <div className="footer__nav-columns">
          <ul className="footer__nav-list">
            {SERVICE_CATEGORIES.slice(0, 3).map((c) => (
              <li key={c.slug}>
                <Link href={`/services/${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
          <ul className="footer__nav-list">
            {SERVICE_CATEGORIES.slice(3).map((c) => (
              <li key={c.slug}>
                <Link href={`/services/${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
          <ul className="footer__nav-list">
            <li><Link href="/work-with-us">Work With Us</Link></li>
            <li><Link href="/services">All Services</Link></li>
            <li><Link href="/case-studies">Case Studies</Link></li>
          </ul>
          <ul className="footer__nav-list">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/jobs">Jobs</Link></li>
          </ul>
          <ul className="footer__nav-list">
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/schedule-a-call">Schedule a Call</Link></li>
            <li>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="footer__divider" role="presentation" />
      </div>

      <div className="footer__bottom-bar">
        <div className="footer__social">
          <a href={`mailto:${SITE_EMAIL}`} className="footer__social-link" aria-label="Email Viltis">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href={SOCIAL_LINKS.linkedin} className="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Viltis on LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>

        <div className="footer__scroll-wrap">
          <button type="button" className="footer__scroll-toggle" aria-label="Scroll to top" onClick={scrollToTop}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container footer__legal">
        <p className="footer__copyright">
          <span>&copy; {new Date().getFullYear()} Viltis. All rights reserved.</span>
          <span className="footer__copyright-sep" aria-hidden="true">&middot;</span>
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
        </p>
      </div>
    </footer>
  );
}

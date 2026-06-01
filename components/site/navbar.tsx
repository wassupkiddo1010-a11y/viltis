"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [pilled,      setPilled]      = useState(false);
  const [hidden,      setHidden]      = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    let prevY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setPilled(y > window.innerHeight * 0.10);

      // Hide/show only after the hero section (100vh). Within the hero, always visible.
      if (y > window.innerHeight) {
        setHidden(y > prevY);
      } else {
        setHidden(false);
      }
      prevY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cls = [
    "navbar",
    scrolled ? "navbar--scrolled" : "",
    pilled   ? "navbar--pill"     : "",
    hidden   ? "navbar--hidden"   : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="navbar__popover-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <header className={cls} id="navbar">
        {/*
         * navbar__inner is the element that morphs into the pill.
         * In State A it spans full page width (no `container` class so we
         * control padding here).
         * In State B (.navbar--pill) its CSS shrinks it to fit-content
         * and centres it.
         *
         * THREE flex children — brand / nav / actions — so space-between
         * gives:  [BRAND]  ···  [NAV LINKS]  ···  [CTA]
         * In pill mode .navbar__actions is hidden, leaving:
         *   [logo glyph]  [nav links]  — packed tightly side-by-side.
         */}
        <div className="navbar__inner">

          {/* ── Brand / Logo ────────────────────────────────── */}
          <div className="navbar__brand">

            {/* Mobile hamburger */}
            <div className="navbar__mobile">
              <button
                type="button"
                className="navbar__mobile-trigger"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="nav-popover"
                onClick={() => setMobileOpen((o) => !o)}
              >
                <svg
                  className="navbar__mobile-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path className="navbar__mobile-icon-line navbar__mobile-icon-line--top" d="M4 12L20 12" />
                  <path className="navbar__mobile-icon-line navbar__mobile-icon-line--mid" d="M4 12H20" />
                  <path className="navbar__mobile-icon-line navbar__mobile-icon-line--bot" d="M4 12H20" />
                </svg>
              </button>
              <div className="navbar__popover" id="nav-popover" hidden={!mobileOpen}>
                <nav className="navbar__popover-nav" aria-label="Mobile navigation">
                  <ul className="navbar__popover-list">
                    <li className="navbar__popover-group">
                      <span className="navbar__popover-label">Services</span>
                      <ul className="navbar__popover-sublist">
                        {["Quality", "Regulatory", "Clinical", "Engineering", "Scientific", "Pharmacovigilance"].map(
                          (item) => (
                            <li key={item}>
                              <Link href="#services" className="navbar__popover-link" onClick={() => setMobileOpen(false)}>
                                {item}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                    <li className="navbar__popover-separator" role="separator" aria-orientation="horizontal" />
                    <li className="navbar__popover-group">
                      <span className="navbar__popover-label">Solutions</span>
                      <ul className="navbar__popover-sublist">
                        {[
                          "Contingent Resourcing",
                          "Project Teams",
                          "Functional Service Provision",
                          "Inspection Readiness",
                          "Clinical Execution Support",
                        ].map((item) => (
                          <li key={item}>
                            <Link
                              href={item.includes("Inspection") || item.includes("Clinical") ? "#outcomes" : "#solutions"}
                              className="navbar__popover-link"
                              onClick={() => setMobileOpen(false)}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="navbar__popover-separator" role="separator" aria-orientation="horizontal" />
                    {[
                      ["#industries", "Industries"],
                      ["#case-studies", "Case Studies"],
                      ["#about", "About"],
                    ].map(([href, label]) => (
                      <li key={href}>
                        <Link href={href} className="navbar__popover-link" onClick={() => setMobileOpen(false)}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Logo mark (always visible) + wordmark text (fades out in pill) */}
            <Link href="#" className="navbar__logo" aria-label="Viltis home">
              <Image
                src="/assets/viltis-logo.png"
                alt=""
                className="navbar__logo-mark"
                width={44}
                height={47}
                priority
              />
              {/* Wordmark — State A only; cross-fades out when pill activates */}
              <span className="navbar__wordmark" aria-hidden="true">Viltis</span>
            </Link>
          </div>

          {/* ── Desktop nav — in NORMAL FLEX FLOW (not absolute) ── */}
          <nav className="navbar__nav" aria-label="Main navigation">
            <ul className="navbar__menu">
              <li className="navbar__menu-item navbar__menu-item--dropdown">
                <button type="button" className="navbar__trigger" aria-expanded="false" aria-haspopup="true">
                  Services
                  <svg className="navbar__chevron" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="navbar__viewport">
                  <ul className="navbar__panel navbar__panel--desc">
                    {[
                      ["Quality", "GMP quality systems and audit readiness."],
                      ["Regulatory", "Submission strategy and agency support."],
                      ["Clinical", "Trial operations and clinical data management."],
                      ["Engineering", "Process engineering and manufacturing support."],
                      ["Scientific", "Analytical development and CMC strategy."],
                      ["Pharmacovigilance", "Safety case processing and reporting."],
                    ].map(([title, desc]) => (
                      <li key={title}>
                        <Link href="#services" className="navbar__panel-link">
                          <span className="navbar__panel-title">{title}</span>
                          <span className="navbar__panel-desc">{desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="navbar__menu-item navbar__menu-item--dropdown">
                <button type="button" className="navbar__trigger" aria-expanded="false" aria-haspopup="true">
                  Solutions
                  <svg className="navbar__chevron" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="navbar__viewport">
                  <ul className="navbar__panel navbar__panel--simple">
                    {[
                      "Contingent Resourcing",
                      "Project Teams",
                      "Functional Service Provision",
                      "Inspection Readiness",
                      "Clinical Execution Support",
                    ].map((title) => (
                      <li key={title}>
                        <Link
                          href={title.includes("Inspection") || title.includes("Clinical") ? "#outcomes" : "#solutions"}
                          className="navbar__panel-link"
                        >
                          <span className="navbar__panel-title">{title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="navbar__menu-item">
                <Link href="#industries" className="navbar__link">Industries</Link>
              </li>
              <li className="navbar__menu-item">
                <Link href="#case-studies" className="navbar__link">Case Studies</Link>
              </li>
              <li className="navbar__menu-item">
                <Link href="#about" className="navbar__link">About</Link>
              </li>
            </ul>
          </nav>

          {/* ── CTA — hidden inside pill ──────────────────────── */}
          <div className="navbar__actions">
            <Link href="#contact" className="btn btn--primary btn--sm navbar__cta">
              Schedule a Consultation
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}

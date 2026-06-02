"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavigationMenu } from "@base-ui-components/react/navigation-menu";

const SERVICES = [
  ["Quality",           "GMP quality systems and audit readiness."],
  ["Regulatory",        "Submission strategy and agency support."],
  ["Clinical",          "Trial operations and clinical data management."],
  ["Engineering",       "Process engineering and manufacturing support."],
  ["Scientific",        "Analytical development and CMC strategy."],
  ["Pharmacovigilance", "Safety case processing and reporting."],
] as const;

const PLAIN_LINKS = [
  { label: "Work With Us", href: "/work-with-us" },
  { label: "Case Studies", href: "/case-studies"  },
  { label: "About",        href: "/about"         },
  { label: "Jobs",         href: "/jobs"          },
  { label: "Contact",      href: "/contact"       },
] as const;

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [pilled,      setPilled]      = useState(false);
  const [hidden,      setHidden]      = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    let prevY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 10);
        setPilled(y > window.innerHeight * 0.10);

        if (y > window.innerHeight) {
          setHidden(y > prevY);
        } else {
          setHidden(false);
        }
        prevY = y;
        ticking = false;
      });
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
                    {/* Work With Us */}
                    <li>
                      <Link href="/work-with-us" className="navbar__popover-link" onClick={() => setMobileOpen(false)}>Work With Us</Link>
                    </li>
                    <li className="navbar__popover-separator" role="separator" />
                    {/* Services with sub-items */}
                    <li className="navbar__popover-group">
                      <span className="navbar__popover-label">Services</span>
                      <ul className="navbar__popover-sublist">
                        {SERVICES.map(([title]) => (
                          <li key={title}>
                            <Link href="/services" className="navbar__popover-link" onClick={() => setMobileOpen(false)}>
                              {title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="navbar__popover-separator" role="separator" />
                    {/* Remaining plain links */}
                    {PLAIN_LINKS.slice(1).map(({ label, href }) => (
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
            <Link href="/" className="navbar__logo" aria-label="Viltis home">
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

          {/* ── Desktop nav ── */}
          <nav className="navbar__nav" aria-label="Main navigation">
            <NavigationMenu.Root className="navbar__menu-root">
              <NavigationMenu.List className="navbar__menu">

                {/* Work With Us — plain */}
                <NavigationMenu.Item className="navbar__menu-item">
                  <NavigationMenu.Link render={<Link href="/work-with-us" />} className="navbar__link">
                    <span className="navbar__roll-text" aria-hidden="true"><span>Work With Us</span><span>Work With Us</span></span>
                    <span className="sr-only">Work With Us</span>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>

                {/* Services — dropdown */}
                <NavigationMenu.Item className="navbar__menu-item">
                  <NavigationMenu.Trigger className="navbar__trigger">
                    <span className="navbar__roll-text" aria-hidden="true">
                      <span>Services</span>
                      <span>Services</span>
                    </span>
                    <span className="sr-only">Services</span>
                    <NavigationMenu.Icon className="navbar__chevron-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9L12 15L18 9" />
                      </svg>
                    </NavigationMenu.Icon>
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content className="navbar__base-content">
                    <ul className="navbar__panel navbar__panel--desc">
                      {SERVICES.map(([title, desc]) => (
                        <li key={title}>
                          <NavigationMenu.Link render={<Link href="/services" />} className="navbar__panel-link">
                            <span className="navbar__panel-title">{title}</span>
                            <span className="navbar__panel-desc">{desc}</span>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                {/* Remaining plain links */}
                {PLAIN_LINKS.slice(1).map(({ label, href }) => (
                  <NavigationMenu.Item key={href} className="navbar__menu-item">
                    <NavigationMenu.Link render={<Link href={href} />} className="navbar__link">
                      <span className="navbar__roll-text" aria-hidden="true"><span>{label}</span><span>{label}</span></span>
                      <span className="sr-only">{label}</span>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}

              </NavigationMenu.List>

              <NavigationMenu.Portal>
                <NavigationMenu.Positioner
                  sideOffset={8}
                  collisionPadding={{ top: 5, bottom: 5, left: 16, right: 16 }}
                  className="navbar__base-positioner"
                  style={{
                    ["--duration" as string]: "0.28s",
                    ["--easing" as string]: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <NavigationMenu.Popup className="navbar__base-popup">
                    <NavigationMenu.Viewport className="navbar__base-viewport" />
                  </NavigationMenu.Popup>
                </NavigationMenu.Positioner>
              </NavigationMenu.Portal>

            </NavigationMenu.Root>
          </nav>

          {/* ── CTA — hidden inside pill ──────────────────────── */}
          <div className="navbar__actions">
            <Link href="/contact" className="btn btn--primary btn--sm navbar__cta">
              Schedule a Consultation
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}

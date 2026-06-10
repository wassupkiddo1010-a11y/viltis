"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavigationMenu } from "@base-ui-components/react/navigation-menu";
import { MOBILE_MAX } from "@/lib/breakpoints";

const SERVICES = [
  { title: "Quality",           href: "/services/quality",           desc: "GMP quality systems and audit readiness." },
  { title: "Regulatory",        href: "/services/regulatory",        desc: "Submission strategy and agency support." },
  { title: "Clinical",          href: "/services/clinical",          desc: "Trial operations and clinical data management." },
  { title: "Engineering",       href: "/services/engineering",       desc: "Process engineering and manufacturing support." },
  { title: "Scientific",        href: "/services/scientific",        desc: "Analytical development and CMC strategy." },
  { title: "Pharmacovigilance", href: "/services/pharmacovigilance", desc: "Safety case processing and reporting." },
] as const;

const PLAIN_LINKS = [
  { label: "Work With Us", href: "/work-with-us" },
  { label: "Case Studies", href: "/case-studies"  },
  { label: "About",        href: "/about"         },
  { label: "Blog",         href: "/blog"          },
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
        const isMobile = window.innerWidth <= MOBILE_MAX;

        setScrolled(y > 10);

        if (isMobile) {
          setPilled(false);
          setHidden(false);
        } else {
          setPilled(y > window.innerHeight * 0.10);
          if (y > window.innerHeight) {
            setHidden(y > prevY);
          } else {
            setHidden(false);
          }
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
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
      if (window.innerWidth > MOBILE_MAX) setMobileOpen(false);
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
          className="navbar__drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {mobileOpen && (
        <nav className="navbar__drawer" id="nav-popover" aria-label="Mobile navigation">
          <div className="navbar__drawer-header">
            <span className="navbar__drawer-title">Menu</span>
            <button
              type="button"
              className="navbar__drawer-close"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
          </div>

          <ul className="navbar__drawer-list">
            <li>
              <Link href="/work-with-us" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>
                Work With Us
              </Link>
            </li>

            <li className="navbar__drawer-group">
              <Link
                href="/services"
                className="navbar__drawer-label navbar__drawer-label--link"
                onClick={() => setMobileOpen(false)}
              >
                Services
              </Link>
              <ul className="navbar__drawer-sublist">
                <li>
                  <Link href="/services" className="navbar__drawer-sublink" onClick={() => setMobileOpen(false)}>
                    All Services
                  </Link>
                </li>
                {SERVICES.map(({ title, href }) => (
                  <li key={title}>
                    <Link href={href} className="navbar__drawer-sublink" onClick={() => setMobileOpen(false)}>
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {PLAIN_LINKS.slice(1).map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar__drawer-cta">
            <Link href="/schedule-a-call" className="btn btn--primary btn--sm" onClick={() => setMobileOpen(false)}>
              Schedule a Consultation
            </Link>
          </div>
        </nav>
      )}

      <header className={cls} id="navbar">
        <div className="navbar__inner">
          <div className="navbar__brand">
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
            </div>

            <Link href="/" className="navbar__logo" aria-label="Viltis home">
              <Image
                src="/assets/viltis-logo.png"
                alt=""
                className="navbar__logo-mark"
                width={44}
                height={47}
                priority
              />
              <span className="navbar__wordmark">Viltis</span>
            </Link>
          </div>

          <nav className="navbar__nav" aria-label="Main navigation">
            <NavigationMenu.Root
              className="navbar__menu-root"
              delay={0}
              closeDelay={300}
            >
              <NavigationMenu.List className="navbar__menu">
                <NavigationMenu.Item className="navbar__menu-item">
                  <NavigationMenu.Link render={<Link href="/work-with-us" />} className="navbar__link">
                    <span className="navbar__roll-text" aria-hidden="true"><span>Work With Us</span><span>Work With Us</span></span>
                    <span className="sr-only">Work With Us</span>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>

                <NavigationMenu.Item
                  value="services"
                  className="navbar__menu-item navbar__menu-item--services"
                >
                  <NavigationMenu.Trigger className="navbar__trigger navbar__trigger--services">
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
                      <li>
                        <NavigationMenu.Link render={<Link href="/services" />} className="navbar__panel-link">
                          <span className="navbar__panel-title">All Services</span>
                          <span className="navbar__panel-desc">Browse our full capabilities</span>
                        </NavigationMenu.Link>
                      </li>
                      {SERVICES.map(({ title, href, desc }) => (
                        <li key={title}>
                          <NavigationMenu.Link render={<Link href={href} />} className="navbar__panel-link">
                            <span className="navbar__panel-title">{title}</span>
                            <span className="navbar__panel-desc">{desc}</span>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

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
                  sideOffset={4}
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

          <div className="navbar__actions">
            <Link href="/schedule-a-call" className="btn btn--primary btn--sm navbar__cta">
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

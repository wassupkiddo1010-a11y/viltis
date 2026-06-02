"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    match: (path: string) => path === "/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/jobs",
    label: "Jobs",
    match: (path: string) => path.startsWith("/jobs"),
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    href: "/services",
    label: "Services",
    match: (path: string) => path.startsWith("/services") || path.startsWith("/work-with-us"),
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    match: (path: string) => path.startsWith("/contact"),
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M4 6h16v12H4V6z" strokeLinejoin="round" />
        <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

function MobileBottomNavInner() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
      <ul className="mobile-bottom-nav__list">
        {NAV_ITEMS.map(({ href, label, match, icon }) => {
          const active = match(pathname);
          return (
            <li key={href} className="mobile-bottom-nav__item">
              <Link
                href={href}
                className={`mobile-bottom-nav__link${active ? " mobile-bottom-nav__link--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="mobile-bottom-nav__icon">{icon}</span>
                <span className="mobile-bottom-nav__label">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileBottomNav() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMobile) return null;

  return <MobileBottomNavInner />;
}

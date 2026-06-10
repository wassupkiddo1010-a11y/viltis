import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ServiceCategoryDef } from "@/lib/content/services-catalog";

interface ServiceSidebarProps {
  category: ServiceCategoryDef;
  activeSlug?: string;
}

export function ServiceSidebar({ category, activeSlug }: ServiceSidebarProps) {
  return (
    <aside className="service-sidebar" aria-label={`${category.title} services`}>
      <div className="service-sidebar__glow" aria-hidden="true" />

      <div className="service-sidebar__header">
        <span className="service-sidebar__eyebrow">Practice area</span>
        <Link href={`/services/${category.slug}`} className="service-sidebar__title">
          {category.title}
        </Link>
        <p className="service-sidebar__count">{category.pages.length} capabilities</p>
      </div>

      <nav className="service-sidebar__nav">
        <ul className="service-sidebar__list">
          {category.pages.map((page) => {
            const isActive = activeSlug === page.slug;
            return (
              <li key={page.slug}>
                <Link
                  href={`/services/${category.slug}/${page.slug}`}
                  className={`service-sidebar__link${isActive ? " service-sidebar__link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="service-sidebar__link-text">{page.title}</span>
                  <ChevronRight className="service-sidebar__link-icon" size={14} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="service-sidebar__footer">
        <Link href="/services" className="service-sidebar__back">
          All services
        </Link>
      </div>
    </aside>
  );
}

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  cta?: { label: string; href: string };
}

export function PageHero({ eyebrow, title, subtitle, breadcrumbs, cta }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-hero__breadcrumb" aria-label="Breadcrumb">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="page-hero__breadcrumb-item">
                {i > 0 && <span className="page-hero__breadcrumb-sep" aria-hidden="true">/</span>}
                {item.href ? (
                  <Link href={item.href} className="page-hero__breadcrumb-link">{item.label}</Link>
                ) : (
                  <span className="page-hero__breadcrumb-current">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
        {subtitle && <p className="page-hero__sub">{subtitle}</p>}
        {cta && (
          <div className="page-hero__cta">
            <Link href={cta.href} className="btn btn--primary btn--sm">{cta.label}</Link>
          </div>
        )}
      </div>
    </section>
  );
}

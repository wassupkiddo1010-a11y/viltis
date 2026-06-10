import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { CardGrid } from "@/components/site/card-grid";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { SERVICE_CATEGORIES } from "@/lib/content/services-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Quality, regulatory, clinical, engineering, scientific, and pharmacovigilance consulting for life sciences organizations.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Services"
          title="Expert solutions across the regulated product lifecycle"
          subtitle="From quality and regulatory affairs to clinical operations, engineering validation, and drug safety — Viltis delivers experienced professionals when you need them."
          cta={{ label: "Schedule a Consultation", href: "/schedule-a-call" }}
        />
        <section className="content-page__body">
          <div className="content-page__layout services-hub__categories">
            {SERVICE_CATEGORIES.map((category) => (
              <div key={category.slug} className="services-hub__category-block">
                <h2 className="services-hub__category-title">
                  <Link href={`/services/${category.slug}`}>{category.title}</Link>
                </h2>
                <p className="services-hub__category-desc">{category.description}</p>
                <CardGrid
                  columns={3}
                  items={category.pages.map((p) => ({
                    title: p.title,
                    href: `/services/${category.slug}/${p.slug}`,
                    excerpt: p.description,
                  }))}
                />
              </div>
            ))}
          </div>
        </section>
        <ContactFormBlock />
      </main>
      <Footer />
    </>
  );
}

import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContentProse } from "@/components/site/content-prose";
import { CardGrid } from "@/components/site/card-grid";
import { ContentMain } from "@/components/site/content-main";
import { ServiceSidebar } from "@/components/site/service-sidebar";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { getCategory, SERVICE_CATEGORIES } from "@/lib/content/services-catalog";
import { loadPageContent } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.title} Services`,
    description: category.description,
    path: `/services/${category.slug}`,
  });
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const content = loadPageContent(category.dataKey, category.title);

  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Services"
          title={category.title}
          subtitle={category.description}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: category.title },
          ]}
          cta={{ label: "Request Support", href: "/contact" }}
        />
        <section className="content-page__body">
          <div className="content-page__layout content-page__layout--sidebar">
            <ServiceSidebar category={category} />
            <ContentMain>
              <ContentProse sections={content.sections} paragraphs={content.paragraphs} />
              <section className="content-section">
                <p className="content-section__eyebrow">Capabilities</p>
                <h2 className="content-section__title">Explore {category.title} services</h2>
                <CardGrid
                  columns={2}
                  items={category.pages.map((p) => ({
                    title: p.title,
                    href: `/services/${category.slug}/${p.slug}`,
                  }))}
                />
              </section>
            </ContentMain>
          </div>
        </section>
        <ContactFormBlock />
      </main>
      <Footer />
    </>
  );
}

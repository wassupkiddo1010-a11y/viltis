import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContentProse } from "@/components/site/content-prose";
import { ContentMain } from "@/components/site/content-main";
import { ServiceSidebar } from "@/components/site/service-sidebar";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { getServicePage, allServicePaths } from "@/lib/content/services-catalog";
import { loadPageContent } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return allServicePaths().map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const match = getServicePage(category, slug);
  if (!match) return {};
  const content = loadPageContent(match.page.dataKey, match.page.title);
  return pageMetadata({
    title: match.page.title,
    description: content.excerpt,
    path: `/services/${category}/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { category: catSlug, slug } = await params;
  const match = getServicePage(catSlug, slug);
  if (!match) notFound();

  const content = loadPageContent(match.page.dataKey, match.page.title);

  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow={match.category.title}
          title={match.page.title}
          subtitle={content.excerpt}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: match.category.title, href: `/services/${match.category.slug}` },
            { label: match.page.title },
          ]}
          cta={{ label: "Discuss This Service", href: "/contact" }}
        />
        <section className="content-page__body">
          <div className="content-page__layout content-page__layout--sidebar">
            <ServiceSidebar category={match.category} activeSlug={slug} />
            <ContentMain>
              <ContentProse sections={content.sections} paragraphs={content.paragraphs} />
            </ContentMain>
          </div>
        </section>
        <ContactFormBlock compact />
      </main>
      <Footer />
    </>
  );
}

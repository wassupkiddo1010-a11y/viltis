import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContentProse } from "@/components/site/content-prose";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { CASE_STUDIES, getCaseStudy } from "@/lib/content/case-studies-catalog";
import { loadPageContent } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return pageMetadata({
    title: cs.title,
    description: cs.excerpt,
    path: `/case-studies/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const content = loadPageContent(cs.dataKey, cs.title);

  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Case Study"
          title={cs.title}
          subtitle={cs.excerpt}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Case Studies", href: "/case-studies" },
            { label: cs.title },
          ]}
        />
        <section className="content-page__body">
          <div className="content-page__layout">
            <ContentProse sections={content.sections} paragraphs={content.paragraphs} />
          </div>
        </section>
        <ContactFormBlock title="Discuss a similar engagement" />
      </main>
      <Footer />
    </>
  );
}

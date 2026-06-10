import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { CardGrid } from "@/components/site/card-grid";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { CASE_STUDIES } from "@/lib/content/case-studies-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Case Studies",
  description:
    "Explore how Viltis partners with life sciences organizations to overcome challenges and deliver measurable results.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Results"
          title="Case Studies"
          subtitle="Each project reflects our commitment to quality, precision, and expertise across pharmaceutical, biotech, and medical device programs."
        />
        <section className="content-page__body">
          <div className="content-page__layout">
            <CardGrid
              columns={2}
              items={CASE_STUDIES.map((cs) => ({
                title: cs.title,
                href: `/case-studies/${cs.slug}`,
                excerpt: cs.excerpt,
                meta: "Case Study",
              }))}
            />
          </div>
        </section>
        <ContactFormBlock />
      </main>
      <Footer />
    </>
  );
}

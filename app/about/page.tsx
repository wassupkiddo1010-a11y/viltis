import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContentProse } from "@/components/site/content-prose";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { loadPageContent } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

const content = loadPageContent("about");

export const metadata = pageMetadata({
  title: "About",
  description:
    "Viltis is a life sciences consulting firm headquartered in San Diego, providing quality, regulatory, clinical, scientific, and engineering expertise.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="About Viltis"
          title="Empowered resources for today's rapidly evolving scientific landscape"
          subtitle="Pharmaceutical, biologics, life science, and medical device consulting with ethics at the heart of every engagement."
        />
        <div className="content-page__body">
          <div className="content-page__layout">
            <ContentProse sections={content.sections} paragraphs={content.paragraphs} />
          </div>
        </div>
        <ContactFormBlock />
      </main>
      <Footer />
    </>
  );
}

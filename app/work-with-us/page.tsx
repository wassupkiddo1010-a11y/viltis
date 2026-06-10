import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContentProse } from "@/components/site/content-prose";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { loadPageContent } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

const content = loadPageContent("work-with-us");

export const metadata = pageMetadata({
  title: "Work With Us",
  description:
    "Engage Viltis through strategic consulting, staff augmentation, or full-time expert recruitment for regulated life sciences programs.",
  path: "/work-with-us",
});

export default function WorkWithUsPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Engagement"
          title="Work With Us"
          subtitle="Flexible engagement models aligned with how regulated organizations operate — from defined initiatives to long-term capability building."
        />
        <div className="content-page__body">
          <div className="content-page__layout">
            <ContentProse sections={content.sections} paragraphs={content.paragraphs} />
          </div>
        </div>
        <ContactFormBlock title="Start a conversation" />
      </main>
      <Footer />
    </>
  );
}

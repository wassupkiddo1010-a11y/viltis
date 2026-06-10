import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Schedule a Call",
  description:
    "Schedule a consultation with Viltis to discuss life sciences consulting, resourcing, and program support.",
  path: "/schedule-a-call",
});

export default function ScheduleACallPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Consultation"
          title="Schedule a Call"
          subtitle="Book time with our team to discuss your regulatory, quality, clinical, or technical priorities."
        />
        <section className="content-page__body">
          <div className="content-page__layout" style={{ maxWidth: "720px" }}>
            <div className="content-prose">
              <p className="content-prose__p">
                Complete the form below and a Viltis representative will reach out to coordinate a consultation
                at a time that works for you. For urgent staffing needs, email{" "}
                <a href="mailto:info@viltis.com" className="text-teal-400">info@viltis.com</a>.
              </p>
            </div>
          </div>
        </section>
        <ContactFormBlock
          title="Request a consultation"
          subtitle="Share your availability and the topics you'd like to cover. We'll confirm your call shortly."
        />
      </main>
      <Footer />
    </>
  );
}

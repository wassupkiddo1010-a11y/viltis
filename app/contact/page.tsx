import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { pageMetadata } from "@/lib/seo";
import { SITE_EMAIL, SITE_PHONE, SITE_ADDRESS } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Viltis to discuss regulatory, quality, clinical, scientific, engineering, or pharmacovigilance support for your organization.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Contact"
          title="Contact Us"
          subtitle="Where does your business need more support? We offer a broad range of solutions customized to your needs."
        />
        <section className="content-page__body">
          <div className="content-page__layout" style={{ maxWidth: "720px" }}>
            <div className="content-prose">
              <p className="content-prose__p">
                Reach our team directly at{" "}
                <a href={`mailto:${SITE_EMAIL}`} className="text-teal-400">{SITE_EMAIL}</a>
                {" "}or{" "}
                <a href={`tel:${SITE_PHONE.replace(/\D/g, "")}`} className="text-teal-400">{SITE_PHONE}</a>.
              </p>
              <p className="content-prose__p">Headquarters: {SITE_ADDRESS}</p>
            </div>
          </div>
        </section>
        <ContactFormBlock
          title="Send us a message"
          subtitle="Tell us about your program, timeline, and area of need. We'll respond promptly."
        />
      </main>
      <Footer />
    </>
  );
}

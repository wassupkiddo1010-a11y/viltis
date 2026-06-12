import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { pageMetadata } from "@/lib/seo";

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
        <ContactFormBlock
          title="Send us a message"
          subtitle="Tell us about your program, timeline, and area of need. We'll respond promptly."
        />
      </main>
      <Footer />
    </>
  );
}

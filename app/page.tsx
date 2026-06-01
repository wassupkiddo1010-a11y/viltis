import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { DigitalLoomBackground } from "@/components/site/digital-loom-background";
import { HeroScrollScene } from "@/components/site/hero-scroll-scene";
import { CoreExpertiseSection } from "@/components/site/services-list-section";
import { CaseStudiesSection } from "@/components/site/case-studies-section";
import { TestimonialsSection, ContactSection } from "@/components/site/contact-section";
import { Footer } from "@/components/site/footer";

export default function HomePage() {
  return (
    <>
      {/* Single WebGL canvas that underlies the entire page */}
      <DigitalLoomBackground global />
      <Link href="#hero" className="skip-link">
        Skip to main content
      </Link>
      <Navbar />
      <main>
        {/* Hero + Industries panel share a single sticky scroll scene */}
        <HeroScrollScene />
        <CoreExpertiseSection />
        <CaseStudiesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

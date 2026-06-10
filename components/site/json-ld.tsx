import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_EMAIL, SITE_ADDRESS } from "@/lib/site-config";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_ADDRESS,
      addressCountry: "US",
    },
    sameAs: ["https://www.linkedin.com/company/viltis"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

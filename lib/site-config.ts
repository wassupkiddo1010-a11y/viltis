export const SITE_NAME = "Viltis";
export const SITE_DEFAULT_TITLE =
  "Life Science, Biologics, Scientific & Medical Device Consulting - Viltis";
export const SITE_TAGLINE = "Life Sciences Consulting & Expert Resourcing";
export const SITE_DESCRIPTION =
  "Viltis provides specialized life sciences consulting and expert resourcing for pharmaceutical, biotech, medical device, and diagnostics companies.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://viltis.com";
export const SITE_EMAIL = "info@viltis.com";
export const SITE_CAREERS_EMAIL = "careers@viltis.com";
export const SITE_PHONE = "(619) 324-8776";
export const SITE_PHONE_TEL = `+1${SITE_PHONE.replace(/\D/g, "")}`;
export const SITE_ADDRESS = "San Diego, CA";
export const FORMSPREE_CONTACT_FORM_ID = "mlgkpgjp";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/viltisconsulting/",
} as const;

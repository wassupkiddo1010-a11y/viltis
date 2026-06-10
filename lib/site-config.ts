export const SITE_NAME = "Viltis";
export const SITE_TAGLINE = "Life Sciences Consulting & Expert Resourcing";
export const SITE_DESCRIPTION =
  "Viltis provides specialized life sciences consulting and expert resourcing for pharmaceutical, biotech, medical device, and diagnostics companies.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://viltis.com";
export const SITE_EMAIL = "info@viltis.com";
export const SITE_CAREERS_EMAIL = "careers@viltis.com";
export const SITE_PHONE = "(619) 324-9355";
export const SITE_ADDRESS = "San Diego, CA";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/viltis",
} as const;

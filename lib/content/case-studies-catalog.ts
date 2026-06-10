export interface CaseStudyDef {
  slug: string;
  title: string;
  dataKey: string;
  excerpt: string;
}

export const CASE_STUDIES: CaseStudyDef[] = [
  {
    slug: "biologics-cmc-analytical-dev-consultant",
    title: "Biologics CMC Analytical Dev. Consultant",
    dataKey: "cs-biologics-cmc-analytical",
    excerpt:
      "Phase III biologics analytical development support with LCMS expertise and strategic CRO partnerships.",
  },
  {
    slug: "manufacturing-quality-and-process-team",
    title: "Manufacturing, Quality and Process Team",
    dataKey: "cs-manufacturing-quality",
    excerpt:
      "Recommissioning and qualifying a critical manufacturing site to produce COVID-19 test kits at scale.",
  },
  {
    slug: "biologics-cmc-pip",
    title: "Biologics CMC PIP",
    dataKey: "cs-biologics-cmc-pip",
    excerpt:
      "CMC and quality oversight for a Phase III monoclonal antibody program at a contract manufacturing organization.",
  },
  {
    slug: "phase-iii-biologic-sickle-cell-disease",
    title: "Phase III Biologic, Sickle Cell Disease (SCD)",
    dataKey: "cs-phase-iii-scd",
    excerpt:
      "A coordinated team of 20 consultants supporting BLA preparation and commercialization for a sickle cell biologic.",
  },
  {
    slug: "dhf-remediation-class-i-medical-devices",
    title: "DHF Remediation Support for Class I Medical Devices",
    dataKey: "cs-dhf-remediation",
    excerpt:
      "Urgent Design History File remediation to meet EU MDR requirements for Class I medical devices.",
  },
  {
    slug: "abbott-cardiovascular-design-development",
    title: "Design and Development Support for Abbott's Cardiovascular Division",
    dataKey: "cs-abbott-cardiovascular",
    excerpt:
      "Mechanical engineering and CAD support for stents, guidewires, and cardiovascular device development.",
  },
  {
    slug: "abbott-cardiovascular-design-development-ii",
    title: "Design and Development Support for Abbott's Cardiovascular Division II",
    dataKey: "cs-abbott-cardiovascular-2",
    excerpt:
      "Continued design and development engineering support for Abbott's cardiovascular product portfolio.",
  },
];

export function getCaseStudy(slug: string): CaseStudyDef | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

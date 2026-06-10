export interface ServicePageDef {
  slug: string;
  title: string;
  dataKey: string;
  description?: string;
}

export interface ServiceCategoryDef {
  slug: string;
  title: string;
  description: string;
  dataKey: string;
  pages: ServicePageDef[];
}

export const SERVICE_CATEGORIES: ServiceCategoryDef[] = [
  {
    slug: "quality",
    title: "Quality",
    description:
      "GMP, GCP, and ISO 13485 quality experts — audit-ready, experienced, and regulatory-aligned.",
    dataKey: "services-quality",
    pages: [
      { slug: "gxp-compliance-auditing", title: "GxP Compliance & Auditing", dataKey: "quality-gxp-compliance-auditing" },
      { slug: "inspection-readiness-quality", title: "Inspection Readiness (Quality)", dataKey: "quality-inspection-readiness-quality" },
      { slug: "computer-system-validation-csv", title: "Computer System Validation (CSV)", dataKey: "quality-computer-system-validation-csv" },
      { slug: "commissioning-qualification-validation-cqv", title: "Commissioning, Qualification & Validation (CQV)", dataKey: "quality-commissioning-qualification-validation-cqv" },
      { slug: "clinical-quality-assurance-cqa", title: "Clinical Quality Assurance (CQA)", dataKey: "quality-clinical-quality-assurance-cqa" },
      { slug: "data-integrity-alcoa-compliance", title: "Data Integrity & ALCOA+ Compliance", dataKey: "quality-data-integrity-alcoa-compliance" },
      { slug: "qa-for-digital-systems-emerging-technologies", title: "QA for Digital Systems & Emerging Technologies", dataKey: "quality-qa-for-digital-systems-emerging-technologies" },
    ],
  },
  {
    slug: "clinical",
    title: "Clinical",
    description:
      "Clinical consulting across pharmaceuticals, medical devices, and biologics — from trial operations to real-world evidence.",
    dataKey: "services-clinical",
    pages: [
      { slug: "pharmaceutical", title: "Pharmaceutical", dataKey: "clinical-pharmaceutical" },
      { slug: "medical-devices", title: "Medical Devices", dataKey: "clinical-medical-devices" },
      { slug: "biologics", title: "Biologics", dataKey: "clinical-biologics" },
      { slug: "full-service-cro", title: "Full-Service CRO", dataKey: "clinical-full-service-cro" },
      { slug: "decentralized-clinical-trials", title: "Decentralized Clinical Trials", dataKey: "clinical-decentralized-clinical-trials" },
      { slug: "embedded-clinical-solutions", title: "Embedded Clinical Solutions", dataKey: "clinical-embedded-clinical-solutions" },
      { slug: "biostatistics-programming", title: "Biostatistics & Programming", dataKey: "clinical-biostatistics-programming" },
      { slug: "medical-writing-transparency", title: "Medical Writing & Transparency", dataKey: "clinical-medical-writing-transparency" },
      { slug: "clinical-operations-management", title: "Clinical Operations Management", dataKey: "clinical-clinical-operations-management" },
      { slug: "study-startup-site-activation", title: "Study Startup & Site Activation", dataKey: "clinical-study-startup-site-activation" },
      { slug: "clinical-data-management", title: "Clinical Data Management", dataKey: "clinical-clinical-data-management" },
      { slug: "real-world-evidence-rwe", title: "Real-World Evidence (RWE)", dataKey: "clinical-real-world-evidence-rwe" },
    ],
  },
  {
    slug: "regulatory",
    title: "Regulatory",
    description:
      "Expert regulatory consulting for pharmaceuticals, medical devices, and biologics across FDA and EU pathways.",
    dataKey: "services-regulatory",
    pages: [
      { slug: "fda-regulatory-strategy-and-consulting", title: "FDA Regulatory Strategy and Consulting", dataKey: "regulatory-fda-regulatory-strategy-and-consulting" },
      { slug: "fda-meeting-consulting-services", title: "FDA Meeting Consulting Services", dataKey: "regulatory-fda-meeting-consulting-services" },
      { slug: "regulatory-operations", title: "Regulatory Operations", dataKey: "regulatory-regulatory-operations" },
      { slug: "market-access-reimbursement-strategy", title: "Market Access & Reimbursement Strategy", dataKey: "regulatory-market-access-reimbursement-strategy" },
      { slug: "advertising-promotional-review-opdp", title: "Advertising & Promotional Review (OPDP)", dataKey: "regulatory-advertising-promotional-review-opdp" },
      { slug: "regulatory-intelligence-guidance-monitoring", title: "Regulatory Intelligence & Guidance Monitoring", dataKey: "regulatory-regulatory-intelligence-guidance-monitoring" },
      { slug: "fda-inspection-readiness", title: "FDA Inspection Readiness", dataKey: "regulatory-fda-inspection-readiness" },
      { slug: "post-approval-regulatory-maintenance", title: "Post-Approval Regulatory Maintenance", dataKey: "regulatory-post-approval-regulatory-maintenance" },
      { slug: "eu-mdr-medical-device-regulation", title: "EU MDR (Medical Device Regulation)", dataKey: "regulatory-eu-mdr-medical-device-regulation" },
      { slug: "eu-ivdr-in-vitro-diagnostic-regulation", title: "EU IVDR (In Vitro Diagnostic Regulation)", dataKey: "regulatory-eu-ivdr-in-vitro-diagnostic-regulation" },
      { slug: "global-regulatory-considerations", title: "Global Regulatory Considerations (FDA and EU MDR/IVDR)", dataKey: "regulatory-global-regulatory-considerations" },
    ],
  },
  {
    slug: "engineering",
    title: "Engineering",
    description:
      "Process engineering, validation, facilities qualification, and manufacturing readiness for regulated environments.",
    dataKey: "services-engineering",
    pages: [
      { slug: "commissioning-qualification-validation-cqv", title: "Commissioning, Qualification & Validation (CQV)", dataKey: "engineering-commissioning-qualification-validation-cqv" },
      { slug: "facilities-equipment-qualification", title: "Facilities & Equipment Qualification", dataKey: "engineering-facilities-equipment-qualification" },
      { slug: "manufacturing-readiness-technical-transfer", title: "Manufacturing Readiness & Technical Transfer", dataKey: "engineering-manufacturing-readiness-technical-transfer" },
      { slug: "engineering-change-control-lifecycle-management", title: "Engineering Change Control & Lifecycle Management", dataKey: "engineering-engineering-change-control-lifecycle-management" },
      { slug: "utilities-cleanroom-systems-qualification", title: "Utilities & Cleanroom Systems Qualification", dataKey: "engineering-utilities-cleanroom-systems-qualification" },
      { slug: "process-engineering-scale-up-support", title: "Process Engineering & Scale-Up Support", dataKey: "engineering-process-engineering-scale-up-support" },
      { slug: "automation-control-systems-gxp", title: "Automation & Control Systems (GxP)", dataKey: "engineering-automation-control-systems-gxp" },
      { slug: "equipment-reliability-preventive-maintenance", title: "Equipment Reliability & Preventive Maintenance", dataKey: "engineering-equipment-reliability-preventive-maintenance" },
    ],
  },
  {
    slug: "scientific",
    title: "Scientific",
    description:
      "Scientific and technical consulting across nonclinical development, CMC, bioanalytics, and due diligence.",
    dataKey: "services-scientific",
    pages: [
      { slug: "nonclinical-development", title: "Nonclinical Development", dataKey: "scientific-nonclinical-development" },
      { slug: "translational-science", title: "Translational Science", dataKey: "scientific-translational-science" },
      { slug: "scientific-technical-consulting", title: "Scientific & Technical Consulting", dataKey: "scientific-scientific-technical-consulting" },
      { slug: "bioanalytical-sciences", title: "Bioanalytical Sciences", dataKey: "scientific-bioanalytical-sciences" },
      { slug: "chemistry-manufacturing-controls-cmc", title: "Chemistry, Manufacturing, and Controls (CMC) Scientific Support", dataKey: "scientific-chemistry-manufacturing-controls-cmc" },
      { slug: "nonclinical-toxicology-strategy", title: "Nonclinical Toxicology Strategy", dataKey: "scientific-nonclinical-toxicology-strategy" },
      { slug: "biomarker-development-validation", title: "Biomarker Development & Validation", dataKey: "scientific-biomarker-development-validation" },
      { slug: "scientific-due-diligence-program-assessment", title: "Scientific Due Diligence & Program Assessment", dataKey: "scientific-scientific-due-diligence-program-assessment" },
    ],
  },
  {
    slug: "pharmacovigilance",
    title: "Pharmacovigilance",
    description:
      "Drug safety, ICSR management, signal detection, and global pharmacovigilance compliance across development and post-market.",
    dataKey: "services-pharmacovigilance",
    pages: [
      { slug: "adverse-event-reporting", title: "Adverse Event Reporting Across Clinical Trials and Post-Market", dataKey: "pv-adverse-event-reporting" },
      { slug: "comprehensive-icsr-management", title: "Comprehensive ICSR Management for Global Compliance", dataKey: "pv-comprehensive-icsr-management" },
      { slug: "proactive-signal-detection-risk-management", title: "Proactive Signal Detection and Risk Management in Drug Safety", dataKey: "pv-proactive-signal-detection-risk-management" },
      { slug: "pharmacovigilance-gap-analysis", title: "Pharmacovigilance Gap Analysis: Strengthening Your Compliance Framework", dataKey: "pv-pharmacovigilance-gap-analysis" },
      { slug: "post-market-surveillance", title: "Post-Market Surveillance: Ensuring Ongoing Drug Safety", dataKey: "pv-post-market-surveillance" },
      { slug: "literature-surveillance", title: "Literature Surveillance for Pharmacovigilance: Tracking Emerging Risks", dataKey: "pv-literature-surveillance" },
      { slug: "preparing-pharmacovigilance-audits", title: "Preparing for Pharmacovigilance Audits: Best Practices for Compliance", dataKey: "pv-preparing-pharmacovigilance-audits" },
      { slug: "internal-pharmacovigilance-audits", title: "Internal Pharmacovigilance Audits: Ensuring Regulatory Readiness", dataKey: "pv-internal-pharmacovigilance-audits" },
      { slug: "role-of-qppv", title: "The Role of the QPPV in Ensuring Global Pharmacovigilance Compliance", dataKey: "pv-role-of-qppv" },
      { slug: "european-pharmacovigilance-standards-qppv", title: "Meeting European Pharmacovigilance Standards with QPPV Oversight", dataKey: "pv-european-pharmacovigilance-standards-qppv" },
      { slug: "observational-studies-real-world-evidence", title: "Observational Studies and Real-World Evidence in Drug Safety", dataKey: "pv-observational-studies-real-world-evidence" },
    ],
  },
];

export function getCategory(slug: string): ServiceCategoryDef | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

export function getServicePage(categorySlug: string, pageSlug: string): {
  category: ServiceCategoryDef;
  page: ServicePageDef;
} | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const page = category.pages.find((p) => p.slug === pageSlug);
  if (!page) return undefined;
  return { category, page };
}

export function allServicePaths(): { category: string; slug: string }[] {
  return SERVICE_CATEGORIES.flatMap((c) =>
    c.pages.map((p) => ({ category: c.slug, slug: p.slug }))
  );
}

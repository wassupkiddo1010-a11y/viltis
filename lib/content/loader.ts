import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { cleanParagraphs, toSections, excerptFromParagraphs, type ContentSection } from "./parse-body";

export interface PageContent {
  title: string;
  excerpt: string;
  paragraphs: string[];
  sections: ContentSection[];
  sourceUrl?: string;
}

interface RawPage {
  key: string;
  url?: string;
  ok?: boolean;
  title: string;
  body: string;
}

const DATA_DIR = join(process.cwd(), "lib/content/data");

/** Fallback content for pages not found on viltis.com (404). */
const FALLBACKS: Record<string, { paragraphs: string[] }> = {
  "regulatory-global-regulatory-considerations": {
    paragraphs: [
      "Navigating global regulatory requirements demands a unified strategy across FDA, EU MDR/IVDR, and international markets. Viltis helps organizations align submission pathways, labeling, and post-market obligations across jurisdictions.",
      "Our consultants support gap assessments, regulatory intelligence, and cross-functional planning so your product portfolio meets evolving global standards without duplicating effort.",
    ],
  },
  "scientific-chemistry-manufacturing-controls-cmc": {
    paragraphs: [
      "Chemistry, Manufacturing, and Controls (CMC) scientific support is essential for demonstrating product quality, consistency, and control throughout development and commercialization.",
      "Viltis provides CMC strategy, analytical method development oversight, and technical writing support aligned with FDA and ICH expectations for pharmaceuticals and biologics.",
    ],
  },
  "pv-adverse-event-reporting": {
    paragraphs: [
      "Adverse event reporting across clinical trials and post-market settings requires timely, accurate, and regulation-compliant processes. Viltis supports end-to-end adverse event intake, assessment, and submission workflows.",
      "Our team ensures expedited reporting timelines are met while maintaining data quality and integration with your pharmacovigilance systems.",
    ],
  },
  "pv-comprehensive-icsr-management": {
    paragraphs: [
      "Comprehensive Individual Case Safety Report (ICSR) management is foundational to global pharmacovigilance compliance. Viltis manages the full ICSR lifecycle from intake through MedDRA coding and regulatory submission.",
      "We align processes with ICH E2B (R3) standards and regional requirements to ensure consistent, audit-ready case processing.",
    ],
  },
  "pv-proactive-signal-detection-risk-management": {
    paragraphs: [
      "Proactive signal detection and risk management strengthen drug safety programs before issues escalate. Viltis applies structured methodologies to identify, validate, and manage safety signals across clinical and post-market data.",
      "Our experts support risk minimization measures and benefit-risk assessments aligned with regulatory expectations.",
    ],
  },
  "pv-pharmacovigilance-gap-analysis": {
    paragraphs: [
      "A pharmacovigilance gap analysis identifies weaknesses in processes, systems, and documentation before they become compliance risks. Viltis evaluates your PV framework against global standards and delivers actionable remediation plans.",
    ],
  },
  "pv-post-market-surveillance": {
    paragraphs: [
      "Post-market surveillance ensures ongoing drug safety after approval. Viltis designs and executes surveillance strategies including PASS, registries, and periodic safety reporting to maintain benefit-risk balance.",
    ],
  },
  "pv-literature-surveillance": {
    paragraphs: [
      "Literature surveillance for pharmacovigilance tracks emerging safety information from global publications. Viltis implements systematic monitoring, data extraction, and regulatory reporting workflows.",
    ],
  },
  "pv-preparing-pharmacovigilance-audits": {
    paragraphs: [
      "Preparing for pharmacovigilance audits requires organized documentation, trained personnel, and validated processes. Viltis helps you build audit-ready PV systems and mock inspection programs.",
    ],
  },
  "pv-internal-pharmacovigilance-audits": {
    paragraphs: [
      "Internal pharmacovigilance audits provide independent assurance that safety processes function as intended. Viltis conducts risk-based internal audits with clear findings and CAPA recommendations.",
    ],
  },
  "pv-role-of-qppv": {
    paragraphs: [
      "The Qualified Person for Pharmacovigilance (QPPV) plays a central role in EU pharmacovigilance systems. Viltis provides QPPV services and oversight to ensure global compliance with European safety requirements.",
    ],
  },
  "pv-european-pharmacovigilance-standards-qppv": {
    paragraphs: [
      "Meeting European pharmacovigilance standards requires dedicated QPPV oversight, PSUR/PBRER management, and EudraVigilance reporting. Viltis supports EU PV system establishment and ongoing maintenance.",
    ],
  },
  "pv-observational-studies-real-world-evidence": {
    paragraphs: [
      "Observational studies and real-world evidence strengthen drug safety understanding beyond clinical trials. Viltis designs PASS protocols and analyzes real-world data to support safety decision-making.",
    ],
  },
};

function decodeTitle(title: string): string {
  return title.replace(/&amp;/g, "&").replace(/&#8217;/g, "'");
}

function loadRaw(key: string): RawPage | null {
  const path = join(DATA_DIR, `${key}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as RawPage;
  } catch {
    return null;
  }
}

export function loadPageContent(dataKey: string, fallbackTitle?: string): PageContent {
  const raw = loadRaw(dataKey);
  const title = decodeTitle(raw?.title ?? fallbackTitle ?? dataKey);

  let paragraphs: string[] = [];
  if (raw?.ok && raw.body) {
    paragraphs = cleanParagraphs(raw.body, title);
  }

  if (!paragraphs.length && FALLBACKS[dataKey]) {
    paragraphs = FALLBACKS[dataKey].paragraphs;
  }

  if (!paragraphs.length && fallbackTitle) {
    paragraphs = [
      `Viltis provides expert ${fallbackTitle.toLowerCase()} support for pharmaceutical, biotech, and medical device organizations.`,
      "Contact our team to discuss your program needs, timeline, and resourcing requirements.",
    ];
  }

  return {
    title,
    excerpt: excerptFromParagraphs(paragraphs),
    paragraphs,
    sections: toSections(paragraphs),
    sourceUrl: raw?.url,
  };
}

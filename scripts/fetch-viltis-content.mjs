/**
 * Fetches page content from viltis.com and writes lib/content/data/*.json
 * Run: node scripts/fetch-viltis-content.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../lib/content/data");

const PAGES = [
  { key: "work-with-us", url: "https://viltis.com/engagement/" },
  { key: "about", url: "https://viltis.com/about/" },
  { key: "contact", url: "https://viltis.com/contact-us/" },
  { key: "case-studies", url: "https://viltis.com/case-studies/" },
  { key: "blog", url: "https://viltis.com/blog/" },
  { key: "services", url: "https://viltis.com/services/" },
  { key: "services-quality", url: "https://viltis.com/services/quality/" },
  { key: "services-clinical", url: "https://viltis.com/services/clinical/" },
  { key: "services-regulatory", url: "https://viltis.com/services/regulatory/" },
  { key: "services-engineering", url: "https://viltis.com/services/engineering/" },
  { key: "services-scientific", url: "https://viltis.com/services/scientific/" },
  { key: "services-pharmacovigilance", url: "https://viltis.com/services/pharmacovigilance/" },
  // Quality
  { key: "quality-gxp-compliance-auditing", url: "https://viltis.com/services/quality/gxp-compliance-auditing/" },
  { key: "quality-inspection-readiness-quality", url: "https://viltis.com/services/quality/inspection-readiness-quality/" },
  { key: "quality-computer-system-validation-csv", url: "https://viltis.com/services/quality/computer-system-validation-csv/" },
  { key: "quality-commissioning-qualification-validation-cqv", url: "https://viltis.com/services/quality/commissioning-qualification-validation-cqv/" },
  { key: "quality-clinical-quality-assurance-cqa", url: "https://viltis.com/services/quality/clinical-quality-assurance-cqa/" },
  { key: "quality-data-integrity-alcoa-compliance", url: "https://viltis.com/services/quality/data-integrity-alcoa-compliance/" },
  { key: "quality-qa-for-digital-systems-emerging-technologies", url: "https://viltis.com/services/quality/qa-for-digital-systems-emerging-technologies/" },
  // Clinical
  { key: "clinical-pharmaceutical", url: "https://viltis.com/services/clinical/pharmaceutical/" },
  { key: "clinical-medical-devices", url: "https://viltis.com/services/clinical/medical-devices/" },
  { key: "clinical-biologics", url: "https://viltis.com/services/clinical/biologics/" },
  { key: "clinical-full-service-cro", url: "https://viltis.com/services/clinical/full-service-cro/" },
  { key: "clinical-decentralized-clinical-trials", url: "https://viltis.com/services/clinical/decentralized-clinical-trials/" },
  { key: "clinical-embedded-clinical-solutions", url: "https://viltis.com/services/clinical/embedded-clinical-solutions/" },
  { key: "clinical-biostatistics-programming", url: "https://viltis.com/services/clinical/biostatistics-programming/" },
  { key: "clinical-medical-writing-transparency", url: "https://viltis.com/services/clinical/medical-writing-transparency/" },
  { key: "clinical-clinical-operations-management", url: "https://viltis.com/services/clinical/clinical-operations-management/" },
  { key: "clinical-study-startup-site-activation", url: "https://viltis.com/services/clinical/study-startup-site-activation/" },
  { key: "clinical-clinical-data-management", url: "https://viltis.com/services/clinical/clinical-data-management/" },
  { key: "clinical-real-world-evidence-rwe", url: "https://viltis.com/services/clinical/real-world-evidence-rwe/" },
  // Regulatory
  { key: "regulatory-fda-regulatory-strategy-and-consulting", url: "https://viltis.com/services/regulatory/fda-strategy-and-consulting/" },
  { key: "regulatory-fda-meeting-consulting-services", url: "https://viltis.com/services/regulatory/fda-meeting-consulting-services/" },
  { key: "regulatory-regulatory-operations", url: "https://viltis.com/services/regulatory/regulatory-operations/" },
  { key: "regulatory-market-access-reimbursement-strategy", url: "https://viltis.com/services/regulatory/market-access-reimbursement-strategy/" },
  { key: "regulatory-advertising-promotional-review-opdp", url: "https://viltis.com/services/regulatory/advertising-promotional-review-opdp/" },
  { key: "regulatory-regulatory-intelligence-guidance-monitoring", url: "https://viltis.com/services/regulatory/regulatory-intelligence-guidance-monitoring/" },
  { key: "regulatory-fda-inspection-readiness", url: "https://viltis.com/services/regulatory/fda-inspection-readiness/" },
  { key: "regulatory-post-approval-regulatory-maintenance", url: "https://viltis.com/services/regulatory/post-approval-regulatory-maintenance/" },
  { key: "regulatory-eu-mdr-medical-device-regulation", url: "https://viltis.com/services/regulatory/eu-mdr-medical-device-regulation/" },
  { key: "regulatory-eu-ivdr-in-vitro-diagnostic-regulation", url: "https://viltis.com/services/regulatory/eu-ivdr-in-vitro-diagnostic-regulation/" },
  { key: "regulatory-global-regulatory-considerations", url: "https://viltis.com/services/regulatory/global-regulatory-considerations/" },
  // Engineering
  { key: "engineering-commissioning-qualification-validation-cqv", url: "https://viltis.com/services/engineering/commissioning-qualification-validation-cqv/" },
  { key: "engineering-facilities-equipment-qualification", url: "https://viltis.com/services/engineering/facilities-equipment-qualification/" },
  { key: "engineering-manufacturing-readiness-technical-transfer", url: "https://viltis.com/services/engineering/manufacturing-readiness-technical-transfer/" },
  { key: "engineering-engineering-change-control-lifecycle-management", url: "https://viltis.com/services/engineering/engineering-change-control-lifecycle-management/" },
  { key: "engineering-utilities-cleanroom-systems-qualification", url: "https://viltis.com/services/engineering/utilities-cleanroom-systems-qualification/" },
  { key: "engineering-process-engineering-scale-up-support", url: "https://viltis.com/services/engineering/process-engineering-scale-up-support/" },
  { key: "engineering-automation-control-systems-gxp", url: "https://viltis.com/services/engineering/automation-control-systems-gxp/" },
  { key: "engineering-equipment-reliability-preventive-maintenance", url: "https://viltis.com/services/engineering/equipment-reliability-preventive-maintenance/" },
  // Scientific
  { key: "scientific-nonclinical-development", url: "https://viltis.com/services/scientific/nonclinical-development/" },
  { key: "scientific-translational-science", url: "https://viltis.com/services/scientific/translational-science/" },
  { key: "scientific-scientific-technical-consulting", url: "https://viltis.com/services/scientific/scientific-technical-consulting/" },
  { key: "scientific-bioanalytical-sciences", url: "https://viltis.com/services/scientific/bioanalytical-sciences/" },
  { key: "scientific-chemistry-manufacturing-controls-cmc", url: "https://viltis.com/services/scientific/chemistry-manufacturing-controls-cmc/" },
  { key: "scientific-nonclinical-toxicology-strategy", url: "https://viltis.com/services/scientific/nonclinical-toxicology-strategy/" },
  { key: "scientific-biomarker-development-validation", url: "https://viltis.com/services/scientific/biomarker-development-validation/" },
  { key: "scientific-scientific-due-diligence-program-assessment", url: "https://viltis.com/services/scientific/scientific-due-diligence-program-assessment/" },
  // Pharmacovigilance
  { key: "pv-adverse-event-reporting", url: "https://viltis.com/services/pharmacovigilance/adverse-event-reporting/" },
  { key: "pv-comprehensive-icsr-management", url: "https://viltis.com/services/pharmacovigilance/comprehensive-icsr-management/" },
  { key: "pv-proactive-signal-detection-risk-management", url: "https://viltis.com/services/pharmacovigilance/proactive-signal-detection-risk-management/" },
  { key: "pv-pharmacovigilance-gap-analysis", url: "https://viltis.com/services/pharmacovigilance/pharmacovigilance-gap-analysis/" },
  { key: "pv-post-market-surveillance", url: "https://viltis.com/services/pharmacovigilance/post-market-surveillance/" },
  { key: "pv-literature-surveillance", url: "https://viltis.com/services/pharmacovigilance/literature-surveillance/" },
  { key: "pv-preparing-pharmacovigilance-audits", url: "https://viltis.com/services/pharmacovigilance/preparing-pharmacovigilance-audits/" },
  { key: "pv-internal-pharmacovigilance-audits", url: "https://viltis.com/services/pharmacovigilance/internal-pharmacovigilance-audits/" },
  { key: "pv-role-of-qppv", url: "https://viltis.com/services/pharmacovigilance/role-of-qppv/" },
  { key: "pv-european-pharmacovigilance-standards-qppv", url: "https://viltis.com/services/pharmacovigilance/european-pharmacovigilance-standards-qppv/" },
  { key: "pv-observational-studies-real-world-evidence", url: "https://viltis.com/services/pharmacovigilance/observational-studies-real-world-evidence/" },
  // Case studies
  { key: "cs-biologics-cmc-analytical", url: "https://viltis.com/case-studies/case-study-biologics-cmc-analytical-dev-consultant/" },
  { key: "cs-manufacturing-quality", url: "https://viltis.com/case-studies/case-study-manufacturing-quality-and-process-team/" },
  { key: "cs-biologics-cmc-pip", url: "https://viltis.com/case-studies/case-study-biologics-cmc-pip/" },
  { key: "cs-phase-iii-scd", url: "https://viltis.com/case-studies/phase-iii-biologic-sickle-cell-disease-scd/" },
  { key: "cs-dhf-remediation", url: "https://viltis.com/case-studies/dhf-remediation-support-for-class-i-medical-devices/" },
  { key: "cs-abbott-cardiovascular", url: "https://viltis.com/case-studies/design-and-development-support-for-abbotts-cardiovascular-division/" },
  { key: "cs-abbott-cardiovascular-2", url: "https://viltis.com/case-studies/design-and-development-support-for-abbotts-cardiovascular-division-1/" },
  // Blog
  { key: "blog-contract-consulting", url: "https://viltis.com/blog/contract-and-consulting-support-in-the-life-sciences-industry/" },
  { key: "blog-483-warning", url: "https://viltis.com/blog/483-warning-letters-how-to-resolve-them/" },
  { key: "blog-3d-printing", url: "https://viltis.com/blog/3d-printing-of-medical-devices/" },
  { key: "blog-compounding", url: "https://viltis.com/blog/compounding-outsourcing-facilities-current-good-manufacturing/" },
  { key: "blog-fda-devices", url: "https://viltis.com/blog/fda-oversight-for-medical-devices-insight-into-regulatory-process/" },
  { key: "blog-pharmacovigilance", url: "https://viltis.com/blog/pharmacovigilance-then-and-now/" },
];

function stripMarkdown(md) {
  return md
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function parseSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let current = { heading: null, paragraphs: [], bullets: [] };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);
    const h1 = line.match(/^#\s+(.+)/);
    const bullet = line.match(/^[-•]\s+(.+)/);

    if (h1 || h2 || h3) {
      if (current.heading || current.paragraphs.length || current.bullets.length) {
        sections.push(current);
      }
      current = { heading: (h1 || h2 || h3)[1].trim(), paragraphs: [], bullets: [] };
    } else if (bullet) {
      current.bullets.push(bullet[1].trim());
    } else if (line.trim() && !line.startsWith("---")) {
      current.paragraphs.push(line.trim());
    }
  }
  if (current.heading || current.paragraphs.length || current.bullets.length) {
    sections.push(current);
  }
  return sections;
}

async function fetchPage({ key, url }) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ViltisContentMigration/1.0" },
    });
    if (!res.ok) return { key, url, ok: false, status: res.status };
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s*[-|]\s*Viltis.*$/i, "").trim() : key;

    // crude text extraction
    const body = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<form[\s\S]*?<\/form>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#8217;/g, "'")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const skip = new Set([
      "Services", "Contact us", "Your Name", "Email", "Contact Number",
      "Job Type", "Comments", "Message", "captcha", "Submit",
      "How Can We Help?", "Contact Us Today!", "Contact",
    ]);

    const paragraphs = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 20 && !skip.has(l));

    return {
      key,
      url,
      ok: true,
      title,
      excerpt: paragraphs[0]?.slice(0, 280) ?? "",
      body: paragraphs.join("\n\n"),
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return { key, url, ok: false, error: String(err) };
  }
}

async function main() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

  const results = [];
  for (const page of PAGES) {
    process.stdout.write(`Fetching ${page.key}... `);
    const data = await fetchPage(page);
    console.log(data.ok ? "ok" : `FAIL (${data.status || data.error})`);
    writeFileSync(join(OUT, `${page.key}.json`), JSON.stringify(data, null, 2));
    results.push({ key: page.key, ok: data.ok });
    await new Promise((r) => setTimeout(r, 300));
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`\nDone: ${ok}/${results.length} pages fetched.`);
  writeFileSync(join(OUT, "_index.json"), JSON.stringify(results, null, 2));
}

main();

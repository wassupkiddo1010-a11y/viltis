import { NAV_NOISE } from "./nav-noise";

export interface ContentSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
}

function isNoise(block: string, pageTitle: string): boolean {
  const t = decodeEntities(block.trim());
  if (!t) return true;
  if (NAV_NOISE.has(t)) return true;
  if (t === pageTitle || t === `${pageTitle} - Viltis`) return true;
  if (t.endsWith(" - Viltis")) return true;
  if (t.startsWith("Where does your business need more support")) return true;
  if (/^(Your Name|Email|Contact Number|Job Type|Comments|Message|captcha|Submit)$/i.test(t)) return true;
  if (t.length < 30 && !t.includes(".") && !t.endsWith(":")) return true;
  return false;
}

/** Split raw scraped body into clean paragraphs. */
export function cleanParagraphs(body: string, pageTitle: string): string[] {
  const title = decodeEntities(pageTitle);
  return body
    .split("\n\n")
    .map((b) => decodeEntities(b.trim()))
    .filter((b) => !isNoise(b, title));
}

/** Group label-colon blocks into sections (e.g. "Protocol Development:" + paragraph). */
export function toSections(paragraphs: string[]): ContentSection[] {
  const sections: ContentSection[] = [];
  let current: ContentSection = { paragraphs: [] };

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const isHeading = p.endsWith(":") && p.length < 120 && !p.includes(".");

    if (isHeading) {
      if (current.heading || current.paragraphs.length || current.bullets?.length) {
        sections.push(current);
      }
      const next = paragraphs[i + 1];
      const isBulletList =
        next &&
        !next.endsWith(":") &&
        paragraphs.slice(i + 1).some((x, j) => j < 6 && x.length < 90 && !x.includes("."));

      if (isBulletList && next && !next.includes(".")) {
        const bullets: string[] = [];
        let j = i + 1;
        while (j < paragraphs.length && paragraphs[j].length < 100 && !paragraphs[j].endsWith(":")) {
          if (paragraphs[j].includes(".") && paragraphs[j].length > 60) break;
          bullets.push(paragraphs[j]);
          j++;
        }
        sections.push({ heading: p.replace(/:$/, ""), paragraphs: [], bullets });
        i = j - 1;
        current = { paragraphs: [] };
      } else {
        current = { heading: p.replace(/:$/, ""), paragraphs: [] };
      }
    } else if (p.endsWith(":") === false && p.includes(" commonly include:")) {
      if (current.heading || current.paragraphs.length) sections.push(current);
      const bullets: string[] = [];
      let j = i + 1;
      while (j < paragraphs.length && paragraphs[j].length < 120) {
        bullets.push(paragraphs[j].replace(/^:\s*/, "").trim());
        j++;
        if (j < paragraphs.length && paragraphs[j].length > 120) break;
      }
      sections.push({ heading: undefined, paragraphs: [p], bullets });
      i = j - 1;
      current = { paragraphs: [] };
    } else {
      current.paragraphs.push(p);
    }
  }

  if (current.heading || current.paragraphs.length || current.bullets?.length) {
    sections.push(current);
  }

  if (!sections.length && paragraphs.length) {
    return [{ paragraphs }];
  }

  return sections;
}

export function excerptFromParagraphs(paragraphs: string[], max = 200): string {
  const first = paragraphs.find((p) => p.length > 80) ?? paragraphs[0] ?? "";
  return first.length > max ? `${first.slice(0, max).trim()}…` : first;
}

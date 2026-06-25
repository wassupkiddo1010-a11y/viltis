import "server-only";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatAction {
  label: string;
  url: string;
}

export interface ParsedLead {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  area_of_need?: string;
  engagement_type?: string;
}

export const FALLBACK_REPLY =
  "Sorry — I'm having trouble right now. For consulting or resourcing, email info@viltis.com or visit our contact page. For urgent staffing, email info@viltis.com directly.";

export const FALLBACK_ACTIONS: ChatAction[] = [
  { label: "Contact", url: "https://viltis.com/contact" },
  { label: "Schedule a Call", url: "https://viltis.com/schedule-a-call" },
];

const LEAD_RE = /\[\[VILTIS_LEAD\]\]([\s\S]*?)\[\[\/VILTIS_LEAD\]\]/g;
const ACTIONS_RE = /\[\[VILTIS_ACTIONS\]\]([\s\S]*?)\[\[\/VILTIS_ACTIONS\]\]/g;
const ALLOWED_ORIGIN = "https://viltis.com";

function extractFirstJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw.trim()) as T;
  } catch {
    return null;
  }
}

function sanitizeActions(raw: unknown): ChatAction[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatAction[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = (item as { label?: unknown }).label;
    const url = (item as { url?: unknown }).url;
    if (typeof label !== "string" || typeof url !== "string") continue;
    if (!url.startsWith(ALLOWED_ORIGIN)) continue;
    out.push({ label: label.trim().slice(0, 80), url });
    if (out.length >= 3) break;
  }
  return out;
}

export function parseControlBlocks(rawText: string): {
  reply: string;
  lead: ParsedLead | null;
  actions: ChatAction[];
} {
  let lead: ParsedLead | null = null;
  let actions: ChatAction[] = [];

  const leadMatch = LEAD_RE.exec(rawText);
  if (leadMatch) {
    lead = extractFirstJson<ParsedLead>(leadMatch[1]);
  }
  LEAD_RE.lastIndex = 0;

  const actionsMatch = ACTIONS_RE.exec(rawText);
  if (actionsMatch) {
    actions = sanitizeActions(extractFirstJson<unknown>(actionsMatch[1]));
  }
  ACTIONS_RE.lastIndex = 0;

  const reply = rawText
    .replace(LEAD_RE, "")
    .replace(ACTIONS_RE, "")
    .trim();

  return { reply, lead, actions };
}

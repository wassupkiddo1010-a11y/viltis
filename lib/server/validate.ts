import "server-only";
import type { ChatMessage, ParsedLead } from "@/lib/server/parseControlBlocks";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AREA_OF_NEED = new Set([
  "Quality",
  "Regulatory",
  "Clinical",
  "Engineering",
  "Scientific",
  "Pharmacovigilance",
  "Consultant Resourcing",
  "Other",
]);

const ENGAGEMENT_TYPE = new Set([
  "Consulting",
  "Staff Augmentation",
  "Full-Time Hire",
  "Job Seeker",
  "Unknown",
]);

const MAX_MESSAGES = 40;
const MAX_CONTENT = 4000;
const MAX_FIELD = 200;

function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export function normalizeSessionId(value: unknown): string {
  if (typeof value === "string" && UUID_RE.test(value)) return value;
  return crypto.randomUUID();
}

export function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;

  const out: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const cleaned = truncate(stripControlChars(content), MAX_CONTENT);
    if (!cleaned) continue;
    out.push({ role, content: cleaned });
  }

  if (out.length === 0 || out.length > MAX_MESSAGES) return null;
  return out;
}

export interface ValidatedLead {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  area_of_need: string;
  engagement_type: string;
}

export function validateLead(raw: ParsedLead | null): ValidatedLead | null {
  if (!raw || typeof raw !== "object") return null;

  const name = raw.name ? truncate(stripControlChars(String(raw.name)), MAX_FIELD) : "";
  const emailRaw = raw.email ? stripControlChars(String(raw.email)).toLowerCase() : "";
  const email = EMAIL_RE.test(emailRaw) ? emailRaw : "";
  const phone = raw.phone
    ? truncate(stripControlChars(String(raw.phone)).replace(/[^\d+\s()-]/g, ""), 32)
    : "";
  const company = raw.company ? truncate(stripControlChars(String(raw.company)), MAX_FIELD) : "";

  if (!email && !phone) return null;

  const areaRaw = raw.area_of_need ? stripControlChars(String(raw.area_of_need)) : "";
  const area_of_need = AREA_OF_NEED.has(areaRaw) ? areaRaw : "Other";

  const engRaw = raw.engagement_type ? stripControlChars(String(raw.engagement_type)) : "";
  const engagement_type = ENGAGEMENT_TYPE.has(engRaw) ? engRaw : "Unknown";

  const lead: ValidatedLead = { area_of_need, engagement_type };
  if (name) lead.name = name;
  if (email) lead.email = email;
  if (phone) lead.phone = phone;
  if (company) lead.company = company;

  return lead;
}

export function countUserTurns(messages: ChatMessage[]): number {
  return messages.filter((m) => m.role === "user").length;
}

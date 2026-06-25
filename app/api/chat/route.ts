import { NextRequest, NextResponse } from "next/server";
import { writeLeadToAirtable } from "@/lib/server/airtable";
import { callLLM, isChatConfigured } from "@/lib/server/llm";
import {
  FALLBACK_ACTIONS,
  FALLBACK_REPLY,
  parseControlBlocks,
} from "@/lib/server/parseControlBlocks";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import {
  countUserTurns,
  normalizeSessionId,
  sanitizeMessages,
  validateLead,
} from "@/lib/server/validate";

export const runtime = "nodejs";

const SITE_ORIGINS = ["https://viltis.com", "https://www.viltis.com"] as const;

function getAllowedOrigins(): string[] {
  const primary = process.env.ALLOWED_ORIGIN?.replace(/\/$/, "") || "https://viltis.com";
  const origins = new Set<string>([primary, ...SITE_ORIGINS]);
  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return [...origins];
}

function isOriginAllowed(origin: string | null): boolean {
  const allowed = getAllowedOrigins();
  if (!origin) {
    // Production: reject direct API calls (curl/bots) with no Origin header.
    return process.env.NODE_ENV === "development";
  }
  return allowed.includes(origin);
}

function corsHeaders(requestOrigin: string | null): Record<string, string> {
  const allowed = getAllowedOrigins();
  const reflectOrigin =
    requestOrigin && allowed.includes(requestOrigin) ? requestOrigin : allowed[0];

  return {
    "Access-Control-Allow-Origin": reflectOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(
  body: { reply: string; actions: { label: string; url: string }[] },
  requestOrigin: string | null,
  status = 200,
) {
  return NextResponse.json(body, { status, headers: corsHeaders(requestOrigin) });
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!isOriginAllowed(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawSessionId =
    body && typeof body === "object" && "sessionId" in body
      ? (body as { sessionId: unknown }).sessionId
      : undefined;
  const sessionId = normalizeSessionId(rawSessionId);

  const rawMessages =
    body && typeof body === "object" && "messages" in body
      ? (body as { messages: unknown }).messages
      : undefined;
  const messages = sanitizeMessages(rawMessages);
  if (!messages) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const ip = getClientIp(req.headers.get("x-forwarded-for"));
  if (!checkRateLimit(ip, sessionId)) {
    return jsonResponse(
      {
        reply:
          "You're sending messages quickly — please wait a moment, or email info@viltis.com and we'll respond promptly.",
        actions: FALLBACK_ACTIONS,
      },
      origin,
      429,
    );
  }

  if (!isChatConfigured()) {
    return jsonResponse({ reply: FALLBACK_REPLY, actions: FALLBACK_ACTIONS }, origin);
  }

  const userTurns = countUserTurns(messages);
  const rawModelText = await callLLM(messages, userTurns);

  if (!rawModelText) {
    return jsonResponse({ reply: FALLBACK_REPLY, actions: FALLBACK_ACTIONS }, origin);
  }

  const { reply, lead, actions } = parseControlBlocks(rawModelText);
  const validatedLead = validateLead(lead);

  if (validatedLead) {
    await writeLeadToAirtable(validatedLead);
  }

  return jsonResponse(
    {
      reply: reply || FALLBACK_REPLY,
      actions: actions.length > 0 ? actions : [],
    },
    origin,
  );
}

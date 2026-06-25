# Viltis Chatbot Backend

The site chatbot ("Viltis Assistant") uses a secure server-side pipeline:

**Browser widget → `POST /api/chat` → OpenAI → parse control blocks → Airtable (leads) → `{ reply, actions }`**

The system prompt, API keys, and raw control blocks never reach the client.

## Environment variables

Add these to `.env.local` (server-only — never prefix with `NEXT_PUBLIC_`):

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_MODEL` | No | Default: `gpt-4.1` |
| `AIRTABLE_API_KEY` | For leads | Airtable Personal Access Token |
| `AIRTABLE_BASE_ID` | For leads | Airtable base ID |
| `AIRTABLE_TABLE_NAME` | No | Default: `Leads` |
| `ALLOWED_ORIGIN` | No | Default: `https://viltis.com`. `https://www.viltis.com` is also always allowed. |

For local development, `http://localhost:3000` is allowed automatically when `NODE_ENV=development`.

## Airtable table schema

Create a table named **Leads** (or match `AIRTABLE_TABLE_NAME`) with these fields:

| Field | Type | Options |
|-------|------|---------|
| Name | Single line text | |
| Email | Email | |
| Phone | Single line text | |
| Company | Single line text | |
| Area of Need | Single select | Quality, Regulatory, Clinical, Engineering, Scientific, Pharmacovigilance, Consultant Resourcing, Other |
| Engagement Type | Single select | Consulting, Staff Augmentation, Full-Time Hire, Job Seeker, Unknown |

Leads are written when the assistant captures contact info (email or phone required).

## Architecture

| File | Purpose |
|------|---------|
| `app/api/chat/route.ts` | Chat endpoint |
| `lib/server/viltisSystemPrompt.ts` | System prompt (server-only) |
| `lib/server/llm.ts` | OpenAI wrapper |
| `lib/server/parseControlBlocks.ts` | Strip `[[VILTIS_LEAD]]` / `[[VILTIS_ACTIONS]]` |
| `lib/server/validate.ts` | Input + lead validation |
| `lib/server/rateLimit.ts` | Per-IP/session rate limits |
| `lib/server/airtable.ts` | Lead writer |
| `components/site/chatbot-widget.tsx` | Frontend widget |

## Rate limits

- 20 requests per minute per IP and per session
- 200 requests per day per IP and per session

In-memory limiter on the server (sufficient for light chat use).

## Production hardening

- **Origin required** on `POST /api/chat` in production (`https://viltis.com`, `https://www.viltis.com`, or `ALLOWED_ORIGIN`). Requests with no `Origin` header are rejected (blocks curl/bot abuse).
- Optional: **Vercel Firewall** rate limit on path `/api/chat` (Vercel dashboard → Firewall).

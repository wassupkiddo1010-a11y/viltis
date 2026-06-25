import "server-only";
import OpenAI from "openai";
import type { ChatMessage } from "@/lib/server/parseControlBlocks";
import { VILTIS_SYSTEM_PROMPT } from "@/lib/server/viltisSystemPrompt";

const DEFAULT_MODEL = "gpt-4.1";
const TIMEOUT_MS = 10_000;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function isChatConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function callLLM(
  messages: ChatMessage[],
  userTurns: number,
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  const stateHint = `\n\nINTERNAL_STATE: user_turns=${userTurns}. If user_turns>=3, do not ask further clarifying questions; move to routing + optional contact capture.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await client.chat.completions.create(
      {
        model,
        max_tokens: 700,
        messages: [
          { role: "system", content: VILTIS_SYSTEM_PROMPT + stateHint },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      },
      { signal: controller.signal },
    );

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("[chat/llm] request failed:", err instanceof Error ? err.name : "error");
    return null;
  } finally {
    clearTimeout(timer);
  }
}

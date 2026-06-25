import "server-only";
import type { ValidatedLead } from "@/lib/server/validate";

function getAirtableConfig(): { apiKey: string; baseId: string; tableName: string } | null {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Leads";
  if (!apiKey || !baseId) return null;
  return { apiKey, baseId, tableName };
}

function leadToFields(lead: ValidatedLead): Record<string, string> {
  const fields: Record<string, string> = {
    "Area of Need": lead.area_of_need,
    "Engagement Type": lead.engagement_type,
  };
  if (lead.name) fields.Name = lead.name;
  if (lead.email) fields.Email = lead.email;
  if (lead.phone) fields.Phone = lead.phone;
  if (lead.company) fields.Company = lead.company;
  return fields;
}

export async function writeLeadToAirtable(lead: ValidatedLead): Promise<void> {
  const config = getAirtableConfig();
  if (!config) {
    console.warn("[chat/airtable] missing config — skipping lead write");
    return;
  }

  const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: leadToFields(lead), typecast: true }),
    });

    if (!res.ok) {
      console.error("[chat/airtable] write failed:", res.status);
    }
  } catch (err) {
    console.error("[chat/airtable] write error:", err instanceof Error ? err.name : "error");
  }
}

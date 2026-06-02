/**
 * /api/cron/sync-jobs
 *
 * Syncs open Bullhorn jobs → Supabase (dedupe, format descriptions, remove closed).
 * Visitors always read from Supabase — no Bullhorn latency on page loads.
 *
 * Triggers (pick one or both):
 *  1. Vercel Cron — Hobby plan: once daily at 09:00 UTC (see vercel.json).
 *     Pro plan: change schedule to every 5 minutes (cron: star-slash-5 * * * *).
 *  2. n8n (or any scheduler) — GET this URL every 5–15 min with:
 *       Authorization: Bearer <CRON_SECRET>
 *
 * Set CRON_SECRET in Vercel env vars. Vercel Cron sends the same header automatically.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchOpenJobs, formatDescription, formatLocation } from "@/lib/bullhorn";
import { supabase, type JobRow } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  // Verify the request is coming from Vercel Cron (or a manual trigger with the secret)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startMs = Date.now();

  try {
    // 1. Fetch all open jobs from Bullhorn (uses in-process session cache)
    const { jobs, total: bullhornTotal } = await fetchOpenJobs();

    // 2. Build Supabase rows — descriptions pre-formatted here once, not on every render
    const rows: Omit<JobRow, "synced_at">[] = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: formatDescription(job.publicDescription || job.description),
      employment_type: job.employmentType ?? null,
      on_site: job.onSite ?? null,
      location: formatLocation(job.address) || null,
      salary: job.salary ?? null,
      pay_rate: job.payRate ?? null,
      salary_unit: job.salaryUnit ?? null,
      num_openings: job.numOpenings ?? null,
      category: job.publishedCategory?.name ?? null,
      date_added: job.dateAdded ?? null,
    }));

    // 3. Upsert all rows (insert new, update changed — keyed on `id`)
    const { error: upsertError } = await supabase
      .from("jobs")
      .upsert(rows, { onConflict: "id" });

    if (upsertError) throw new Error(`Supabase upsert failed: ${upsertError.message}`);

    // 4. Remove jobs that are no longer open in Bullhorn
    const activeIds = rows.map((r) => r.id);
    const { error: deleteError } = await supabase
      .from("jobs")
      .delete()
      .not("id", "in", `(${activeIds.join(",")})`);

    if (deleteError) throw new Error(`Supabase delete failed: ${deleteError.message}`);

    // 5. Revalidate the jobs pages so Next.js serves fresh data immediately after sync
    revalidatePath("/jobs");
    revalidatePath("/jobs/[id]", "page");
    revalidatePath("/api/jobs");

    const elapsed = Date.now() - startMs;

    return NextResponse.json({
      ok: true,
      synced: rows.length,
      bullhornTotal,
      elapsedMs: elapsed,
    });
  } catch (err) {
    console.error("[sync-jobs] Error:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

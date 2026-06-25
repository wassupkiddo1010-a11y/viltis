/**
 * /api/cron/sync-jobs
 *
 * Syncs open Bullhorn jobs → Supabase (dedupe, format descriptions, remove closed).
 * Visitors always read from Supabase — no Bullhorn latency on page loads.
 *
 * Trigger: Vercel Cron once daily at 09:00 UTC (see vercel.json).
 * Requires Authorization: Bearer <CRON_SECRET> when CRON_SECRET is set.
 *
 * Avoid external schedulers (e.g. n8n every 5–15 min) — each run is a heavy
 * serverless invocation and revalidates job pages.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchOpenJobs, formatDescription, formatLocation } from "@/lib/bullhorn";
import { buildJobSlugFields } from "@/lib/job-slugs";
import { supabase, type JobRow } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface ExistingJobSnapshot {
  id: number;
  category_slug: string | null;
  job_slug: string | null;
  title: string | null;
  category: string | null;
}

function collectRevalidationPaths(
  previous: ExistingJobSnapshot[],
  rows: Array<Pick<JobRow, "id" | "category_slug" | "job_slug" | "title" | "category">>,
): string[] {
  const paths = new Set<string>(["/jobs"]);
  const previousById = new Map(previous.map((job) => [job.id, job]));
  const nextIds = new Set(rows.map((row) => row.id));

  for (const row of rows) {
    const prev = previousById.get(row.id);
    const nextPath =
      row.category_slug && row.job_slug ? `/jobs/${row.category_slug}/${row.job_slug}` : null;

    if (!prev) {
      if (row.category_slug) paths.add(`/jobs/${row.category_slug}`);
      if (nextPath) paths.add(nextPath);
      continue;
    }

    const prevPath =
      prev.category_slug && prev.job_slug
        ? `/jobs/${prev.category_slug}/${prev.job_slug}`
        : null;

    const changed =
      prev.category_slug !== row.category_slug ||
      prev.job_slug !== row.job_slug ||
      prev.title !== row.title ||
      prev.category !== row.category;

    if (changed) {
      if (prev.category_slug) paths.add(`/jobs/${prev.category_slug}`);
      if (row.category_slug) paths.add(`/jobs/${row.category_slug}`);
      if (prevPath) paths.add(prevPath);
      if (nextPath) paths.add(nextPath);
    }
  }

  for (const prev of previous) {
    if (nextIds.has(prev.id)) continue;
    if (prev.category_slug) paths.add(`/jobs/${prev.category_slug}`);
    if (prev.category_slug && prev.job_slug) {
      paths.add(`/jobs/${prev.category_slug}/${prev.job_slug}`);
    }
  }

  return [...paths];
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startMs = Date.now();

  try {
    const { data: existingJobs, error: existingError } = await supabase
      .from("jobs")
      .select("id, category_slug, job_slug, title, category");

    if (existingError) {
      console.warn("[sync-jobs] Could not read existing jobs for revalidation:", existingError.message);
    }

    const previous = (existingJobs ?? []) as ExistingJobSnapshot[];

    const { jobs, total: bullhornTotal } = await fetchOpenJobs();

    const baseRows = jobs.map((job) => ({
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

    const slugMap = buildJobSlugFields(baseRows);
    const rowsWithSlugs: Omit<JobRow, "synced_at">[] = baseRows.map((row) => {
      const slugs = slugMap.get(row.id)!;
      return {
        ...row,
        category_slug: slugs.category_slug,
        job_slug: slugs.job_slug,
      };
    });

    let rows: Omit<JobRow, "synced_at">[] = rowsWithSlugs;
    let { error: upsertError } = await supabase.from("jobs").upsert(rows, { onConflict: "id" });

    if (upsertError?.message?.includes("category_slug") || upsertError?.message?.includes("job_slug")) {
      console.warn("[sync-jobs] Slug columns missing — upserting without slugs. Run supabase/jobs-slugs.sql.");
      rows = baseRows.map((row) => ({
        ...row,
        category_slug: null,
        job_slug: null,
      }));
      ({ error: upsertError } = await supabase.from("jobs").upsert(baseRows, { onConflict: "id" }));
    }

    if (upsertError) throw new Error(`Supabase upsert failed: ${upsertError.message}`);

    const activeIds = rows.map((r) => r.id);
    if (activeIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("jobs")
        .delete()
        .not("id", "in", `(${activeIds.join(",")})`);

      if (deleteError) throw new Error(`Supabase delete failed: ${deleteError.message}`);
    } else {
      const { error: deleteError } = await supabase.from("jobs").delete().neq("id", 0);
      if (deleteError) throw new Error(`Supabase delete failed: ${deleteError.message}`);
    }

    const pathsToRevalidate = collectRevalidationPaths(previous, rows);
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }
    revalidatePath("/sitemap.xml");

    const elapsed = Date.now() - startMs;

    return NextResponse.json({
      ok: true,
      synced: rows.length,
      bullhornTotal,
      revalidatedPaths: pathsToRevalidate.length,
      elapsedMs: elapsed,
    });
  } catch (err) {
    console.error("[sync-jobs] Error:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

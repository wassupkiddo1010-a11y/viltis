import { cache } from "react";
import { supabase, type JobRow } from "@/lib/supabase";
import {
  buildJobSlugFields,
  categorySlugFromName,
  slugify,
  type JobSlugFields,
} from "@/lib/job-slugs";

export type JobRecord = JobRow & JobSlugFields;

/** ISR: jobs sync once daily — avoid 5-minute regen churn from crawlers. */
export const JOB_PAGE_REVALIDATE = 86_400;

const LISTING_COLUMNS =
  "id,title,employment_type,on_site,location,salary,pay_rate,salary_unit,num_openings,category,category_slug,job_slug,date_added,synced_at" as const;

async function fetchListingJobs(): Promise<JobRow[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(LISTING_COLUMNS)
    .order("date_added", { ascending: false });

  if (error) {
    console.error("[jobs] Supabase error:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as JobRow[]).map((job) => ({
    ...job,
    description: null,
  }));
}

async function fetchAllJobs(includeDescription = false): Promise<JobRow[]> {
  if (!includeDescription) return fetchListingJobs();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("date_added", { ascending: false });

  if (error) {
    console.error("[jobs] Supabase error:", error.message);
    return [];
  }

  return (data ?? []) as JobRow[];
}

function rowToRecord(row: JobRow): JobRecord {
  return {
    ...row,
    category_slug: row.category_slug ?? categorySlugFromName(row.category),
    job_slug: row.job_slug ?? slugify(row.title),
  };
}

export function attachSlugsToJobs(jobs: JobRow[]): JobRecord[] {
  const slugMap = buildJobSlugFields(jobs);
  return jobs.map((job) => {
    const stored =
      job.category_slug && job.job_slug
        ? { category_slug: job.category_slug, job_slug: job.job_slug }
        : slugMap.get(job.id);

    return {
      ...job,
      category_slug: stored?.category_slug ?? categorySlugFromName(job.category),
      job_slug: stored?.job_slug ?? String(job.id),
    };
  });
}

export async function getJobsForListing(): Promise<JobRecord[]> {
  const jobs = await fetchAllJobs(false);
  return attachSlugsToJobs(jobs);
}

export const getJobById = cache(async (id: number): Promise<JobRecord | null> => {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToRecord(data as JobRow);
});

export const getJobBySlug = cache(
  async (categorySlug: string, jobSlug: string): Promise<JobRecord | null> => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("category_slug", categorySlug)
      .eq("job_slug", jobSlug)
      .maybeSingle();

    if (!error && data) return rowToRecord(data as JobRow);

    if (/^\d+$/.test(jobSlug)) {
      const byId = await getJobById(Number(jobSlug));
      if (byId && byId.category_slug === categorySlug) return byId;
    }

    // Slug columns not populated yet — resolve id from listing, then fetch one row.
    const listing = attachSlugsToJobs(await fetchAllJobs(false));
    const match = listing.find(
      (j) => j.category_slug === categorySlug && j.job_slug === jobSlug,
    );
    if (!match) return null;

    const { data: full, error: fullError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", match.id)
      .maybeSingle();

    if (fullError || !full) return match;
    return rowToRecord(full as JobRow);
  },
);

export const getJobsByCategorySlug = cache(
  async (categorySlug: string): Promise<JobRecord[]> => {
    const { data, error } = await supabase
      .from("jobs")
      .select(LISTING_COLUMNS)
      .eq("category_slug", categorySlug)
      .order("date_added", { ascending: false });

    if (!error && data && data.length > 0) {
      return ((data as unknown) as JobRow[]).map(rowToRecord);
    }

    const jobs = await getJobsForListing();
    return jobs.filter((j) => j.category_slug === categorySlug);
  },
);

export function getCategoryLabel(jobs: JobRecord[], categorySlug: string): string {
  const match = jobs.find((j) => j.category_slug === categorySlug);
  return match?.category?.trim() || categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const DEFAULT_CATEGORY_SLUG = "careers";

/** URL-safe slug from a label (category name, job title, etc.). */
export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "role"
  );
}

export function categorySlugFromName(category: string | null | undefined): string {
  if (!category?.trim()) return DEFAULT_CATEGORY_SLUG;
  return slugify(category);
}

export interface JobSlugSource {
  id: number;
  title: string;
  category: string | null;
}

export interface JobSlugFields {
  category_slug: string;
  job_slug: string;
}

/** Assign unique category/job slugs across a batch (handles duplicate titles). */
export function buildJobSlugFields(jobs: JobSlugSource[]): Map<number, JobSlugFields> {
  const seen = new Set<string>();
  const out = new Map<number, JobSlugFields>();

  for (const job of jobs) {
    const category_slug = categorySlugFromName(job.category);
    const base = slugify(job.title);
    let job_slug = base;
    let key = `${category_slug}/${job_slug}`;

    if (seen.has(key)) {
      job_slug = `${base}-${job.id}`;
      key = `${category_slug}/${job_slug}`;
    }

    seen.add(key);
    out.set(job.id, { category_slug, job_slug });
  }

  return out;
}

export function getJobHref(job: JobSlugFields): string {
  return `/jobs/${job.category_slug}/${job.job_slug}`;
}

export function withJobSlugs<T extends JobSlugSource>(job: T, allJobs?: JobSlugSource[]): T & JobSlugFields {
  if ("category_slug" in job && "job_slug" in job && job.category_slug && job.job_slug) {
    return job as T & JobSlugFields;
  }
  if (allJobs) {
    const map = buildJobSlugFields(allJobs);
    const slugs = map.get(job.id);
    if (slugs) return { ...job, ...slugs };
  }
  const category_slug = categorySlugFromName(job.category);
  const job_slug = slugify(job.title);
  return { ...job, category_slug, job_slug };
}

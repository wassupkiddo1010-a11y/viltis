import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { SERVICE_CATEGORIES } from "@/lib/content/services-catalog";
import { CASE_STUDIES } from "@/lib/content/case-studies-catalog";
import { BLOG_POSTS } from "@/lib/content/blog-catalog";
import { getJobsForListing } from "@/lib/jobs";
import { getJobHref } from "@/lib/job-slugs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const jobs = await getJobsForListing();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work-with-us`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/schedule-a-call`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const categoryPages = SERVICE_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/services/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const servicePages = SERVICE_CATEGORIES.flatMap((c) =>
    c.pages.map((p) => ({
      url: `${SITE_URL}/services/${c.slug}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  );

  const caseStudyPages = CASE_STUDIES.map((cs) => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.55,
  }));

  const jobPages = jobs.map((job) => ({
    url: `${SITE_URL}${getJobHref(job)}`,
    lastModified: job.synced_at ? new Date(job.synced_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...categoryPages, ...servicePages, ...caseStudyPages, ...blogPages, ...jobPages];
}

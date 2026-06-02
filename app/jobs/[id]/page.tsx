import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { supabase, type JobRow } from "@/lib/supabase";
import { BackButton } from "@/components/site/back-button";

// Cache each job page for 5 minutes — refreshed by the cron's revalidatePath call
export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const job = await getJob(Number(id));
  if (!job) return { title: "Job Not Found | Viltis" };
  const plainText = (job.description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 160);
  return {
    title: `${job.title} | Viltis Careers`,
    description: plainText,
  };
}

async function getJob(id: number): Promise<JobRow | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as JobRow;
}

function formatDate(ts?: number | null) {
  if (!ts) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

function formatSalary(job: JobRow): string | null {
  if (job.salary) return `$${job.salary.toLocaleString()}${job.salary_unit ? ` ${job.salary_unit}` : ""}`;
  if (job.pay_rate) return `$${job.pay_rate.toLocaleString()}/hr`;
  return null;
}

const ON_SITE_LABEL: Record<string, string> = {
  Remote: "Remote",
  Office: "On-site",
  Hybrid: "Hybrid",
  "On-Site": "On-site",
};

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(Number(id));

  if (!job) notFound();

  const workStyle = job.on_site ? (ON_SITE_LABEL[job.on_site] ?? job.on_site) : null;
  const salary = formatSalary(job);

  return (
    <>
      <Navbar />
      <main className="job-detail-page">

        {/* ── Breadcrumb ── */}
        <div className="job-detail-breadcrumb">
          <div className="job-detail-breadcrumb__inner">
            <BackButton />
          </div>
        </div>

        {/* ── Header ── */}
        <header className="job-detail-header">
          <div className="job-detail-header__inner">
            <div className="job-detail-header__meta">
              {job.category && (
                <span className="job-detail-tag job-detail-tag--cat">{job.category}</span>
              )}
              {job.employment_type && (
                <span className="job-detail-tag job-detail-tag--type">{job.employment_type}</span>
              )}
              {workStyle && (
                <span className="job-detail-tag job-detail-tag--mode">{workStyle}</span>
              )}
            </div>

            <h1 className="job-detail-header__title">{job.title}</h1>

            <div className="job-detail-header__attrs">
              {job.location && (
                <span className="job-detail-attr">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </span>
              )}
              {salary && (
                <span className="job-detail-attr">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  {salary}
                </span>
              )}
              {job.num_openings != null && job.num_openings > 0 && (
                <span className="job-detail-attr">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {job.num_openings} opening{job.num_openings > 1 ? "s" : ""}
                </span>
              )}
              {job.date_added && (
                <span className="job-detail-attr job-detail-attr--date">
                  Posted {formatDate(job.date_added)}
                </span>
              )}
            </div>

            <div className="job-detail-header__cta">
              <a
                href={`https://app.bullhornstaffing.com/jobboard/default/details/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                Apply for This Role
              </a>
              <BackButton label="Browse All Jobs" className="btn btn--ghost" />
            </div>
          </div>
        </header>

        {/* ── Description ── */}
        <div className="job-detail-body">
          <div className="job-detail-body__inner">
            {job.description ? (
              <article
                className="job-detail-prose"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <p className="job-detail-no-desc">
                No description available for this role. Please apply to learn more.
              </p>
            )}

            <div className="job-detail-bottom-cta">
              <a
                href={`https://app.bullhornstaffing.com/jobboard/default/details/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                Apply for This Role
              </a>
              <BackButton label="← Back to All Jobs" className="btn btn--ghost" />
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}

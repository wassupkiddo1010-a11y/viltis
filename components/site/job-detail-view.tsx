import { BackButton } from "@/components/site/back-button";
import { JobApplyForm } from "@/components/site/job-apply-form";
import type { JobRecord } from "@/lib/jobs";

function formatDate(ts?: number | null) {
  if (!ts) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

function formatSalary(job: JobRecord): string | null {
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

interface Props {
  job: JobRecord;
}

export function JobDetailView({ job }: Props) {
  const workStyle = job.on_site ? (ON_SITE_LABEL[job.on_site] ?? job.on_site) : null;
  const salary = formatSalary(job);

  return (
    <main className="job-detail-page">
      <div className="job-detail-breadcrumb">
        <div className="job-detail-breadcrumb__inner">
          <BackButton />
        </div>
      </div>

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
            <a href="#apply" className="btn btn--primary">
              Apply for This Role
            </a>
            <BackButton label="Browse All Jobs" className="btn btn--ghost" />
          </div>
        </div>
      </header>

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

          <JobApplyForm jobId={job.id} jobTitle={job.title} />

          <div className="job-detail-bottom-cta">
            <BackButton label="← Back to All Jobs" className="btn btn--ghost" />
          </div>
        </div>
      </div>
    </main>
  );
}

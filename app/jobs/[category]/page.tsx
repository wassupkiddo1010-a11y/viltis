import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { JobBoard } from "@/components/site/job-board";
import { BackButton } from "@/components/site/back-button";
import { getJobById, getJobsByCategorySlug, getCategoryLabel } from "@/lib/jobs";
import { getJobHref } from "@/lib/job-slugs";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86_400;

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;

  if (/^\d+$/.test(category)) {
    const job = await getJobById(Number(category));
    if (!job) return { title: "Job Not Found | Viltis" };
    return {
      title: `${job.title} | Viltis Careers`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://viltis.com"}${getJobHref(job)}`,
      },
    };
  }

  const jobs = await getJobsByCategorySlug(category);
  if (jobs.length === 0) return { title: "Jobs Not Found | Viltis" };

  const label = getCategoryLabel(jobs, category);
  return pageMetadata({
    title: `${label} Jobs`,
    description: `Open ${label.toLowerCase()} positions at Viltis.`,
    path: `/jobs/${category}`,
  });
}

export default async function JobCategoryPage({ params }: Props) {
  const { category } = await params;

  // Legacy numeric URLs (/jobs/12345) → canonical pretty URL
  if (/^\d+$/.test(category)) {
    const job = await getJobById(Number(category));
    if (!job) notFound();
    redirect(getJobHref(job));
  }

  const jobs = await getJobsByCategorySlug(category);
  if (jobs.length === 0) notFound();

  const label = getCategoryLabel(jobs, category);

  return (
    <>
      <Navbar />
      <main className="jobs-page">
        <section className="jobs-hero">
          <div className="jobs-hero__inner">
            <p className="jobs-hero__eyebrow">Careers · {label}</p>
            <h1 className="jobs-hero__title">{label} Positions</h1>
            <p className="jobs-hero__sub">
              {jobs.length} open {jobs.length === 1 ? "role" : "roles"} in {label.toLowerCase()}.
            </p>
            <BackButton label="All Open Positions" className="btn btn--ghost btn--sm" />
          </div>
        </section>

        <section className="jobs-board-section">
          <div className="jobs-board-section__inner">
            <JobBoard jobs={jobs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { JobBoard } from "@/components/site/job-board";
import { getJobsForListing } from "@/lib/jobs";

import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Open Positions",
  description: "Explore open positions at Viltis and join our team of life-science specialists.",
  path: "/jobs",
});

// ISR: daily cache; cron revalidatePath runs after each sync for fresh listings.
export const revalidate = 86_400;

export default async function JobsPage() {
  const jobs = await getJobsForListing();

  return (
    <>
      <Navbar />
      <main className="jobs-page">
        <section className="jobs-hero">
          <div className="jobs-hero__inner">
            <p className="jobs-hero__eyebrow">Careers</p>
            <h1 className="jobs-hero__title">Open Positions</h1>
            <p className="jobs-hero__sub">
              Join a team of life-science specialists shaping the future of
              biologics, regulatory, clinical, and quality operations.
            </p>
          </div>
        </section>

        <section className="jobs-board-section">
          <div className="jobs-board-section__inner">
            {jobs.length > 0 ? (
              <JobBoard jobs={jobs} />
            ) : (
              <div className="jobs-empty">
                <p className="jobs-empty__icon">🔬</p>
                <h2 className="jobs-empty__title">No open positions right now</h2>
                <p className="jobs-empty__sub">
                  We&rsquo;re always looking for talented people. Send your CV to{" "}
                  <a href="mailto:careers@viltis.com" className="jobs-empty__link">
                    careers@viltis.com
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

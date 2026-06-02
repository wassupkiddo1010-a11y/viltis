import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { JobBoard } from "@/components/site/job-board";
import { supabase, type JobRow } from "@/lib/supabase";

export const metadata = { title: "Open Positions | Viltis" };

// ISR: cached for 5 minutes, matches the cron sync interval.
// The cron also calls revalidatePath("/jobs") so updates appear immediately after a sync.
export const revalidate = 300;

async function getJobs(): Promise<Omit<JobRow, "description">[]> {
  // Exclude `description` — it's large HTML not needed on the listing page.
  const { data, error } = await supabase
    .from("jobs")
    .select("id,title,employment_type,on_site,location,salary,pay_rate,salary_unit,num_openings,category,date_added,synced_at")
    .order("date_added", { ascending: false });

  if (error) {
    console.error("[/jobs] Supabase error:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function JobsPage() {
  const jobs = await getJobs();

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
              <JobBoard jobs={jobs as JobRow[]} />
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

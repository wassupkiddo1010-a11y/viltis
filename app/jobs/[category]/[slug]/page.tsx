import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { JobDetailView } from "@/components/site/job-detail-view";
import { getJobBySlug } from "@/lib/jobs";
import { getJobHref } from "@/lib/job-slugs";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 86_400;

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const job = await getJobBySlug(category, slug);
  if (!job) return { title: "Job Not Found | Viltis" };

  const plainText = (job.description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 160);

  const path = getJobHref(job);

  return {
    title: `${job.title} | Viltis Careers`,
    description: plainText,
    alternates: { canonical: `${SITE_URL}${path}` },
  };
}

export default async function JobDetailBySlugPage({ params }: Props) {
  const { category, slug } = await params;
  const job = await getJobBySlug(category, slug);

  if (!job) notFound();

  return (
    <>
      <Navbar />
      <JobDetailView job={job} />
      <Footer />
    </>
  );
}

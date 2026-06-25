import { NextRequest, NextResponse } from "next/server";
import {
  attachResumeToCandidate,
  submitJobApplication,
  validateResumeFile,
} from "@/lib/bullhorn";
import { getJobHref } from "@/lib/job-slugs";
import { getJobById } from "@/lib/jobs";
import { notifyJobApplication } from "@/lib/job-notify";
import { SITE_URL } from "@/lib/site-config";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const jobOrderId = Number(id);

  if (!Number.isFinite(jobOrderId) || jobOrderId <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid job." }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
  }

  // Honeypot — bots only
  if (clean(formData.get("website"))) {
    return NextResponse.json({ ok: true });
  }

  const firstName = clean(formData.get("firstName"));
  const lastName = clean(formData.get("lastName"));
  const email = clean(formData.get("email"));
  const phone = clean(formData.get("phone"));
  const jobTitle = clean(formData.get("jobTitle"));
  const resumeEntry = formData.get("resume");

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { ok: false, error: "First name, last name, and email are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const job = await getJobById(jobOrderId);

  if (!job) {
    return NextResponse.json({ ok: false, error: "This job is no longer available." }, { status: 404 });
  }

  const jobUrl = `${SITE_URL}${getJobHref(job)}`;

  let resumeFile: { buffer: Buffer; filename: string; contentType: string } | null = null;

  if (resumeEntry instanceof File && resumeEntry.size > 0) {
    const resumeError = validateResumeFile({
      size: resumeEntry.size,
      type: resumeEntry.type,
      name: resumeEntry.name,
    });
    if (resumeError) {
      return NextResponse.json({ ok: false, error: resumeError }, { status: 400 });
    }
    const buffer = Buffer.from(await resumeEntry.arrayBuffer());
    resumeFile = {
      buffer,
      filename: resumeEntry.name,
      contentType: resumeEntry.type,
    };
  }

  try {
    const result = await submitJobApplication({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      jobOrderId,
      jobTitle: jobTitle || job.title,
    });

    let resumeFileId: number | null = null;
    if (resumeFile) {
      resumeFileId = await attachResumeToCandidate(result.candidateId, resumeFile);
    }

    const alreadyApplied = !result.submissionCreated;

    await notifyJobApplication({
      jobId: job.id,
      jobTitle: job.title,
      jobCategory: job.category,
      jobUrl,
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      alreadyApplied,
      resumeAttached: Boolean(resumeFileId),
    });

    return NextResponse.json({
      ok: true,
      alreadyApplied,
      resumeAttached: Boolean(resumeFileId),
    });
  } catch (err) {
    console.error("[jobs/apply]", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't submit your application. Please try again or email careers@viltis.com.",
      },
      { status: 500 }
    );
  }
}

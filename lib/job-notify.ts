import { FORMSPREE_CONTACT_FORM_ID } from "@/lib/site-config";

/**
 * Sends a team notification when someone applies for a job.
 * Reuses the same Formspree form as the contact page (server-side only).
 */
export async function notifyJobApplication(input: {
  jobId: number;
  jobTitle: string;
  jobCategory?: string | null;
  jobUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  alreadyApplied: boolean;
  resumeAttached: boolean;
}): Promise<void> {
  const formId = FORMSPREE_CONTACT_FORM_ID;

  const subject = input.alreadyApplied
    ? `Updated application: ${input.jobTitle}`
    : `New application: ${input.jobTitle}`;

  const body = [
    `Job: ${input.jobTitle} (ID ${input.jobId})`,
    input.jobCategory ? `Category: ${input.jobCategory}` : null,
    input.jobUrl ? `Job URL: ${input.jobUrl}` : null,
    "",
    `Candidate: ${input.firstName} ${input.lastName}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    "",
    input.alreadyApplied
      ? "Note: Candidate already had a submission for this job — profile was updated."
      : "New JobSubmission created in Bullhorn.",
    input.resumeAttached ? "Resume attached in Bullhorn." : "No resume uploaded.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: input.email,
        message: body,
        job_id: String(input.jobId),
        job_title: input.jobTitle,
        candidate_name: `${input.firstName} ${input.lastName}`,
        candidate_email: input.email,
        candidate_phone: input.phone ?? "",
        type: "job_application",
      }),
    });

    if (!res.ok) {
      console.error("[job-notify] Formspree error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[job-notify] Failed to send notification:", err);
  }
}

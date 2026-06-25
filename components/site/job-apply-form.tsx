"use client";

import { FormEvent, useState } from "react";

interface JobApplyFormProps {
  jobId: number;
  jobTitle: string;
}

export function JobApplyForm({ jobId, jobTitle }: JobApplyFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    formData.set("email", email);
    formData.set("phone", phone);
    formData.set("jobTitle", jobTitle);
    if (resume) formData.set("resume", resume);

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        alreadyApplied?: boolean;
        resumeAttached?: boolean;
      } | null;

      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(
        data.alreadyApplied
          ? "You're already on file for this role. We've updated your details and attached your resume if provided."
          : "Thank you — your application has been submitted. Our team will be in touch if there's a fit."
      );
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setResume(null);
      e.currentTarget.reset();
    } catch {
      setError("Unable to submit right now. Please try again or email careers@viltis.com.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="job-apply" id="apply" aria-labelledby="job-apply-heading">
      <div className="job-apply__inner">
        <div className="job-apply__header">
          <h2 className="job-apply__title" id="job-apply-heading">
            Apply for this role
          </h2>
          <p className="job-apply__sub">
            Submit your details below. Your application goes directly to our recruiting team in Bullhorn.
          </p>
        </div>

        {success ? (
          <div className="contact-form job-apply__form contact-form--success">
            <p className="contact-form__success">{success}</p>
          </div>
        ) : (
          <form className="contact-form job-apply__form" onSubmit={handleSubmit}>
            <input type="text" name="website" className="job-apply__honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="apply-first-name">First Name</label>
                <input
                  type="text"
                  id="apply-first-name"
                  name="firstName"
                  required
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={sending}
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="apply-last-name">Last Name</label>
                <input
                  type="text"
                  id="apply-last-name"
                  name="lastName"
                  required
                  placeholder="Applicant"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={sending}
                />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="apply-email">Email</label>
                <input
                  type="email"
                  id="apply-email"
                  name="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="apply-phone">Phone</label>
                <input
                  type="tel"
                  id="apply-phone"
                  name="phone"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={sending}
                />
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="apply-resume">Resume (PDF, DOC, or DOCX)</label>
              <input
                type="file"
                id="apply-resume"
                name="resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                disabled={sending}
                className="job-apply__file"
              />
              <p className="job-apply__hint">Optional — max 5 MB. Attached to your candidate profile in Bullhorn.</p>
            </div>

            {error && <p className="contact-form__error">{error}</p>}

            <button type="submit" className="btn btn--primary contact-form__submit" disabled={sending}>
              {sending ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

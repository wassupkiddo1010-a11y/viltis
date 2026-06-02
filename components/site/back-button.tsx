"use client";

import { useRouter } from "next/navigation";

interface Props {
  label?: string;
  className?: string;
}

export function BackButton({ label = "All Positions", className = "job-detail-breadcrumb__link" }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => router.back()}
    >
      {className === "job-detail-breadcrumb__link" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      )}
      {label}
    </button>
  );
}

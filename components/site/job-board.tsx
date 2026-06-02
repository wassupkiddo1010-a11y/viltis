"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import type { JobRow } from "@/lib/supabase";
import { usePagination } from "@/components/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const JOBS_PER_PAGE = 20;
const PAGINATION_ITEMS = 7;
const SCROLL_KEY = "jobs-scroll-position";

function formatDate(ts?: number | null) {
  if (!ts) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

const ON_SITE_LABEL: Record<string, string> = {
  Remote: "Remote",
  Office: "On-site",
  Hybrid: "Hybrid",
  "On-Site": "On-site",
};

interface Props {
  jobs: JobRow[];
}

export function JobBoard({ jobs }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Restore scroll position when returning from a job detail page ──────────
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      const y = parseInt(saved, 10);
      // Small delay to let the page fully render before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
      });
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  // Save scroll position when clicking a job link
  const saveScroll = useCallback(() => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  }, []);

  // ── Filters ────────────────────────────────────────────────────────────────
  const employmentTypes = useMemo(() => {
    const types = new Set(jobs.map((j) => j.employment_type).filter(Boolean));
    return ["All", ...Array.from(types)] as string[];
  }, [jobs]);

  const locationOptions = useMemo(() => {
    const locs = new Set(jobs.map((j) => j.location).filter(Boolean));
    return ["All", ...Array.from(locs).sort()] as string[];
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((j) => {
      if (typeFilter !== "All" && j.employment_type !== typeFilter) return false;
      if (locationFilter !== "All" && j.location !== locationFilter) return false;
      if (q) {
        const plainDesc = (j.description ?? "").replace(/<[^>]+>/g, " ");
        const haystack = [j.title, j.category, j.location, j.employment_type, plainDesc]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [jobs, search, typeFilter, locationFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: PAGINATION_ITEMS,
  });

  const goTo = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="job-board">
      {/* ── Filters ── */}
      <div className="job-board__filters">
        <div className="job-board__search-wrap">
          <svg className="job-board__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="job-board__search"
            placeholder="Search roles, skills, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        <div className="job-board__selects">
          <select className="job-board__select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by employment type">
            {employmentTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="job-board__select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} aria-label="Filter by location">
            {locationOptions.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <p className="job-board__count">
          {filtered.length.toLocaleString()} {filtered.length === 1 ? "position" : "positions"}
          {totalPages > 1 && (
            <span className="job-board__page-info">
              {" "}· page {currentPage} of {totalPages}
            </span>
          )}
        </p>
      </div>

      {/* ── No results ── */}
      {filtered.length === 0 ? (
        <div className="job-board__no-results">
          <p>No roles match your filters.</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setSearch(""); setTypeFilter("All"); setLocationFilter("All"); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <ul className="job-board__list" role="list">
            {paginated.map((job) => {
              const workStyle = job.on_site ? (ON_SITE_LABEL[job.on_site] ?? job.on_site) : null;
              const preview = (job.description ?? "")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s{2,}/g, " ")
                .trim()
                .slice(0, 160)
                .replace(/\s\S*$/, "") + ((job.description?.length ?? 0) > 160 ? "…" : "");

              return (
                <li key={job.id} className="job-card">
                  <div className="job-card__header">
                    <div className="job-card__meta-left">
                      <h2 className="job-card__title">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="job-card__title-link"
                          onClick={saveScroll}
                        >
                          {job.title}
                        </Link>
                      </h2>
                      <div className="job-card__tags">
                        {job.category && (
                          <span className="job-card__tag job-card__tag--cat">{job.category}</span>
                        )}
                        {job.employment_type && (
                          <span className="job-card__tag job-card__tag--type">{job.employment_type}</span>
                        )}
                        {workStyle && (
                          <span className="job-card__tag job-card__tag--mode">{workStyle}</span>
                        )}
                        {job.location && (
                          <span className="job-card__tag job-card__tag--loc">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {job.location}
                          </span>
                        )}
                      </div>
                      {preview && <p className="job-card__preview">{preview}</p>}
                    </div>

                    <div className="job-card__meta-right">
                      {job.date_added && (
                        <span className="job-card__date">{formatDate(job.date_added)}</span>
                      )}
                      <Link
                        href={`/jobs/${job.id}`}
                        className="btn btn--ghost btn--sm job-card__cta"
                        aria-label={`View ${job.title}`}
                        onClick={saveScroll}
                      >
                        View Role
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="job-board__pagination">
              <Pagination>
                <PaginationContent>
                  {/* Prev */}
                  <PaginationItem>
                    <button
                      type="button"
                      className="job-board__pg-btn"
                      onClick={() => goTo(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      ←
                    </button>
                  </PaginationItem>

                  {/* First + left ellipsis */}
                  {showLeftEllipsis && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => goTo(1)} style={{ cursor: "pointer" }}>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </>
                  )}

                  {/* Page numbers */}
                  {pages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => goTo(page)}
                        isActive={currentPage === page}
                        style={{ cursor: "pointer" }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Right ellipsis + last */}
                  {showRightEllipsis && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => goTo(totalPages)} style={{ cursor: "pointer" }}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  {/* Next */}
                  <PaginationItem>
                    <button
                      type="button"
                      className="job-board__pg-btn"
                      onClick={() => goTo(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      →
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

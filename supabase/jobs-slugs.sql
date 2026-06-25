-- Run once in Supabase SQL editor to support persisted job URL slugs.
alter table jobs add column if not exists category_slug text;
alter table jobs add column if not exists job_slug text;

create unique index if not exists jobs_category_job_slug_key
  on jobs (category_slug, job_slug)
  where category_slug is not null and job_slug is not null;

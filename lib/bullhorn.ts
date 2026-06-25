/**
 * Bullhorn API helpers — server only.
 *
 * Performance notes:
 *  - The OAuth flow (4 round trips) is cached in-process for 9 minutes.
 *  - Job results are cached in-process for 5 minutes.
 *  - On a warm cache every page request costs ~0 Bullhorn network calls.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BullhornJob {
  id: number;
  title: string;
  /** Public-facing rich-text description (preferred) */
  publicDescription?: string | null;
  /** Internal description — fallback when publicDescription is absent */
  description?: string | null;
  dateAdded?: number;
  employmentType?: string;
  onSite?: string;
  status?: string;
  externalID?: string;
  numOpenings?: number;
  salary?: number;
  payRate?: number;
  salaryUnit?: string;
  customFloat1?: number;
  address?: {
    city?: string;
    state?: string;
    zip?: string;
    countryID?: number;
    countryName?: string;
  };
  publishedCategory?: { id: number; name: string };
}

// ─── In-process cache ───────────────────────────────────────────────────────

interface SessionCache {
  restUrl: string;
  bhToken: string;
  expiresAt: number;
}

interface JobsCache {
  jobs: BullhornJob[];
  total: number;
  expiresAt: number;
}

// Module-level singletons — survive across requests in the same Node process
let _session: SessionCache | null = null;
let _jobsCache: JobsCache | null = null;

const SESSION_TTL_MS = 9 * 60 * 1000; // 9 min  (Bullhorn tokens last 10 min)
const JOBS_TTL_MS = 5 * 60 * 1000;    // 5 min

// ─── Config ─────────────────────────────────────────────────────────────────

const REDIRECT_URI =
  process.env.BULLHORN_REDIRECT_URI ||
  "https://vmi3206755.contaboserver.net/rest/oauth2-credential/callback";

// All actively-open jobs in Bullhorn carry the "Accepting Candidates" status.
// (Your account has no jobs with the literal "Open" status — "Accepting Candidates"
//  is the Bullhorn equivalent of "open / actively recruiting".)
const OPEN_STATUSES = `status:"Accepting Candidates" OR status:"Open"`;

const JOB_FIELDS = [
  "id",
  "title",
  "publicDescription",
  "description",
  "dateAdded",
  "employmentType",
  "address",
  "status",
  "onSite",
  "salary",
  "payRate",
  "salaryUnit",
  "customFloat1",
  "publishedCategory",
  "externalID",
  "numOpenings",
].join(",");

// ─── Auth helpers ────────────────────────────────────────────────────────────

async function createSession(): Promise<SessionCache> {
  const username = process.env.BULLHORN_USERNAME!;
  const password = process.env.BULLHORN_PASSWORD!;
  const clientId = process.env.BULLHORN_CLIENT_ID!;
  const clientSecret = process.env.BULLHORN_CLIENT_SECRET!;

  if (!username || !password || !clientId || !clientSecret) {
    throw new Error("Missing Bullhorn credentials in environment variables.");
  }

  // 1. Discover data center
  const loginInfoRes = await fetch(
    `https://rest.bullhornstaffing.com/rest-services/loginInfo?username=${encodeURIComponent(username)}`
  );
  const loginInfo = await loginInfoRes.json();
  const dc: string =
    loginInfo.dataCenter ||
    loginInfo.oauthUrl?.match(/auth-([^.]+)\./)?.[1] ||
    (() => { throw new Error("Cannot determine Bullhorn data center"); })();

  // 2. Authorize — one-time code via Location redirect header
  const authParams = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    action: "Login",
    username,
    password,
    redirect_uri: REDIRECT_URI,
    state: "viltis",
  });

  const authRes = await fetch(
    `https://auth-${dc}.bullhornstaffing.com/oauth/authorize?${authParams}`,
    { redirect: "manual" }
  );

  const locationHeader = authRes.headers.get("location") ?? "";
  const codeMatch = locationHeader.match(/[?&]code=([^&]+)/);
  if (!codeMatch) {
    throw new Error(`OAuth authorize failed — no code. Status: ${authRes.status}`);
  }
  const code = decodeURIComponent(codeMatch[1]);

  // 3. Exchange code → access token
  const tokenRes = await fetch(
    `https://auth-${dc}.bullhornstaffing.com/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
      }),
    }
  );
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`No access_token: ${JSON.stringify(tokenData)}`);
  }

  // 4. REST login → BhRestToken + restUrl
  const restLoginRes = await fetch(
    `https://rest-${dc}.bullhornstaffing.com/rest-services/login?version=*&access_token=${encodeURIComponent(tokenData.access_token)}`,
    { method: "POST" }
  );
  const session = await restLoginRes.json();
  if (!session.BhRestToken) {
    throw new Error(`No BhRestToken: ${JSON.stringify(session)}`);
  }

  return {
    restUrl: session.restUrl as string,
    bhToken: session.BhRestToken as string,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

async function getSession(): Promise<{ restUrl: string; bhToken: string }> {
  if (!_session || Date.now() >= _session.expiresAt) {
    _session = await createSession();
  }
  return { restUrl: _session.restUrl, bhToken: _session.bhToken };
}

// ─── Address utilities ───────────────────────────────────────────────────────

/** Strips "** " prefixes that some Bullhorn users add to city names. */
export function cleanCity(city?: string | null): string {
  if (!city) return "";
  return city.replace(/^\*+\s*/, "").trim();
}

/** Returns a clean, human-readable location string. */
export function formatLocation(address?: BullhornJob["address"]): string {
  if (!address) return "";
  const city = cleanCity(address.city);
  const state = address.state?.trim() ?? "";
  const country = address.countryName?.trim() ?? "";

  if (city && state) return `${city}, ${state}`;
  if (city && country && country !== "United States") return `${city}, ${country}`;
  if (city) return city;
  if (state) return state;
  return "";
}

// ─── Job title blocklist ─────────────────────────────────────────────────────

/** Titles matching these patterns are not real job postings — skip them at sync time. */
const BLOCKED_TITLE_PATTERNS = [
  /don'?t see a role/i,
  /submit your resume/i,
  /future consideration/i,
  /general application/i,
  /no suitable position/i,
  /talent community/i,
  /join our talent/i,
  /speculative application/i,
];

export function isBlockedTitle(title: string): boolean {
  return BLOCKED_TITLE_PATTERNS.some((p) => p.test(title));
}

// ─── Description formatter ───────────────────────────────────────────────────

/**
 * Converts Bullhorn plain-text (or lightly HTML-tagged) descriptions to
 * clean, structured HTML suitable for rendering in .job-detail-prose.
 *
 * Handles multiple Bullhorn description styles:
 *  1. Plain text with " - " bullet separators and **bold** / _italic_ markdown
 *  2. ALL CAPS section headers (e.g. "RESPONSIBILITIES:", "REQUIREMENTS:")
 *  3. Descriptions that already contain <br>, <p>, or <ul> tags
 *  4. Mixed styles (intro paragraph + ALL CAPS headers + bullet points)
 */
export function formatDescription(raw: string | null | undefined): string {
  if (!raw?.trim()) return "";

  // ── Step 1: detect if the input already contains real HTML structure ──────
  const hasHtmlStructure = /<(p|ul|ol|li|br|h[1-6])\b/i.test(raw);

  if (hasHtmlStructure) {
    // Already HTML — just sanitize script/style and normalise <br> → paragraph breaks
    return raw
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      // Collapse runs of <br> into paragraph breaks
      .replace(/(<br\s*\/?>\s*){2,}/gi, "</p><p>")
      .replace(/<br\s*\/?>/gi, " ")
      .trim();
  }

  // ── Step 2: apply inline markdown ────────────────────────────────────────
  let text = raw
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

  // ── Step 3: split on real newlines first (some Bullhorn entries use \n) ──
  const hasNewlines = /\n/.test(text);
  if (hasNewlines) {
    const paras = text
      .split(/\n{2,}/)          // double newline = paragraph break
      .map((block) => {
        const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return "";

        // Check if this block is an ALL CAPS header
        const firstLine = lines[0];
        if (/^[A-Z][A-Z\s&/,():-]{3,}:?\s*$/.test(firstLine)) {
          const header = firstLine.replace(/:?\s*$/, "");
          const rest = lines.slice(1);
          return `<h3>${header}</h3>` + (rest.length ? `<p>${rest.join(" ")}</p>` : "");
        }

        // Check if lines look like a bullet list
        const isBulletBlock = lines.every((l) => l.startsWith("- ") || l.startsWith("• ") || l.startsWith("* "));
        if (isBulletBlock) {
          const items = lines.map((l) => `<li>${l.replace(/^[-•*]\s+/, "")}</li>`).join("");
          return `<ul>${items}</ul>`;
        }

        return `<p>${lines.join(" ")}</p>`;
      })
      .filter(Boolean);

    return paras.join("");
  }

  // ── Step 4: single-line blob — split on " - " and ALL CAPS patterns ───────

  // First, extract ALL CAPS section headers and split the text around them.
  // Pattern: word boundary, 3+ ALL-CAPS words (possibly with &/():), followed by colon
  // e.g. "RESPONSIBILITIES:" "REQUIRED SKILLS:" "ABOUT THE COMPANY:"
  const ALL_CAPS_HEADER = /([A-Z][A-Z\s&/()\-:]{2,}:)/g;
  const capsMatches = [...text.matchAll(ALL_CAPS_HEADER)];

  if (capsMatches.length > 0) {
    // Split text at each ALL CAPS header
    const parts: { type: "text" | "header"; content: string }[] = [];
    let lastIndex = 0;

    for (const match of capsMatches) {
      if (match.index! > lastIndex) {
        parts.push({ type: "text", content: text.slice(lastIndex, match.index).trim() });
      }
      parts.push({ type: "header", content: match[1].replace(/:$/, "").trim() });
      lastIndex = match.index! + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex).trim() });
    }

    let html = "";
    let inList = false;

    for (const part of parts) {
      if (part.type === "header") {
        if (inList) { html += "</ul>"; inList = false; }
        html += `<h3>${part.content}</h3>`;
      } else {
        // Recursively process the text chunk for bullet points
        const chunk = formatTextChunk(part.content);
        if (chunk.inList !== inList && inList) { html += "</ul>"; inList = false; }
        html += chunk.html;
        inList = chunk.inList;
      }
    }

    if (inList) html += "</ul>";
    return html;
  }

  // ── Step 5: no ALL CAPS headers — use the " - " bullet splitter ──────────
  return formatBulletBlob(text);
}

/** Process a text chunk that may contain " - " separated bullets */
function formatTextChunk(text: string): { html: string; inList: boolean } {
  const segments = text.split(/ - /);
  if (segments.length <= 1) {
    return { html: text.trim() ? `<p>${text.trim()}</p>` : "", inList: false };
  }

  const { html, inList } = buildHtmlFromSegments(segments);
  return { html, inList };
}

function formatBulletBlob(text: string): string {
  const segments = text.split(/ - /);
  if (segments.length <= 1) {
    return text.trim() ? `<p>${text.trim()}</p>` : "";
  }
  const { html, inList } = buildHtmlFromSegments(segments);
  return html + (inList ? "</ul>" : "");
}

const BULLET_VERB = /^(prepare|independently|implement|operate|conduct|partner|maintain|support|design|troubleshoot|author|revise|communicate|develop|ensure|contribute|provide|assist|manage|coordinate|lead|work|perform|collaborate|report|build|create|analyze|review|monitor|execute|establish|identify|follow|document|participate|serve|drive|define|oversee|interface|liaise|evaluate|assess|facilitate|champion|spearhead|ensure|mentor|hire|recruit|present|align|integrate|validate|generate|apply|leverage|translate|shape|own|deliver|meet|achieve|advance)/i;

function buildHtmlFromSegments(segments: string[]): { html: string; inList: boolean } {
  const lines: { type: "intro" | "section" | "bullet"; text: string }[] = [];

  segments.forEach((seg, i) => {
    const trimmed = seg.trim();
    if (!trimmed) return;

    if (i === 0) {
      lines.push({ type: "intro", text: trimmed });
      return;
    }

    const words = trimmed.split(/\s+/);
    const looksLikeHeader =
      words.length <= 6 &&
      words[0]?.[0] === words[0]?.[0]?.toUpperCase() &&
      !BULLET_VERB.test(trimmed) &&
      !trimmed.endsWith(".");

    if (looksLikeHeader && i < segments.length - 1) {
      lines.push({ type: "section", text: trimmed });
    } else {
      lines.push({ type: "bullet", text: trimmed });
    }
  });

  let html = "";
  let inList = false;

  for (const line of lines) {
    if (line.type === "intro") {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${line.text}</p>`;
    } else if (line.type === "section") {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3>${line.text}</h3>`;
    } else {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${line.text}</li>`;
    }
  }

  return { html, inList };
}

// ─── Job deduplication ───────────────────────────────────────────────────────

/**
 * Removes duplicate job postings.
 * Strategy: keep the NEWEST entry for each (title, city) combination.
 * If a title appears in multiple cities, each city counts as unique.
 */
/** Normalise a city string for dedup — strips markers, trailing junk, extra spaces */
function normaliseCity(raw?: string | null): string {
  return (raw ?? "")
    .replace(/^\*+\s*/, "")        // strip ** prefix
    .replace(/\s+or\s*$/i, "")     // strip trailing " or"
    .replace(/;\s*$/, "")          // strip trailing semicolons
    .replace(/,\s*$/, "")          // strip trailing commas
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();
}

function deduplicateJobs(jobs: BullhornJob[]): BullhornJob[] {
  const seen = new Map<string, BullhornJob>();

  // Remove fake/non-job entries before deduplication
  const real = jobs.filter((j) => !isBlockedTitle(j.title));

  // Sort newest first so the first occurrence we see is the freshest
  const sorted = [...real].sort((a, b) => (b.dateAdded ?? 0) - (a.dateAdded ?? 0));

  for (const job of sorted) {
    // Deduplicate by title only — city strings in Bullhorn are unreliable
    // (truncated, ** prefixed, multi-city in one field) so we can't use them
    // as a reliable second key.
    const key = job.title.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.set(key, job);
    }
  }

  return Array.from(seen.values()).sort((a, b) => (b.dateAdded ?? 0) - (a.dateAdded ?? 0));
}

// ─── Public API ──────────────────────────────────────────────────────────────

async function searchPage(
  restUrl: string,
  bhToken: string,
  query: string,
  start: number,
  count: number
): Promise<{ data: BullhornJob[]; total: number }> {
  const res = await fetch(
    `${restUrl}search/JobOrder?BhRestToken=${encodeURIComponent(bhToken)}&query=${query}&fields=${JOB_FIELDS}&count=${count}&start=${start}&sort=-dateAdded`
  );
  const data = await res.json();
  return { data: data.data ?? [], total: data.total ?? 0 };
}

export async function fetchOpenJobs(): Promise<{
  jobs: BullhornJob[];
  total: number;
}> {
  // Serve from cache if still warm
  if (_jobsCache && Date.now() < _jobsCache.expiresAt) {
    return { jobs: _jobsCache.jobs, total: _jobsCache.total };
  }

  const { restUrl, bhToken } = await getSession();
  const query = encodeURIComponent(`isPublic:1 AND (${OPEN_STATUSES})`);

  // Bullhorn caps each search page at 500 — fetch remaining pages in parallel
  const PAGE_SIZE = 500;
  const first = await searchPage(restUrl, bhToken, query, 0, PAGE_SIZE);
  const total = first.total;

  let raw = first.data;
  if (total > PAGE_SIZE) {
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const rest = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, i) =>
        searchPage(restUrl, bhToken, query, (i + 1) * PAGE_SIZE, PAGE_SIZE)
      )
    );
    raw = [first.data, ...rest.map((p) => p.data)].flat();
  }

  const jobs = deduplicateJobs(raw);

  _jobsCache = { jobs, total: jobs.length, expiresAt: Date.now() + JOBS_TTL_MS };
  return { jobs, total: jobs.length };
}

export async function fetchJobById(id: number): Promise<BullhornJob | null> {
  try {
    const { restUrl, bhToken } = await getSession();
    const res = await fetch(
      `${restUrl}entity/JobOrder/${id}?BhRestToken=${encodeURIComponent(bhToken)}&fields=${JOB_FIELDS}`
    );
    const data = await res.json();
    return (data.data as BullhornJob) ?? null;
  } catch {
    return null;
  }
}

// ─── Candidate / application writes ─────────────────────────────────────────

export interface JobApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobOrderId: number;
  /** Used for the candidate list "Title" column in Bullhorn (`occupation`). */
  jobTitle?: string;
  source?: string;
}

export interface JobApplicationResult {
  candidateId: number;
  submissionId: number;
  candidateCreated: boolean;
  submissionCreated: boolean;
}

interface BullhornWriteResponse {
  changedEntityId?: number;
  changeType?: string;
  errorMessage?: string;
}

function fullName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.replace(/\s+/g, " ").trim();
}

async function bullhornPut<T extends Record<string, unknown>>(
  restUrl: string,
  bhToken: string,
  path: string,
  body: T
): Promise<BullhornWriteResponse> {
  const res = await fetch(`${restUrl}${path}?BhRestToken=${encodeURIComponent(bhToken)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as BullhornWriteResponse & { errorMessage?: string };
  if (!res.ok) {
    throw new Error(data.errorMessage ?? `Bullhorn PUT ${path} failed (${res.status})`);
  }
  return data;
}

async function bullhornPost<T extends Record<string, unknown>>(
  restUrl: string,
  bhToken: string,
  path: string,
  body: T
): Promise<BullhornWriteResponse> {
  const res = await fetch(`${restUrl}${path}?BhRestToken=${encodeURIComponent(bhToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as BullhornWriteResponse & { errorMessage?: string };
  if (!res.ok) {
    throw new Error(data.errorMessage ?? `Bullhorn POST ${path} failed (${res.status})`);
  }
  return data;
}

async function searchCandidatesByEmail(
  restUrl: string,
  bhToken: string,
  email: string
): Promise<{ id: number }[]> {
  const query = encodeURIComponent(`email:"${email.trim()}"`);
  const res = await fetch(
    `${restUrl}search/Candidate?BhRestToken=${encodeURIComponent(bhToken)}&query=${query}&fields=id&count=10&sort=-dateAdded`
  );
  const data = await res.json();
  return (data.data ?? []) as { id: number }[];
}

async function findExistingSubmission(
  restUrl: string,
  bhToken: string,
  candidateId: number,
  jobOrderId: number
): Promise<number | null> {
  const where = encodeURIComponent(`candidate.id=${candidateId} AND jobOrder.id=${jobOrderId}`);
  const res = await fetch(
    `${restUrl}query/JobSubmission?BhRestToken=${encodeURIComponent(bhToken)}&where=${where}&fields=id&count=1`
  );
  const data = await res.json();
  const row = data.data?.[0] as { id: number } | undefined;
  return row?.id ?? null;
}

/**
 * Creates or updates a Candidate and links them to a JobOrder via JobSubmission.
 *
 * Bullhorn list views use:
 *  - `name` (not just firstName/lastName) for the Name column
 *  - `occupation` for the Title column
 */
export async function submitJobApplication(
  input: JobApplicationInput
): Promise<JobApplicationResult> {
  const {
    firstName,
    lastName,
    email,
    phone,
    jobOrderId,
    source = "Viltis Website",
  } = input;

  const { restUrl, bhToken } = await getSession();

  let jobTitle = input.jobTitle?.trim();
  if (!jobTitle) {
    const job = await fetchJobById(jobOrderId);
    jobTitle = job?.title ?? "";
  }

  const displayName = fullName(firstName, lastName);
  const candidatePayload = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    name: displayName,
    email: email.trim(),
    phone: phone?.trim() || undefined,
    status: "New Lead",
    source,
    occupation: jobTitle,
  };

  const existing = await searchCandidatesByEmail(restUrl, bhToken, email);
  let candidateId: number | undefined = existing[0]?.id;
  let candidateCreated = false;

  if (candidateId) {
    await bullhornPost(restUrl, bhToken, `entity/Candidate/${candidateId}`, candidatePayload);
  } else {
    const created = await bullhornPut(restUrl, bhToken, "entity/Candidate", candidatePayload);
    candidateCreated = created.changeType === "INSERT";
    candidateId = created.changedEntityId;
    if (!candidateId) {
      throw new Error("Bullhorn did not return a candidate ID.");
    }
  }

  const existingSubmissionId = await findExistingSubmission(restUrl, bhToken, candidateId, jobOrderId);
  if (existingSubmissionId) {
    return {
      candidateId,
      submissionId: existingSubmissionId,
      candidateCreated,
      submissionCreated: false,
    };
  }

  const submission = await bullhornPut(restUrl, bhToken, "entity/JobSubmission", {
    candidate: { id: candidateId },
    jobOrder: { id: jobOrderId },
    status: "New Lead",
    source,
  });

  const submissionId = submission.changedEntityId;
  if (!submissionId) {
    throw new Error("Bullhorn did not return a job submission ID.");
  }

  return {
    candidateId,
    submissionId,
    candidateCreated,
    submissionCreated: submission.changeType === "INSERT",
  };
}

const RESUME_MAX_BYTES = 5 * 1024 * 1024;
const RESUME_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function validateResumeFile(file: { size: number; type: string; name: string }): string | null {
  if (file.size > RESUME_MAX_BYTES) {
    return "Resume must be 5 MB or smaller.";
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowedExt = new Set(["pdf", "doc", "docx"]);
  if (!RESUME_ALLOWED_TYPES.has(file.type) && (!ext || !allowedExt.has(ext))) {
    return "Resume must be a PDF, DOC, or DOCX file.";
  }
  return null;
}

function resumeContentType(filename: string, reportedType: string): string {
  if (RESUME_ALLOWED_TYPES.has(reportedType)) return reportedType;
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "doc") return "application/msword";
  if (ext === "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return reportedType || "application/octet-stream";
}

/** Attach a resume file to an existing Bullhorn Candidate (Files / Portfolio). */
export async function attachResumeToCandidate(
  candidateId: number,
  file: { buffer: Buffer; filename: string; contentType: string }
): Promise<number | null> {
  const { restUrl, bhToken } = await getSession();
  const contentType = resumeContentType(file.filename, file.contentType);

  const res = await fetch(
    `${restUrl}file/Candidate/${candidateId}?BhRestToken=${encodeURIComponent(bhToken)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalID: "Portfolio",
        fileType: "SAMPLE",
        name: file.filename,
        contentType,
        description: "Resume submitted via Viltis website",
        fileContent: file.buffer.toString("base64"),
      }),
    }
  );

  const data = (await res.json()) as { fileId?: number; errorMessage?: string };
  if (!res.ok) {
    throw new Error(data.errorMessage ?? `Resume upload failed (${res.status})`);
  }
  return data.fileId ?? null;
}

// Re-export for consumers that previously imported from this file
export { getSession as getBullhornSession };

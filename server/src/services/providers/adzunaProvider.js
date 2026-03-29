import { config } from "../../config.js";

const SEARCH_PATH = "/fi/search/1";
const SEARCH_PARAMS = {
  results_per_page: "10",
  what: "cleaner OR kitchen OR warehouse",
  where: "turku",
};

export async function fetchAdzunaJobs() {
  console.log("Using provider: adzuna");

  if (!config.jobApiUrl || !config.jobApiId || !config.jobApiKey) {
    throw new Error("Adzuna configuration is incomplete.");
  }

  const response = await fetch(buildAdzunaUrl(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await safeReadText(response);
    throw new Error(`Adzuna API returned ${response.status}: ${errorBody}`);
  }

  const payload = await response.json();
  const jobs = normalizeAdzunaJobs(payload);

  if (jobs.length === 0) {
    throw new Error("Adzuna API returned no usable jobs.");
  }

  console.log("Fetched Adzuna jobs:", JSON.stringify(jobs, null, 2));
  return jobs;
}

function buildAdzunaUrl() {
  const normalizedUrl = config.jobApiUrl.replace(/\/$/, "");
  const requestUrl = normalizedUrl.endsWith(SEARCH_PATH)
    ? normalizedUrl
    : `${normalizedUrl}${SEARCH_PATH}`;
  const baseUrl = new URL(requestUrl);

  baseUrl.searchParams.set("app_id", config.jobApiId);
  baseUrl.searchParams.set("app_key", config.jobApiKey);

  for (const [key, value] of Object.entries(SEARCH_PARAMS)) {
    baseUrl.searchParams.set(key, value);
  }

  return baseUrl.toString();
}

function normalizeAdzunaJobs(payload) {
  const rawJobs = Array.isArray(payload?.results) ? payload.results : [];

  return rawJobs
    .map((job) => ({
      title: toCleanString(job?.title),
      company: toCleanString(job?.company?.display_name),
      location: toCleanString(job?.location?.display_name),
      description: toCleanString(job?.description),
      applicationLink: toCleanString(job?.redirect_url),
    }))
    .filter(isValidJob);
}

function toCleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidJob(job) {
  return (
    job.title &&
    job.company &&
    job.location &&
    job.description &&
    job.applicationLink
  );
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return "Unable to read response body.";
  }
}

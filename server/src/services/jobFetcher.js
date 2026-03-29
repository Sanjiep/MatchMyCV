import { config } from "../config.js";

const FALLBACK_JOBS = [
  {
    title: "Warehouse Associate",
    company: "Turku Logistics Group",
    location: "Turku, Finland",
    description:
      "Support warehouse operations, order handling, and shift-based inventory work in a busy logistics environment.",
    applicationLink: "https://jobs.example.com/turku-logistics/warehouse-associate",
  },
  {
    title: "Kitchen Assistant",
    company: "Baltic Kitchen Services",
    location: "Turku, Finland",
    description:
      "Assist with food preparation, kitchen hygiene, dishwashing, and daily service support for a fast-moving kitchen team.",
    applicationLink: "https://jobs.example.com/baltic-kitchen/kitchen-assistant",
  },
  {
    title: "Cleaner",
    company: "Nordic Facility Care",
    location: "Turku, Finland",
    description:
      "Carry out scheduled cleaning tasks, maintain hygiene standards, and support facility upkeep across commercial sites.",
    applicationLink: "https://jobs.example.com/nordic-facility/caretaker-cleaner",
  },
  {
    title: "Warehouse Operative",
    company: "Scandic Fulfillment",
    location: "Turku, Finland",
    description:
      "Handle incoming deliveries, packing, picking, and warehouse floor coordination in a structured team environment.",
    applicationLink: "https://jobs.example.com/scandic-fulfillment/warehouse-operative",
  },
];

const SEARCH_PATH = "/fi/search/1";
const SEARCH_PARAMS = {
  results_per_page: "10",
  what: "cleaner OR kitchen OR warehouse",
  where: "turku",
};

export async function getJobs() {
  if (!config.jobApiUrl || !config.jobApiId || !config.jobApiKey) {
    console.warn("Using fallback jobs because Adzuna configuration is incomplete.");
    return FALLBACK_JOBS;
  }

  try {
    const requestUrl = buildAdzunaUrl();
    const response = await fetch(requestUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Adzuna API returned ${response.status}`);
    }

    const payload = await response.json();
    const jobs = normalizeAdzunaJobs(payload);

    if (jobs.length === 0) {
      throw new Error("Adzuna API returned no usable jobs.");
    }

    console.log("Fetched Adzuna jobs:", JSON.stringify(jobs, null, 2));
    return jobs;
  } catch (error) {
    console.warn("Falling back to mock jobs:", error.message);
    return FALLBACK_JOBS;
  }
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

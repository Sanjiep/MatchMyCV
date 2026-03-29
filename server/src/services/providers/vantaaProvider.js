import { config } from "../../config.js";

const DEFAULT_VANTAA_API_URL = "https://gis.vantaa.fi/rest/tyopaikat/v1/kaikki";

export async function fetchVantaaJobs() {
  console.log("Using provider: vantaa");

  const response = await fetch(config.jobApiUrl || DEFAULT_VANTAA_API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await safeReadText(response);
    throw new Error(`Vantaa provider returned ${response.status}: ${errorBody}`);
  }

  const payload = await response.json();
  const jobs = normalizeVantaaJobs(payload);

  if (jobs.length === 0) {
    throw new Error("Vantaa provider returned no usable jobs.");
  }

  console.log("Fetched Vantaa jobs:", JSON.stringify(jobs.slice(0, 10), null, 2));
  return jobs;
}

function normalizeVantaaJobs(payload) {
  const rawJobs = Array.isArray(payload) ? payload : [];

  return rawJobs
    .map((job) => ({
      title: toCleanString(job?.tyotehtava),
      company: toCleanString(job?.organisaatio) || "City of Vantaa",
      location: toCleanString(job?.osoite) || "Vantaa, Finland",
      description: buildDescription(job),
      applicationLink: toCleanString(job?.linkki ?? job?.tyoavain),
    }))
    .filter(isValidJob);
}

function buildDescription(job) {
  const parts = [
    toCleanString(job?.ammattiala),
    toCleanString(job?.organisaatio),
    toCleanString(job?.osoite),
    job?.haku_paattyy_pvm
      ? `Application closes: ${job.haku_paattyy_pvm}`
      : "",
  ].filter(Boolean);

  return parts.join(" | ");
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

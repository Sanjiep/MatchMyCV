import { config } from "../../config.js";

export async function fetchTyomarkkinatoriJobs() {
  console.log("Using provider: tyomarkkinatori");

  if (!config.jobApiUrl) {
    throw new Error("Tyomarkkinatori API URL is not configured.");
  }

  const response = await fetch(config.jobApiUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await safeReadText(response);
    throw new Error(
      `Tyomarkkinatori provider returned ${response.status}: ${errorBody}`
    );
  }

  const payload = await response.json();
  const jobs = normalizeTyomarkkinatoriJobs(payload);

  if (jobs.length === 0) {
    throw new Error("Tyomarkkinatori provider returned no usable jobs.");
  }

  console.log("Fetched Tyomarkkinatori jobs:", JSON.stringify(jobs, null, 2));
  return jobs;
}

function normalizeTyomarkkinatoriJobs(payload) {
  const rawJobs = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.jobs)
        ? payload.jobs
        : Array.isArray(payload?.items)
          ? payload.items
          : [];

  return rawJobs
    .map((job) => ({
      title: toCleanString(job?.title ?? job?.heading ?? job?.profession),
      company: toCleanString(
        job?.company?.display_name ?? job?.employer ?? job?.organization
      ),
      location: toCleanString(
        job?.location?.display_name ?? job?.municipality ?? job?.location
      ),
      description: toCleanString(
        job?.description ?? job?.summary ?? job?.body
      ),
      applicationLink: toCleanString(
        job?.applicationLink ?? job?.externalUrl ?? job?.url ?? job?.link
      ),
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

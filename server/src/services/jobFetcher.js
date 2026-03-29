import { config } from "../config.js";
import { fetchAdzunaJobs } from "./providers/adzunaProvider.js";
import { fetchFallbackJobs } from "./providers/fallbackProvider.js";
import { fetchTyomarkkinatoriJobs } from "./providers/tyomarkkinatoriProvider.js";
import { fetchVantaaJobs } from "./providers/vantaaProvider.js";

const PROVIDERS = {
  vantaa: fetchVantaaJobs,
  tyomarkkinatori: fetchTyomarkkinatoriJobs,
  adzuna: fetchAdzunaJobs,
  fallback: fetchFallbackJobs,
};

export async function getJobs() {
  const providerName = config.jobProvider in PROVIDERS ? config.jobProvider : "vantaa";
  const selectedProvider = PROVIDERS[providerName];

  try {
    return await selectedProvider();
  } catch (error) {
    console.warn(
      `Provider ${providerName} failed, falling back to local jobs:`,
      error.message
    );
    return fetchFallbackJobs();
  }
}

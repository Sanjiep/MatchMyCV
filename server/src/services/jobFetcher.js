import { config } from "../config.js";
import { fetchAdzunaJobs } from "./providers/adzunaProvider.js";
import { fetchFallbackJobs } from "./providers/fallbackProvider.js";
import { fetchTyomarkkinatoriJobs } from "./providers/tyomarkkinatoriProvider.js";

const PROVIDERS = {
  tyomarkkinatori: fetchTyomarkkinatoriJobs,
  adzuna: fetchAdzunaJobs,
  fallback: fetchFallbackJobs,
};

export async function getJobs() {
  const selectedProvider = PROVIDERS[config.jobProvider] || fetchTyomarkkinatoriJobs;

  try {
    return await selectedProvider();
  } catch (error) {
    console.warn(
      `Provider ${config.jobProvider} failed, falling back to local jobs:`,
      error.message
    );
    return fetchFallbackJobs();
  }
}

import { createEmptyResume } from "../services/matcher.js";

export function createEmptyMatchResponse() {
  return {
    resume: createEmptyResume(),
    jobs: [],
    count: 0,
  };
}

const FALLBACK_JOBS = [
  {
    title: "Frontend Engineer",
    company: "BrightPath Labs",
    location: "Remote",
    description:
      "Build responsive candidate-facing interfaces with React, Tailwind CSS, and modern frontend tooling.",
    applicationLink: "https://jobs.example.com/brightpath/frontend-engineer",
  },
  {
    title: "Full Stack Developer",
    company: "Northstar Hiring",
    location: "Warsaw, Poland",
    description:
      "Develop job-matching features across Node.js services and React applications, with a focus on recruiter workflows.",
    applicationLink: "https://jobs.example.com/northstar/full-stack-developer",
  },
  {
    title: "Resume Parsing Engineer",
    company: "TalentFlow",
    location: "Kyiv, Ukraine",
    description:
      "Design backend services that extract structured resume data, improve parsing accuracy, and support application automation.",
    applicationLink: "https://jobs.example.com/talentflow/resume-parsing-engineer",
  },
  {
    title: "Product Engineer",
    company: "CareerPilot",
    location: "Berlin, Germany",
    description:
      "Ship end-to-end product features for job seekers, combining API development, UX polish, and analytics-driven iteration.",
    applicationLink: "https://jobs.example.com/careerpilot/product-engineer",
  },
];

export async function getJobs() {
  const apiUrl = process.env.JOB_API_URL;

  if (!apiUrl) {
    return FALLBACK_JOBS;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: buildRequestHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Job API returned ${response.status}`);
    }

    const payload = await response.json();
    const jobs = normalizeJobsPayload(payload);

    if (jobs.length === 0) {
      return FALLBACK_JOBS;
    }

    return jobs;
  } catch (error) {
    console.warn("Falling back to mock jobs:", error.message);
    return FALLBACK_JOBS;
  }
}

function buildRequestHeaders() {
  const headers = {
    Accept: "application/json",
  };

  if (process.env.JOB_API_KEY) {
    headers.Authorization = `Bearer ${process.env.JOB_API_KEY}`;
  }

  return headers;
}

function normalizeJobsPayload(payload) {
  const rawJobs = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.jobs)
      ? payload.jobs
      : Array.isArray(payload?.results)
        ? payload.results
        : [];

  return rawJobs
    .map((job) => ({
      title: firstNonEmpty(job.title, job.position, job.role),
      company: firstNonEmpty(
        job.company,
        job.company_name,
        job.employer_name,
        job.organization
      ),
      location: firstNonEmpty(
        job.location,
        job.candidate_required_location,
        job.city,
        job.job_city
      ),
      description: firstNonEmpty(
        job.description,
        job.summary,
        job.snippet,
        job.job_description
      ),
      applicationLink: firstNonEmpty(
        job.applicationLink,
        job.url,
        job.job_url,
        job.redirect_url
      ),
    }))
    .filter(isValidJob);
}

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
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

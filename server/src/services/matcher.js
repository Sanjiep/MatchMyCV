const SCORE_WEIGHTS = {
  skills: 40,
  jobTitles: 25,
  experience: 15,
  education: 10,
  languages: 10,
};

export function createEmptyResume() {
  return {
    skills: [],
    experience: [],
    jobTitles: [],
    education: [],
    languages: [],
  };
}

export function matchJobsForResume(resume, jobs) {
  const normalizedResume = normalizeResume(resume);

  return jobs
    .map((job) => scoreJob(normalizedResume, job))
    .sort((left, right) => right.fitScore - left.fitScore);
}

function scoreJob(resume, job) {
  const jobText = `${job.title} ${job.description} ${job.location}`.toLowerCase();

  const skillsScore = scoreKeywordMatches(resume.skills, jobText, SCORE_WEIGHTS.skills);
  const titleScore = scoreKeywordMatches(
    resume.jobTitles,
    jobText,
    SCORE_WEIGHTS.jobTitles
  );
  const experienceScore = scoreExperience(resume.experience, jobText);
  const educationScore = scoreKeywordMatches(
    resume.education,
    jobText,
    SCORE_WEIGHTS.education
  );
  const languageScore = scoreKeywordMatches(
    resume.languages,
    jobText,
    SCORE_WEIGHTS.languages
  );

  const fitScore = Math.round(
    skillsScore + titleScore + experienceScore + educationScore + languageScore
  );

  return {
    ...job,
    fitScore,
    probability: categorizeScore(fitScore),
  };
}

function normalizeResume(resume) {
  return {
    skills: ensureArray(resume.skills),
    experience: ensureArray(resume.experience),
    jobTitles: ensureArray(resume.jobTitles),
    education: ensureArray(resume.education),
    languages: ensureArray(resume.languages),
  };
}

function ensureArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function scoreKeywordMatches(items, haystack, maxScore) {
  if (items.length === 0) {
    return 0;
  }

  const totalSimilarity = items.reduce(
    (sum, item) => sum + calculateTextSimilarity(item, haystack),
    0
  );
  const ratio = totalSimilarity / items.length;

  return ratio * maxScore;
}

function scoreExperience(experienceEntries, jobText) {
  if (experienceEntries.length === 0) {
    return 0;
  }

  const keywordScore = scoreKeywordMatches(
    experienceEntries.map((entry) => summarizeExperience(entry)),
    jobText,
    SCORE_WEIGHTS.experience * 0.7
  );

  const yearsOfExperience = estimateYearsOfExperience(experienceEntries);
  const yearsScore = Math.min(yearsOfExperience / 5, 1) * SCORE_WEIGHTS.experience * 0.3;

  return keywordScore + yearsScore;
}

function summarizeExperience(entry) {
  return extractKeywords(entry).slice(0, 8).join(" ");
}

function estimateYearsOfExperience(experienceEntries) {
  const years = experienceEntries.flatMap((entry) => {
    const matches = entry.match(/\b(19|20)\d{2}\b/g);

    if (!matches || matches.length < 2) {
      return [];
    }

    const numericYears = matches.map(Number);
    return [Math.max(...numericYears) - Math.min(...numericYears)];
  });

  const totalYears = years.reduce((sum, value) => sum + value, 0);
  return Math.max(totalYears, experienceEntries.length);
}

function categorizeScore(score) {
  if (score >= 70) {
    return "High Probability";
  }

  if (score >= 35) {
    return "Medium Probability";
  }

  return "Stretch";
}

function calculateTextSimilarity(item, haystack) {
  const normalizedItem = item.toLowerCase().trim();

  if (!normalizedItem) {
    return 0;
  }

  if (haystack.includes(normalizedItem)) {
    return 1;
  }

  const keywords = extractKeywords(normalizedItem);

  if (keywords.length === 0) {
    return 0;
  }

  const matchedKeywords = keywords.filter((keyword) => haystack.includes(keyword)).length;
  return matchedKeywords / keywords.length;
}

function extractKeywords(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/i)
    .filter((word) => word.length > 2);
}

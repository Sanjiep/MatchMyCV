import { PDFParse } from "pdf-parse";

const SECTION_ALIASES = {
  skills: ["skills", "technical skills", "core competencies", "competencies"],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
  ],
  education: ["education", "academic background", "qualifications"],
  languages: ["languages", "language proficiency"],
};

const EMPTY_RESUME = {
  skills: [],
  experience: [],
  jobTitles: [],
  education: [],
  languages: [],
};

export class ResumeParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = "ResumeParsingError";
  }
}

export async function parseResumePdf(buffer) {
  let parser;

  try {
    parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    const text = normalizeText(data.text);

    if (!text) {
      throw new ResumeParsingError(
        "The uploaded PDF does not contain readable text."
      );
    }

    const lines = getMeaningfulLines(text);

    if (lines.length === 0) {
      throw new ResumeParsingError(
        "The uploaded PDF does not contain enough text to parse."
      );
    }

    const sections = splitIntoSections(lines);
    const skills = extractListSection(sections.skills);
    const experience = extractNarrativeSection(sections.experience);
    const education = extractNarrativeSection(sections.education);
    const languages = extractListSection(sections.languages);
    const jobTitles = extractJobTitles(experience);

    return {
      ...EMPTY_RESUME,
      skills,
      experience,
      jobTitles,
      education,
      languages,
    };
  } catch (error) {
    if (error instanceof ResumeParsingError) {
      throw error;
    }

    throw new ResumeParsingError("Unable to extract text from the uploaded PDF.");
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getMeaningfulLines(text) {
  return text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => !isNoiseLine(line));
}

function isNoiseLine(line) {
  return /^-+\s*\d+\s+of\s+\d+\s*-+$/i.test(line) || /^page\s+\d+(\s+of\s+\d+)?$/i.test(line);
}

function splitIntoSections(lines) {
  const sections = {
    skills: [],
    experience: [],
    education: [],
    languages: [],
  };

  let activeSection = null;

  for (const line of lines) {
    const matchedSection = matchSectionHeading(line);

    if (matchedSection) {
      activeSection = matchedSection;
      continue;
    }

    if (activeSection) {
      sections[activeSection].push(line);
    }
  }

  return sections;
}

function matchSectionHeading(line) {
  const normalizedLine = line.toLowerCase().replace(/[:\-]+$/, "").trim();

  for (const [section, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.includes(normalizedLine)) {
      return section;
    }
  }

  return null;
}

function extractListSection(lines) {
  return dedupe(
    lines
      .flatMap((line) => line.split(/[|,;]/))
      .map(cleanListItem)
      .filter(Boolean)
  );
}

function extractNarrativeSection(lines) {
  const entries = [];
  let currentEntry = "";

  for (const line of lines) {
    if (looksLikeNewEntry(line)) {
      if (currentEntry) {
        entries.push(currentEntry.trim());
      }

      currentEntry = cleanNarrativeLine(line);
      continue;
    }

    currentEntry = `${currentEntry} ${cleanNarrativeLine(line)}`.trim();
  }

  if (currentEntry) {
    entries.push(currentEntry.trim());
  }

  return dedupe(entries.filter(Boolean));
}

function looksLikeNewEntry(line) {
  return (
    /^[\u2022\-*]/.test(line) ||
    /\b(20\d{2}|19\d{2})\b/.test(line) ||
    / at /i.test(line) ||
    / - /.test(line)
  );
}

function cleanNarrativeLine(line) {
  return line.replace(/^[\u2022\-*]\s*/, "").trim();
}

function cleanListItem(item) {
  return item.replace(/^[\u2022\-*]\s*/, "").trim();
}

function extractJobTitles(experience) {
  const titles = experience
    .map((entry) => {
      const [firstPart] = entry.split(/\s+(?:at|@)\s+/i);
      const [titlePart] = firstPart.split(/\s+\|\s+|\s{2,}/);
      const cleaned = titlePart.split(/\s+-\s+/)[0].trim();
      return cleaned.length > 1 ? cleaned : null;
    })
    .filter(Boolean);

  return dedupe(titles);
}

function dedupe(items) {
  return [...new Set(items)];
}

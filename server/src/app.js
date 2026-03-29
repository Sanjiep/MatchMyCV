import cors from "cors";
import express from "express";
import multer from "multer";
import { config } from "./config.js";
import { getJobs } from "./services/jobFetcher.js";
import { matchJobsForResume } from "./services/matcher.js";
import { parseResumePdf, ResumeParsingError } from "./services/resumeParser.js";
import { createEmptyMatchResponse } from "./utils/responses.js";
import { validatePdfUpload } from "./utils/uploadValidation.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(
  cors({
    origin: config.clientUrl,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MatchMyCV server",
  });
});

app.get("/jobs", async (_req, res) => {
  try {
    const jobs = await getJobs();

    return res.status(200).json({
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error("Job fetching error:", error);

    return res.status(500).json({
      error: "Unable to fetch jobs at this time.",
      jobs: [],
      count: 0,
    });
  }
});

app.post("/match-jobs", async (req, res) => {
  const resume = req.body?.resume;

  if (!resume) {
    return res.status(400).json({
      error: "Parsed resume data is required.",
      ...createEmptyMatchResponse(),
    });
  }

  try {
    const jobs = await getJobs();
    const matchedJobs = matchJobsForResume(resume, jobs);

    return res.status(200).json({
      resume,
      jobs: matchedJobs,
      count: matchedJobs.length,
    });
  } catch (error) {
    console.error("Job matching error:", error);

    return res.status(500).json({
      error: "Unable to score jobs at this time.",
      resume,
      jobs: [],
      count: 0,
    });
  }
});

app.post("/upload", upload.single("cv"), async (req, res) => {
  const validationError = validatePdfUpload(req.file);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  try {
    const parsedResume = await parseResumePdf(req.file.buffer);
    const jobs = await getJobs();
    const matchedJobs = matchJobsForResume(parsedResume, jobs);

    return res.status(200).json({
      message: "PDF uploaded and parsed successfully.",
      fileName: req.file.originalname,
      size: req.file.size,
      resume: parsedResume,
      jobs: matchedJobs,
      count: matchedJobs.length,
    });
  } catch (error) {
    if (error instanceof ResumeParsingError) {
      return res.status(422).json({
        error: error.message,
        ...createEmptyMatchResponse(),
      });
    }

    console.error("Unexpected resume parsing error:", error);

    return res.status(500).json({
      error: "An unexpected error occurred while parsing the resume.",
    });
  }
});

export default app;

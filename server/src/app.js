import express from "express";
import multer from "multer";
import { parseResumePdf, ResumeParsingError } from "./services/resumeParser.js";
import { validatePdfUpload } from "./utils/uploadValidation.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MatchMyCV server",
  });
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

    return res.status(200).json({
      message: "PDF uploaded and parsed successfully.",
      fileName: req.file.originalname,
      size: req.file.size,
      resume: parsedResume,
    });
  } catch (error) {
    if (error instanceof ResumeParsingError) {
      return res.status(422).json({
        error: error.message,
        resume: {
          skills: [],
          experience: [],
          jobTitles: [],
          education: [],
          languages: [],
        },
      });
    }

    console.error("Unexpected resume parsing error:", error);

    return res.status(500).json({
      error: "An unexpected error occurred while parsing the resume.",
    });
  }
});

export default app;

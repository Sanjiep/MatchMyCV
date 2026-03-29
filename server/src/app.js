import express from "express";
import multer from "multer";

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

app.post("/upload", upload.single("cv"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "A PDF file is required.",
    });
  }

  const isPdfMimeType = req.file.mimetype === "application/pdf";
  const isPdfExtension = req.file.originalname.toLowerCase().endsWith(".pdf");

  if (!isPdfMimeType || !isPdfExtension) {
    return res.status(400).json({
      error: "Only PDF files are allowed.",
    });
  }

  return res.status(200).json({
    message: "PDF uploaded successfully.",
    fileName: req.file.originalname,
    size: req.file.size,
  });
});

export default app;

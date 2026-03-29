export function validatePdfUpload(file) {
  if (!file) {
    return "A PDF file is required.";
  }

  const isPdfMimeType = file.mimetype === "application/pdf";
  const isPdfExtension = file.originalname.toLowerCase().endsWith(".pdf");

  if (!isPdfMimeType || !isPdfExtension) {
    return "Only PDF files are allowed.";
  }

  return null;
}

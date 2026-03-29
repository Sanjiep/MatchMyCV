import { apiBaseUrl } from "../config.js";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("cv", file);

  const response = await fetch(`${apiBaseUrl}/upload`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({
    error: "The server returned an unreadable response.",
  }));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to upload and analyze the resume.");
  }

  return payload;
}

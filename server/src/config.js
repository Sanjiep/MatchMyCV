export const config = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jobApiUrl: process.env.JOB_API_URL || "",
  jobApiKey: process.env.JOB_API_KEY || "",
};

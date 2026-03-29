export const config = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jobProvider: process.env.JOB_PROVIDER || "tyomarkkinatori",
  jobApiUrl: process.env.JOB_API_URL || "",
  jobApiId: process.env.JOB_API_ID || "",
  jobApiKey: process.env.JOB_API_KEY || "",
};

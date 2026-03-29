import { useState } from "react";
import { uploadResume } from "./services/api";

const SUMMARY_SECTIONS = [
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "jobTitles", label: "Job Titles" },
  { key: "education", label: "Education" },
  { key: "languages", label: "Languages" },
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Select a PDF resume before uploading.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = await uploadResume(selectedFile);
      setResult(payload);
    } catch (uploadError) {
      setResult(null);
      setError(uploadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(event) {
    const [file] = event.target.files || [];
    setSelectedFile(file || null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30">
          <div className="grid gap-10 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-14">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                AI-powered resume matching
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  MatchMyCV
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Upload your CV in PDF format and prepare it for precise job
                  matching, scoring, and tailored application insights.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Format</p>
                  <p className="mt-2 text-lg font-semibold">PDF only</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Focus</p>
                  <p className="mt-2 text-lg font-semibold">Fast parsing</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Goal</p>
                  <p className="mt-2 text-lg font-semibold">Better matches</p>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Upload your PDF</h2>
                <p className="text-sm leading-6 text-slate-400">
                  Upload a CV to parse resume details and receive matched jobs
                  directly from the backend.
                </p>
              </div>

              <form className="mt-6" onSubmit={handleSubmit}>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-400/40 bg-cyan-400/5 px-6 py-10 text-center transition hover:border-cyan-300 hover:bg-cyan-400/10">
                  <div className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-2xl text-cyan-200">
                      PDF
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">
                        Drop a resume here or click to browse
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Accepted file type: .pdf
                      </p>
                    </div>
                  </div>
                  <input
                    className="sr-only"
                    type="file"
                    accept="application/pdf,.pdf"
                    aria-label="Upload CV PDF"
                    onChange={handleFileChange}
                  />
                </label>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                  <span className="truncate">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                  {selectedFile ? (
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      Ready
                    </span>
                  ) : null}
                </div>

                {error ? (
                  <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/60"
                >
                  {isLoading ? "Analyzing CV..." : "Upload CV"}
                </button>
              </form>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Parsed Resume Summary</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Structured resume details extracted from the uploaded PDF.
                </p>
              </div>
            </div>

            {result?.resume ? (
              <div className="mt-6 space-y-4">
                {SUMMARY_SECTIONS.map((section) => (
                  <div
                    key={section.key}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      {section.label}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      {result.resume[section.key]?.length ? (
                        result.resume[section.key].map((item) => (
                          <li key={`${section.key}-${item}`}>{item}</li>
                        ))
                      ) : (
                        <li className="text-slate-500">No data extracted yet.</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/70 px-5 py-10 text-center text-sm text-slate-500">
                Upload a PDF CV to see parsed skills, experience, education, and languages.
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Matched Jobs</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Backend-scored job opportunities based on your uploaded resume.
              </p>
            </div>

            {result?.jobs?.length ? (
              <div className="mt-6 space-y-4">
                {result.jobs.map((job) => (
                  <article
                    key={`${job.company}-${job.title}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                          Fit Score
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">{job.fitScore}/100</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {job.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <span className={getCategoryClassName(job.probability)}>
                        {job.probability}
                      </span>
                      <a
                        className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                        href={job.applicationLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Apply now
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/70 px-5 py-10 text-center text-sm text-slate-500">
                Upload a PDF CV to see matched jobs and fit scores.
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

function getCategoryClassName(category) {
  const baseClassName =
    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]";

  if (category === "High Probability") {
    return `${baseClassName} bg-emerald-400/15 text-emerald-200`;
  }

  if (category === "Medium Probability") {
    return `${baseClassName} bg-amber-400/15 text-amber-200`;
  }

  return `${baseClassName} bg-slate-700 text-slate-200`;
}

export default App;

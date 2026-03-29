import { useMemo, useState } from "react";
import { uploadResume } from "./services/api";

const SUMMARY_SECTIONS = [
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "jobTitles", label: "Job Titles" },
  { key: "education", label: "Education" },
  { key: "languages", label: "Languages" },
];

const CATEGORY_FILTERS = [
  "All",
  "High Probability",
  "Medium Probability",
  "Stretch",
];

const SORT_OPTIONS = [
  { value: "highest", label: "Highest fit score first" },
  { value: "lowest", label: "Lowest fit score first" },
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("highest");

  const visibleJobs = useMemo(() => {
    const jobs = result?.jobs ?? [];
    const filteredJobs =
      activeCategory === "All"
        ? jobs
        : jobs.filter((job) => job.probability === activeCategory);

    return [...filteredJobs].sort((left, right) =>
      sortOrder === "highest"
        ? right.fitScore - left.fitScore
        : left.fitScore - right.fitScore
    );
  }, [activeCategory, result?.jobs, sortOrder]);

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-6 py-10 text-white sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-12">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                AI-powered resume matching
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  MatchMyCV
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Upload your CV in PDF format and instantly review a parsed
                  resume summary, ranked job matches, and fit signals you can act on.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoCard label="Format" value="PDF only" />
                <InfoCard label="Results" value="Scored matches" />
                <InfoCard label="Speed" value="One upload flow" />
              </div>
            </div>

            <section className="rounded-[1.75rem] border border-cyan-400/20 bg-slate-950/70 p-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Upload your PDF</h2>
                <p className="text-sm leading-6 text-slate-400">
                  Send your CV to the backend for parsing, scoring, and matched jobs.
                </p>
              </div>

              <form className="mt-6" onSubmit={handleSubmit}>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-cyan-400/40 bg-cyan-400/5 px-6 py-10 text-center transition hover:border-cyan-300 hover:bg-cyan-400/10">
                  <div className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-base font-semibold text-cyan-200">
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

                <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                  <span className="truncate">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      selectedFile
                        ? "bg-cyan-400/10 text-cyan-200"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {selectedFile ? "Ready" : "Waiting"}
                  </span>
                </div>

                {error ? (
                  <p className="mt-4 rounded-[1.25rem] border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-[1.25rem] bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/60"
                >
                  {isLoading ? "Analyzing CV..." : "Upload CV"}
                </button>
              </form>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Parsed Resume Summary</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Structured details extracted from your uploaded PDF.
              </p>
            </div>

            {isLoading ? (
              <LoadingPanel message="Extracting skills, experience, titles, education, and languages..." />
            ) : result?.resume ? (
              <div className="mt-6 space-y-4">
                {SUMMARY_SECTIONS.map((section) => (
                  <div
                    key={section.key}
                    className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4"
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
              <EmptyPanel message="Upload a PDF CV to see parsed skills, experience, education, and languages." />
            )}
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Matched Jobs</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Filter and sort backend-scored opportunities to focus on the best fit.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                {result?.jobs?.length ? `${visibleJobs.length} of ${result.jobs.length} jobs shown` : "No jobs yet"}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeCategory === category
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <label className="flex flex-col gap-2 text-sm text-slate-300 sm:max-w-xs">
                <span className="font-medium text-slate-200">Sort results</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isLoading ? (
              <LoadingPanel message="Scoring jobs, ranking fit, and preparing match categories..." />
            ) : error ? (
              <div className="mt-6 rounded-[1.25rem] border border-rose-400/30 bg-rose-400/10 px-5 py-6 text-sm text-rose-200">
                The upload could not be completed. Fix the issue above and try again.
              </div>
            ) : result?.jobs?.length ? (
              visibleJobs.length ? (
                <div className="mt-6 space-y-4">
                  {visibleJobs.map((job) => (
                    <article
                      key={`${job.company}-${job.title}`}
                      className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/25"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {job.company} | {job.location}
                          </p>
                        </div>
                        <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                            Fit Score
                          </p>
                          <p className="mt-1 text-2xl font-bold text-white">{job.fitScore}/100</p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-300">
                        {job.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <span className={getCategoryClassName(job.probability)}>
                          {job.probability}
                        </span>
                        <a
                          className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                          href={job.applicationLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Application link
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyPanel message="No jobs match the current category filter. Try another filter or sorting option." />
              )
            ) : (
              <EmptyPanel message="Upload a PDF CV to see matched jobs, fit scores, categories, and links." />
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function LoadingPanel({ message }) {
  return (
    <div className="mt-6 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/5 px-5 py-8 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
      <p className="mt-4 text-sm leading-6 text-cyan-100">{message}</p>
    </div>
  );
}

function EmptyPanel({ message }) {
  return (
    <div className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-slate-950/70 px-5 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
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

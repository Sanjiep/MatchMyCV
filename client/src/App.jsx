function App() {
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
                  Start by selecting a CV file. This UI is ready for backend
                  integration in the next step.
                </p>
              </div>

              <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-400/40 bg-cyan-400/5 px-6 py-10 text-center transition hover:border-cyan-300 hover:bg-cyan-400/10">
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
                />
              </label>

              <button
                type="button"
                className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Upload CV
              </button>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;

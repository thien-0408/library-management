import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "1.24M", label: "Volumes curated" },
  { value: "24/7", label: "Digital access" },
  { value: "120+", label: "Study rooms & exhibits" },
  { value: "98%", label: "Reservation fulfillment" },
];

const features = [
  {
    title: "Curated book discovery",
    description:
      "Browse modern titles and rare references in a catalog designed for focused research.",
  },
  {
    title: "Room reservations",
    description:
      "Reserve quiet rooms and discussion spaces with real-time availability for every session.",
  },
  {
    title: "Unified library control",
    description:
      "Handle circulation, inventory, requests, and room operations from one modern dashboard.",
  },
];

const highlights = [
  "Rare manuscripts and modern classics",
  "Live room booking and availability",
  "Built for students, researchers, and librarians",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.22),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(244,63,94,0.18),_transparent_28%),linear-gradient(180deg,_#fff7f7_0%,_#f8fafc_72%)]" />
        <div className="absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-[#DC2626]/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 -z-10 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DC2626] text-white shadow-lg shadow-red-200/70">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                OpenBook
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Digital archive
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-red-200 hover:text-[#DC2626] sm:inline-flex"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-full bg-[#991B1B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200/80 transition hover:bg-[#B91C1C]"
            >
              Create Account
            </Link>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-24 lg:pt-10">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
              The curator of human knowledge
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              A modern library experience for
              <span className="bg-gradient-to-r from-[#DC2626] via-rose-500 to-pink-400 bg-clip-text text-transparent">
                {" "}
                research, discovery, and calm study.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Explore curated collections, request books, and reserve study
              rooms from one premium archive platform designed for the modern
              scholar.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#DC2626] px-7 py-4 text-base font-bold text-white shadow-xl shadow-red-200/80 transition hover:-translate-y-0.5 hover:bg-[#B91C1C]"
              >
                Start your archive account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 px-7 py-4 text-base font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:border-red-200 hover:text-[#DC2626]"
              >
                Sign in to continue
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/55 p-4 shadow-2xl shadow-red-100/60 backdrop-blur-xl sm:p-5">
              <div className="relative overflow-hidden rounded-[1.6rem] bg-[#FFF5F5]">
                <Image
                  src="/lib.jpg"
                  alt="OpenBook archive shelves"
                  width={900}
                  height={760}
                  className="h-[420px] w-full object-cover sm:h-[500px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-900/10 to-transparent" />

                <div className="absolute left-5 top-5 rounded-2xl border border-white/40 bg-white/25 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                    Archive status
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    1,240,892 Volumes Online
                  </p>
                </div>

                <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/40 bg-white/16 p-5 text-white shadow-lg backdrop-blur-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
                    Current exhibit
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold leading-tight">
                        The evolution of human thought
                      </h2>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                        Browse rare manuscripts and contemporary scholarship
                        through one refined research interface.
                      </p>
                    </div>
                    <div className="hidden rounded-2xl border border-white/35 bg-white/15 px-4 py-3 text-right backdrop-blur md:block">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                        Live today
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        128 seats available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/*<div className="absolute -bottom-6 -left-6 hidden max-w-xs rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-xl backdrop-blur-xl lg:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Why OpenBook
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  Books, requests, and room reservations flow through one calm
                  interface.
                </p>
                requ
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Designed for librarians, students, and researchers who need
                  clarity instead of clutter.
                </p>
              </div>*/}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-6 lg:px-10 lg:pb-10">
          <div className="grid gap-4 rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-lg shadow-red-100/40 backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-md"
              >
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#DC2626]">
              What the platform unlocks
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A quieter, sharper way to move through your library system.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-lg shadow-red-100/40 backdrop-blur-xl"
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#DC2626]/8 blur-2xl" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF5F5] text-[#DC2626] shadow-sm">
                    <span className="text-sm font-bold">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-4 lg:px-10 lg:pb-24">
          <div className="grid gap-6 rounded-[2.5rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,245,245,0.95),rgba(255,255,255,0.72))] p-6 shadow-2xl shadow-red-100/50 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr] lg:p-8">
            <div className="rounded-[2rem] bg-[#991B1B] px-7 py-8 text-white shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/75">
                Built for the modern scholar
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Step into a digital archive that feels editorial, calm, and
                immediate.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                From book requests to room scheduling, every surface is designed
                to keep discovery elegant and operations manageable.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#991B1B] transition hover:bg-white/90"
                >
                  Join OpenBook
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Access your archive
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/80 bg-white/75 p-5 shadow-md backdrop-blur-xl sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Scholar note
                </p>
                <p className="mt-3 text-xl font-bold text-slate-900">
                  The homepage now mirrors the product’s refined archive
                  language instead of a generic app shell.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/80 bg-white/70 p-5 shadow-md backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-500">
                  Collection access
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  Global catalog
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  One entry point for discovery, requesting, and reading
                  planning.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/80 bg-white/70 p-5 shadow-md backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-500">
                  Study workflow
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  Live reservations
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Quiet-room and discussion-space booking with clear status
                  visibility.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

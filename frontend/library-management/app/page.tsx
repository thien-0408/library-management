"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

const stats = [
  { value: "1.24M", label: "Volumes indexed" },
  { value: "128", label: "Seats live today" },
  { value: "42K", label: "Monthly requests" },
  { value: "98%", label: "Fulfilled on time" },
];

const featureCards = [
  {
    title: "Search that feels cinematic",
    body: "Move from ancient manuscripts to modern research with rich catalog context and instant request paths.",
    meta: "Catalog intelligence",
  },
  {
    title: "Rooms that react in real time",
    body: "Availability, capacity, and booking state stay visible so study groups can reserve without friction.",
    meta: "Live reservations",
  },
  {
    title: "Operations behind the curtain",
    body: "Inventory, approvals, fines, notifications, and user flows sit inside one controlled library workspace.",
    meta: "Admin command",
  },
];

const archiveRows = [
  [
    "Rare folios",
    "Design journals",
    "Research rooms",
    "Digital loans",
    "Quiet zones",
    "Faculty reserves",
  ],
  [
    "Live holds",
    "Fine tracking",
    "Open stacks",
    "Reading lists",
    "Archive notes",
    "Smart requests",
  ],
];

const process = [
  "Discover a title or space",
  "Reserve, request, or bookmark",
  "Track every update from your portal",
];

export default function Home() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });
  const smoothY = useSpring(pointerY, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${smoothX}px ${smoothY}px, rgba(248, 113, 113, 0.22), transparent 44%)`;

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#080605] text-[#fff7ed]"
      onPointerMove={(event) => {
        pointerX.set(event.clientX);
        pointerY.set(event.clientY);
      }}
    >
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: glow }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.42),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(251,146,60,0.18),transparent_25%),linear-gradient(180deg,#080605_0%,#160b09_46%,#080605_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 shadow-2xl shadow-red-950/40 backdrop-blur">
              <span className="h-4 w-4 rounded-full bg-red-500 shadow-[0_0_24px_rgba(239,68,68,.9)] transition group-hover:scale-125" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">OpenBook</p>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-orange-100/50">
                Living archive
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-bold text-orange-100/60 md:flex">
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#systems" className="transition hover:text-white">
              Systems
            </a>
            <a href="#access" className="transition hover:text-white">
              Access
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full border border-white/12 px-5 py-2.5 text-sm font-bold text-orange-50/75 transition hover:border-white/30 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-orange-50 px-5 py-2.5 text-sm font-black text-[#160b09] shadow-[0_12px_40px_rgba(248,113,113,.24)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Enter archive
            </Link>
          </div>
        </header>

        <section className="mx-auto grid min-h-[calc(100vh-5.5rem)] w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-orange-100/65 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              Library system reimagined
            </div>

            <h1 className="mt-7 max-w-5xl text-6xl font-black leading-[0.88] tracking-[-0.08em] text-orange-50 sm:text-7xl lg:text-[7.8rem]">
              Make study feel like stepping into a living archive.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-orange-100/62 sm:text-xl">
              An interactive landing page for OpenBook: cinematic discovery,
              live room booking, and library operations presented with motion,
              depth, and calm precision.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center rounded-full bg-[#f43f2f] px-7 py-4 text-base font-black text-white shadow-[0_22px_70px_rgba(244,63,47,.34)] transition hover:-translate-y-1 hover:bg-[#ff523f]"
              >
                Start exploring
                <span className="ml-3 transition group-hover:translate-x-1">
                  -&gt;
                </span>
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-7 py-4 text-base font-bold text-orange-50/80 backdrop-blur transition hover:border-white/25 hover:text-white"
              >
                View catalog
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[3rem] bg-red-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/12 bg-white/[0.07] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[2rem]">
                <Image
                  src="/lib.jpg"
                  alt="OpenBook cinematic library archive"
                  width={900}
                  height={980}
                  priority
                  className="h-[540px] w-full object-cover saturate-[0.78]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0)_0%,rgba(8,6,5,.18)_38%,rgba(8,6,5,.92)_100%)]" />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-5 top-5 rounded-3xl border border-white/16 bg-black/30 p-5 backdrop-blur-md will-change-transform"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-100/55">
                    Archive pulse
                  </p>
                  <p className="mt-2 text-3xl font-black">1,240,892</p>
                  <p className="mt-1 text-sm font-semibold text-orange-100/60">
                    volumes online
                  </p>
                </motion.div>
                <div className="absolute bottom-5 left-5 right-5 rounded-[1.7rem] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-100/55">
                    Current journey
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    Reserve a quiet room. Request a rare book. Continue reading.
                  </h2>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {stats.slice(1).map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl bg-black/24 p-3"
                      >
                        <p className="text-lg font-black">{stat.value}</p>
                        <p className="mt-1 text-[11px] font-bold leading-tight text-orange-100/52">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="experience"
          className="border-y border-white/10 bg-white/[0.035] py-6 backdrop-blur-xl"
        >
          <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -6 }}
                className="rounded-[1.6rem] border border-white/10 bg-black/18 p-6"
              >
                <p className="text-4xl font-black tracking-tight text-orange-50">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-bold text-orange-100/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="systems"
          className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-red-300/80">
              Interactive systems
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
              Not a flat homepage. A responsive product mood.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{
                  y: -10,
                  rotate: index === 1 ? 0 : index === 0 ? -1.5 : 1.5,
                }}
                className="group relative min-h-80 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl"
              >
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-100/60 to-transparent" />
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/18 blur-3xl transition group-hover:bg-orange-400/25" />
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-100/45">
                  {feature.meta}
                </p>
                <h3 className="mt-16 text-3xl font-black tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-orange-100/58">
                  {feature.body}
                </p>
                <span className="absolute bottom-7 left-7 text-7xl font-black tracking-[-0.08em] text-white/[0.04]">
                  0{index + 1}
                </span>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden py-12">
          {archiveRows.map((row, rowIndex) => (
            <motion.div
              key={row.join("")}
              animate={{ x: rowIndex === 0 ? [0, -420, 0] : [-420, 0, -420] }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              className="mb-4 flex w-max gap-4 px-5"
            >
              {[...row, ...row, ...row].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-white/10 bg-white/[0.045] px-8 py-4 text-2xl font-black tracking-[-0.04em] text-orange-50/70 backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          ))}
        </section>

        <section
          id="access"
          className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10"
        >
          <div className="grid gap-5 rounded-[2.6rem] border border-white/10 bg-[#f8efe2] p-5 text-[#180d09] shadow-[0_30px_100px_rgba(0,0,0,.35)] lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
            <div className="rounded-[2rem] bg-[#180d09] p-8 text-orange-50 lg:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-100/45">
                Build with AI agents
              </p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Prompt for direction. Let the agent implement.
              </h2>
              <p className="mt-5 text-base leading-7 text-orange-100/62">
                Ask Codex, Claude Code, or Antigravity for sections, motion
                states, responsive polish, then verify in the browser and
                iterate by feel.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-full bg-red-500 px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-red-400"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-white/15 px-6 py-3.5 text-center text-sm font-black text-white/80 transition hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {process.map((step, index) => (
                <motion.div
                  key={step}
                  whileHover={{ y: -8 }}
                  className="rounded-[1.7rem] border border-black/10 bg-white/55 p-6 shadow-sm"
                >
                  <p className="text-sm font-black text-red-600">
                    0{index + 1}
                  </p>
                  <p className="mt-14 text-2xl font-black tracking-tight">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

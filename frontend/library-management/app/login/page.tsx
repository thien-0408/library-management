"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import Toast from "@/components/toast_notification";
import { useToast } from "@/hooks/useToast";
import { saveAuthSession } from "@/lib/api";
import { login } from "./services/auth";

const accessNotes = [
  "1.24M volumes online",
  "Live study-room status",
  "Admin-ready workspace",
];

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object") {
    const maybeError = error as {
      data?: { message?: string };
      message?: string;
    };
    return maybeError.data?.message || maybeError.message || "Connection error";
  }

  return "Connection error";
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { toastConfig, showToast, hideToast } = useToast();
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
  const glow = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, rgba(240, 211, 172, 0.24), transparent 44%)`;

  const redirectAfterLogin = (role?: string | null) => {
    window.setTimeout(() => {
      window.location.href =
        role?.toLowerCase() === "admin" ? "/adminInventory" : "/catalog";
    }, 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const data = await login(email, password);
      const accessToken = data.accessToken || data.AccessToken;
      const refreshToken = data.refreshToken || data.RefreshToken;

      if (accessToken) {
        const role = saveAuthSession(accessToken, refreshToken, email);
        showToast(
          "Login successful",
          "Redirecting to your library workspace.",
          "success",
        );
        redirectAfterLogin(role);
      } else {
        const message = "Login failed";
        setErrorMsg(message);
        showToast("Login failed", message, "error");
      }
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err);
      setErrorMsg(message);
      showToast("Login failed", message, "error");
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080605] px-4 py-8 text-orange-50 sm:px-6 lg:px-8"
      onPointerMove={(event) => {
        pointerX.set(event.clientX);
        pointerY.set(event.clientY);
      }}
    >
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: glow }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(240,211,172,0.34),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(240,211,172,0.18),transparent_28%),linear-gradient(180deg,#080605_0%,#15100b_54%,#080605_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:72px_72px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2.6rem] border border-white/12 bg-white/[0.055] p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]"
      >
        <section className="relative hidden min-h-[720px] overflow-hidden rounded-[2.1rem] bg-[#150b08] lg:block">
          <Image
            src="/login.avif"
            alt="OpenBook archive access"
            fill
            priority
            className="object-cover opacity-70 saturate-[0.76]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,.08)_0%,rgba(8,6,5,.46)_48%,rgba(8,6,5,.96)_100%)]" />
          <Link
            href="/"
            className="absolute left-8 top-8 flex items-center gap-3"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur">
              <span className="h-4 w-4 rounded-full bg-[#f0d3ac] shadow-[0_0_24px_rgba(240,211,172,.72)]" />
            </span>
            <span>
              <span className="block text-lg font-black">OpenBook</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.34em] text-orange-100/50">
                Secure archive
              </span>
            </span>
          </Link>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute right-7 top-28 rounded-3xl border border-white/16 bg-black/30 p-5 backdrop-blur-md will-change-transform"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-100/55">
              Archive pulse
            </p>
            <p className="mt-2 text-3xl font-black">24/7</p>
            <p className="text-sm font-semibold text-orange-100/60">
              digital access
            </p>
          </motion.div>

          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-100/45">
              Welcome back
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.06em]">
              Return to your living library workspace.
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              {accessNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-xs font-black text-orange-50/75 backdrop-blur"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10">
                <span className="h-3.5 w-3.5 rounded-full bg-[#f0d3ac]" />
              </span>
              <span className="text-lg font-black">OpenBook</span>
            </Link>

            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#f0d3ac]/75">
              Member access
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Sign in to continue.
            </h2>
            <p className="mt-4 text-base leading-7 text-orange-100/58">
              Access catalog requests, reservations, notifications, and your
              library profile from one calm interface.
            </p>

            {errorMsg && (
              <div className="mt-6 rounded-2xl border border-[#f0d3ac]/30 bg-[#f0d3ac]/10 px-4 py-3 text-sm font-bold text-[#f8e4c6]">
                {errorMsg}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.24em] text-orange-100/48">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="curator@openbook.archive"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-bold text-orange-50 outline-none transition placeholder:text-orange-100/28 focus:border-[#f0d3ac]/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-[#f0d3ac]/10"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="block text-xs font-black uppercase tracking-[0.24em] text-orange-100/48">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-black text-[#f0d3ac]/80 transition hover:text-white"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-bold text-orange-50 outline-none transition placeholder:text-orange-100/28 focus:border-[#f0d3ac]/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-[#f0d3ac]/10"
                  required
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold text-orange-100/58">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-[#f0d3ac] focus:ring-[#f0d3ac]"
                />
                Keep me signed in for 30 days
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-[#f0d3ac] px-7 py-4 text-sm font-black text-[#160b09] shadow-[0_22px_70px_rgba(240,211,172,.32)] transition hover:-translate-y-0.5 hover:bg-[#f8e4c6]"
              >
                Sign in
              </button>
            </form>

            <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-black/16 p-5 text-center">
              <p className="text-sm font-semibold text-orange-100/55">
                No archive account yet?
              </p>
              <Link
                href="/register"
                className="mt-3 inline-flex rounded-full border border-white/12 px-5 py-2.5 text-sm font-black text-orange-50 transition hover:border-white/28 hover:bg-white/10"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </motion.div>

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />
    </main>
  );
}

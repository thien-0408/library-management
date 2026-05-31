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
import { register } from "../login/services/auth";

const onboardingSteps = [
  "Create reader identity",
  "Request books instantly",
  "Reserve rooms in real time",
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

export default function RegisterPage() {
  const [userFullName, setUserFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const redirectToLogin = () => {
    window.setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      const message = "Passwords do not match!";
      setErrorMsg(message);
      showToast("Registration failed", message, "error");
      return;
    }

    try {
      await register(userFullName, email, password);
      showToast(
        "Registration successful",
        "Your account was created. Redirecting to login.",
        "success",
      );
      redirectToLogin();
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err);
      setErrorMsg(message);
      showToast("Registration failed", message, "error");
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
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2.6rem] border border-white/12 bg-white/[0.055] p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]"
      >
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10">
                <span className="h-3.5 w-3.5 rounded-full bg-[#f0d3ac] shadow-[0_0_20px_rgba(240,211,172,.72)]" />
              </span>
              <span>
                <span className="block text-lg font-black">OpenBook</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.34em] text-orange-100/45">
                  New account
                </span>
              </span>
            </Link>

            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#f0d3ac]/75">
              Archive onboarding
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Create your library identity.
            </h1>
            <p className="mt-4 text-base leading-7 text-orange-100/58">
              Join the OpenBook archive to request titles, reserve rooms, and
              keep your study workflow synchronized.
            </p>

            {errorMsg && (
              <div className="mt-6 rounded-2xl border border-[#f0d3ac]/30 bg-[#f0d3ac]/10 px-4 py-3 text-sm font-bold text-[#f8e4c6]">
                {errorMsg}
              </div>
            )}

            <form className="mt-8 space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.24em] text-orange-100/48">
                  Full name
                </label>
                <input
                  type="text"
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-bold text-orange-50 outline-none transition placeholder:text-orange-100/28 focus:border-[#f0d3ac]/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-[#f0d3ac]/10"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.24em] text-orange-100/48">
                  Email address
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.24em] text-orange-100/48">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-bold text-orange-50 outline-none transition placeholder:text-orange-100/28 focus:border-[#f0d3ac]/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-[#f0d3ac]/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.24em] text-orange-100/48">
                    Confirm
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-bold text-orange-50 outline-none transition placeholder:text-orange-100/28 focus:border-[#f0d3ac]/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-[#f0d3ac]/10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#f0d3ac] px-7 py-4 text-sm font-black text-[#160b09] shadow-[0_22px_70px_rgba(240,211,172,.32)] transition hover:-translate-y-0.5 hover:bg-[#f8e4c6]"
              >
                Create account
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-semibold text-orange-100/55">
              Already have access?{" "}
              <Link
                href="/login"
                className="font-black text-[#f0d3ac] transition hover:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden min-h-[720px] overflow-hidden rounded-[2.1rem] bg-[#150b08] lg:block">
          <Image
            src="/register.webp"
            alt="OpenBook registration archive"
            fill
            priority
            className="object-cover opacity-70 saturate-[0.78]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,.08)_0%,rgba(8,6,5,.48)_46%,rgba(8,6,5,.96)_100%)]" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.15,
            }}
            className="absolute left-7 top-7 rounded-3xl border border-white/16 bg-black/30 p-5 backdrop-blur-md will-change-transform"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-100/55">
              Seats available
            </p>
            <p className="mt-2 text-3xl font-black">128</p>
            <p className="text-sm font-semibold text-orange-100/60">
              ready today
            </p>
          </motion.div>

          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-100/45">
              What unlocks
            </p>
            <h2 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.06em]">
              A modern archive account for focused study.
            </h2>
            <div className="mt-7 grid gap-3">
              {onboardingSteps.map((step, index) => (
                <motion.div
                  key={step}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.08] p-4 backdrop-blur"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0d3ac] text-sm font-black text-[#180d09]">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-black text-orange-50/78">
                    {step}
                  </span>
                </motion.div>
              ))}
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

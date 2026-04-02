"use client";
import React, { useState } from "react";
import Link from "next/link";
export default function RegisterPage() {
  const [userFullName, setUserFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userFullName, email, password }),
        },
      );
      const data = await res.json();
      if ((res.ok && data.code === 200) || data.result) {
        alert("Register OK, please login");
      } else {
        setErrorMsg(data.message || "Registration failed");
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Connection error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 md:p-8 font-sans relative">
      {/* Floating Status Badge */}
      <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg border border-gray-100 p-2 pr-6 flex items-center gap-4 z-50">
        <div className="bg-[#DC2626] w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0">
          <svg
            className="w-5 h-5"
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
          <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">
            Archive Status
          </p>
          <p className="text-xs font-bold text-gray-900">
            1,240,892 Volumes Online
          </p>
        </div>
      </div>

      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-sm flex flex-col md:flex-row overflow-hidden p-4 md:p-6 gap-8">
        {/* Left Side: Branding / Showcase */}
        <div className="w-full md:w-1/2 bg-[#FFF5F5] rounded-[2rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <span className="font-bold text-xl text-[#DC2626]">OpenBook</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight text-gray-900 mb-2">
              Join the world&apos;s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-pink-400">
                digital library.
              </span>
            </h1>

            <p className="text-[#475569] mt-6 text-lg leading-relaxed max-w-sm">
              Access our high-end editorial archive of rare manuscripts and
              modern classics. A library designed for the modern scholar.
            </p>
          </div>

          {/* Abstract Image / Graphic below */}
          <div className="mt-16 relative w-full aspect-[4/3] z-20">
            {/* This represents the dark interior image from the design */}
            <div className="absolute inset-0 rounded-2xl bg-slate-800 overflow-hidden shadow-2xl flex items-center justify-center text-[#475569] text-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center text-[#475569] text-sm">
                [ Interior Image Placeholder ]
              </div>
            </div>

            {/* Overlapping Info Card */}
            <div className="absolute -bottom-6 -right-6 md:auto md:bottom-[-10px] md:right-[-10px] bg-white rounded-2xl p-6 shadow-xl w-[260px] transform md:-translate-x-8 md:-translate-y-8 z-30">
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-2">
                Current Exhibit
              </p>
              <p className="text-sm font-bold text-gray-900 leading-snug">
                The Evolution of Human Thought
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create account
            </h2>
            <p className="text-[#475569] mb-6">
              Start your digital curation journey today.
            </p>

            {errorMsg && (
              <div className="mb-4 text-sm text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Fullname
                </label>
                <input
                  type="text"
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#FFF5F5] text-gray-900 placeholder-gray-400 border-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="curator@bigbook.archive"
                  className="w-full bg-[#FFF5F5] text-gray-900 placeholder-gray-400 border-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-[#FFF5F5] text-gray-900 placeholder-gray-400 border-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-[#FFF5F5] text-gray-900 placeholder-gray-400 border-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#991B1B] hover:bg-[#DC2626] text-white font-bold py-4 rounded-xl mt-4 transition-colors text-sm shadow-md"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-8 relative flex items-center center justify-center">
              <div className="absolute border-t border-gray-100 w-full"></div>
              <span className="bg-white px-4 text-[10px] text-gray-400 uppercase tracking-widest relative z-10 font-medium">
                Or continue with
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Github
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-[#475569]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#DC2626] font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

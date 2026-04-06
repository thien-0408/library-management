"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();
      if ((res.ok && data.code === 200) || data.result) {
        alert("ok");
      } else {
        setErrorMsg(data.message || "Login failed");
      console.log(email);
      console.log(password);
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

            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight text-gray-900 mb-2">
              The curator of <br />
              <span className="text-[#DC2626]">human knowledge.</span>
            </h1>

            <p className="text-[#475569] mt-6 text-lg leading-relaxed max-w-sm">
              Access our high-end editorial archive of rare manuscripts and
              modern classics. A library designed for the modern scholar.
            </p>
          </div>

          {/* Abstract Image / Graphic below */}
          <div className="mt-16 relative w-full aspect-[4/3] z-20">
            {/* This represents the interior archieve bookshelf image from the design */}
            <div className="absolute inset-0 rounded-xl bg-[#E2E8F0] overflow-hidden shadow-inner flex items-center justify-center text-[#475569] text-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D1D5DB] to-[#9CA3AF] flex items-center justify-center text-[#475569] text-sm">
                <Image src="/login-theme.jpeg" alt="Login Image" width={600} height={600}  />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-[#475569] mb-6">
              Please enter your credentials to access the archive.
            </p>

            {errorMsg && (
              <div className="mb-4 text-sm text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@doe.com"
                  className="w-full bg-[#FFF5F5] text-gray-900 placeholder-gray-400 border-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-[#FFF5F5] text-gray-900 placeholder-gray-400 border-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]"
                />
                <label htmlFor="remember" className="text-sm text-[#475569]">
                  Keep me signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-4 rounded-xl mt-4 transition-colors text-sm shadow-md"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 relative flex items-center center justify-center">
              <div className="absolute border-t border-gray-100 w-full"></div>
              <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-widest relative z-10 font-medium">
                Or
              </span>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-4 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-900 w-full"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Create Account
              </Link>
            </div>

            <p className="mt-12 text-center text-xs text-[#475569] leading-relaxed max-w-sm mx-auto">
              By signing in, you agree to our{" "}
              <Link href="#" className="underline hover:text-gray-900">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-gray-900">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

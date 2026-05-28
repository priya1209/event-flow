"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLogin } from "@/src/hooks/useAuth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync(email);
      // Redirect to home page on successful login
      router.push("/");
    } catch (err: unknown) {
      setError((err as Error).message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-[#7b61ff] to-[#a084fa] p-2 rounded-lg shadow">
            {/* Calendar Icon */}
            <svg width="24" height="24" fill="none">
              <rect width="24" height="24" rx="6" fill="url(#cal-gradient)" />
              <defs>
                <linearGradient id="cal-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7b61ff" />
                  <stop offset="1" stopColor="#a084fa" />
                </linearGradient>
              </defs>
              <path d="M7 11h10M7 15h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="5" y="7" width="14" height="12" rx="2" stroke="#fff" strokeWidth="1.5" />
              <rect x="8" y="3" width="2" height="4" rx="1" fill="#fff" />
              <rect x="14" y="3" width="2" height="4" rx="1" fill="#fff" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl text-[#222] tracking-tight">EventFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 8px 32px 0 rgba(123,97,255,0.25)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-tr from-[#7b61ff] to-[#a084fa] text-white font-bold px-5 py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Get Started
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
          className="w-full max-w-md"
        >
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6b6b8a] hover:text-[#7b61ff] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to home
          </Link>

          {/* Sign In Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-[#222] mb-6">Sign in</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b61ff] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b61ff] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-[#7b61ff] to-[#a084fa] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#7b61ff] font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Demo: use demo@eventflow.app to sign in
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

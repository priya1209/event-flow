"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-lg mt-4 mx-4"
    >
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
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/signin"
            className="text-[#7b61ff] font-semibold px-4 py-2 rounded-lg hover:bg-[#f3f0ff] transition-all duration-200 block"
          >
            Sign In
          </Link>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 8px 32px 0 rgba(123,97,255,0.25)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-tr from-[#7b61ff] to-[#a084fa] text-white font-bold px-5 py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
        >
          Get Started
        </motion.button>
      </div>
    </motion.header>
  );
}

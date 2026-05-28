"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center flex-1 px-4 py-12"
    >
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 4px 24px 0 rgba(123,97,255,0.10)" }}
        className="flex items-center gap-2 px-6 py-2 mb-8 rounded-full border border-[#e0e0f7] bg-white/70 backdrop-blur shadow-md text-[#7b61ff] font-semibold hover:bg-[#f3f0ff] transition-all duration-200"
      >
        <svg width="18" height="18" fill="none">
          <path d="M9 2v2M9 14v2M4.22 4.22l1.42 1.42M12.36 12.36l1.42 1.42M2 9h2M14 9h2M4.22 13.78l1.42-1.42M12.36 5.64l1.42-1.42" stroke="#7b61ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Discover amazing events near you
      </motion.button>
      <h1 className="text-5xl md:text-6xl font-extrabold text-[#222] text-center mb-2 leading-tight tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
        Find your next <br />
        <span className="bg-gradient-to-tr from-[#7b61ff] to-[#a084fa] bg-clip-text text-transparent drop-shadow-lg">
          unforgettable experience
        </span>
      </h1>
      <p className="text-lg text-[#6b6b8a] text-center mb-8 max-w-xl font-medium">
        Browse events, book tickets instantly, and create memories that last.<br />
        From tech talks to jazz nights.
      </p>
      <div className="w-full max-w-xl mb-8">
        <div className="flex items-center bg-white/80 rounded-full shadow-lg px-4 py-3 border border-[#e0e0f7] backdrop-blur">
          <svg width="20" height="20" fill="none" className="mr-2">
            <circle cx="9" cy="9" r="7" stroke="#bdbdf7" strokeWidth="2" />
            <path d="M15 15l3 3" stroke="#bdbdf7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by city, event name, or category..."
            className="flex-1 bg-transparent outline-none text-[#222] text-base placeholder-[#bdbdf7]"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {["All Events", "Tech", "Music", "Workshops", "Business", "Design", "Food", "Sports", "Art"].map((cat, i) => (
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: i === 0 ? "0 4px 24px 0 rgba(123,97,255,0.15)" : "0 2px 12px 0 rgba(123,97,255,0.08)" }}
            key={cat}
            className={`px-5 py-2 rounded-full font-semibold text-base shadow transition-all duration-200 ${i === 0
              ? "bg-gradient-to-tr from-[#7b61ff] to-[#a084fa] text-white shadow-lg"
              : "bg-white/80 text-[#7b61ff] border border-[#e0e0f7] hover:bg-[#f3f0ff]"
              }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

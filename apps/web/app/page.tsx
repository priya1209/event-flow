"use client";

import { motion } from "framer-motion";
import Header from "@/src/components/Header";
import HeroSection from "@/src/components/HeroSection";
import TrendingSection from "@/src/components/TrendingSection";
import UpcomingEventsSection from "@/src/components/UpcomingEventsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fd] via-[#e9e6ff] to-[#f7f7fd] flex flex-col">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col"
      >
        <HeroSection />
        <TrendingSection />
        <UpcomingEventsSection />
      </motion.main>
    </div>
  );
}
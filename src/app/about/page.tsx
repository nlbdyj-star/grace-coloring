"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Heart, BookOpen, Palette, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen bg-[#FAF8F4] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#222222] mb-6">
              About Grace Coloring
            </h1>
            <p className="text-lg text-[#666666] leading-relaxed">
              We believe creativity is a gift from God. Our mission is to help
              people of all ages connect with the Bible through art, coloring,
              and reflection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-[#E8E4DC]/50"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-[#7A8A6E] mx-auto mb-5">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-[#222222] mb-3">
                Our Mission
              </h3>
              <p className="text-[#666666]">
                To spread God&apos;s word through creative expression, making Bible
                stories accessible and engaging for everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-[#E8E4DC]/50"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-[#7A8A6E] mx-auto mb-5">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-[#222222] mb-3">
                Bible-Centered
              </h3>
              <p className="text-[#666666]">
                Every coloring page, wallpaper, and story is rooted in Scripture,
                designed to inspire faith and meditation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-[#E8E4DC]/50"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-[#7A8A6E] mx-auto mb-5">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-[#222222] mb-3">
                For All Ages
              </h3>
              <p className="text-[#666666]">
                From simple designs for young children to detailed illustrations
                for adults, there&apos;s something for everyone.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-[#E8E4DC]/50 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-medium text-[#222222] mb-4">
              Get in Touch
            </h2>
            <p className="text-[#666666] mb-6">
              Have questions, suggestions, or just want to say hello? We&apos;d love
              to hear from you.
            </p>
            <a
              href="mailto:hello@gracecoloring.com"
              className="inline-flex items-center gap-2 text-[#7A8A6E] hover:text-[#6A7A5E] font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              hello@gracecoloring.com
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

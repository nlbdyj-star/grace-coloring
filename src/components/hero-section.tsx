"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#FAF8F4]">
      {/* Background subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-20 sm:pt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100svh-6rem)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center py-8 lg:py-0"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#7A8A6E] mb-4 sm:mb-6"
            >
              Color. Reflect. Pray.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-[#222222] leading-[1.1] mb-4 sm:mb-6"
            >
              Find Peace
              <br />
              Through Creativity
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-md mb-8 sm:mb-10"
            >
              Color Bible stories, download beautiful wallpapers, and grow closer to God every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link href="/coloring-pages">
                <Button
                  className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7A8A6E]/20 w-full"
                >
                  Explore Coloring Pages
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              <Link href="/videos">
                <Button
                  variant="outline"
                  className="border-[#E8E4DC] text-[#222222] hover:bg-[#F5F2EC] rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium transition-all duration-300 w-full"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Watch Stories
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl aspect-[3/4] lg:aspect-auto lg:h-[calc(100svh-8rem)]">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#E8EDE5]/50 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-[#A8B8A1]/10 blur-3xl" />

              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden">
                <Image
                  src="/images/hero/hero-main.jpg"
                  alt="Jesus sitting peacefully under a tree - watercolor illustration"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F4]/20 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

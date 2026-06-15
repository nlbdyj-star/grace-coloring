"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { bibleVerse } from "@/lib/data";

export function DailyVerse() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/shepherd-psalm.jpg"
          alt="Peaceful shepherd in green pastures"
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#FAF8F4]/85" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Quote Mark */}
          <div className="mb-6 sm:mb-8">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto text-[#7A8A6E]/30"
            >
              <path
                d="M14 24C14 18.477 18.477 14 24 14V14C29.523 14 34 18.477 34 24V24C34 29.523 29.523 34 24 34V34C18.477 34 14 29.523 14 24V24Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M6 20C6 12.268 12.268 6 20 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M28 6C35.732 6 42 12.268 42 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <blockquote>
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-[#222222] leading-snug tracking-tight mb-4 sm:mb-6">
              {bibleVerse.text}
            </p>
            <footer>
              <cite className="text-sm sm:text-base font-medium text-[#7A8A6E] not-italic tracking-wide">
                {bibleVerse.reference}
              </cite>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

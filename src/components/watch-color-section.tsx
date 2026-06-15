"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WatchColorSection() {
  return (
    <section id="videos" className="py-16 sm:py-24 lg:py-32 bg-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#F5F2EC] overflow-hidden">
          {/* Decorative leaf element */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-10">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 20C100 20 140 60 140 120C140 160 120 180 100 180C80 180 60 160 60 120C60 60 100 20 100 20Z"
                stroke="#7A8A6E"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M100 40V160"
                stroke="#7A8A6E"
                strokeWidth="1.5"
              />
              <path
                d="M100 80C120 70 130 60 130 60"
                stroke="#7A8A6E"
                strokeWidth="1"
              />
              <path
                d="M100 100C80 90 70 80 70 80"
                stroke="#7A8A6E"
                strokeWidth="1"
              />
              <path
                d="M100 120C125 110 135 100 135 100"
                stroke="#7A8A6E"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
            {/* Video Player Area */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/video/jesus-calms-storm.jpg"
                alt="Jesus Calms the Storm - Bible story video"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#222222]/20 group-hover:bg-[#222222]/30 transition-colors duration-300" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-[#7A8A6E] ml-1" fill="#7A8A6E" />
                </div>
              </div>

              {/* Video Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-[#222222]/60 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium">Jesus Calms the Storm</span>
                  </div>
                  <span className="text-xs text-white/80">24:45</span>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col justify-center"
            >
              <p className="text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-[#7A8A6E] mb-3 sm:mb-4">
                Watch & Color
              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222222] leading-tight mb-4 sm:mb-5">
                Jesus Calms the Storm
              </h2>

              <p className="text-base sm:text-lg text-[#666666] leading-relaxed mb-6 sm:mb-8 max-w-md">
                Watch the story unfold while the illustration comes to life through color. Experience the miracle as you create.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7A8A6E]/20"
                >
                  Watch Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  className="text-[#666666] hover:text-[#222222] hover:bg-white/50 rounded-full px-6 py-5 sm:py-6 text-sm sm:text-base font-medium"
                >
                  View All Stories
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

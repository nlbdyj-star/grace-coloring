"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coloringPages } from "@/lib/data";

export function LatestColoringPages() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="coloring-pages" className="py-16 sm:py-24 lg:py-32 bg-[#F5F2EC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222222]">
            Latest Coloring Pages
          </h2>
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#666666] hover:text-[#7A8A6E] transition-colors group">
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Pinterest-style Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {coloringPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="break-inside-avoid"
              onMouseEnter={() => setHoveredId(page.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-500">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* Line Art (default) */}
                  <Image
                    src={page.lineArt}
                    alt={`${page.title} - line art`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      hoveredId === page.id ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  {/* Colored version (on hover) */}
                  <Image
                    src={page.colored}
                    alt={`${page.title} - colored`}
                    fill
                    className={`object-cover transition-opacity duration-500 absolute inset-0 ${
                      hoveredId === page.id ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />

                  {/* Hover Actions */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-[#222222]/40 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredId === page.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-white text-xs sm:text-sm font-medium truncate pr-2">
                        {page.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#222222] backdrop-blur-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(page.id);
                          }}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              favorites.has(page.id)
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#222222] backdrop-blur-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-medium text-[#222222] truncate">
                    {page.title}
                  </h3>
                  <p className="text-xs text-[#666666] mt-0.5">{page.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 sm:hidden text-center">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#666666] hover:text-[#7A8A6E] transition-colors">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

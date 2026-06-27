"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Image, Puzzle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StatItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count: number | null;
  loading: boolean;
}

export function FreeDownloads() {
  const [coloringCount, setColoringCount] = useState<number | null>(null);
  const [wallpaperCount, setWallpaperCount] = useState<number | null>(null);
  const [loadingColoring, setLoadingColoring] = useState(true);
  const [loadingWallpaper, setLoadingWallpaper] = useState(true);

  useEffect(() => {
    supabase
      .from("coloring_pages")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .then(({ count, error }) => {
        if (error) {
          console.error("FreeDownloads coloring_pages fetch error:", error.message);
        } else if (count !== null) {
          setColoringCount(count);
        }
        setLoadingColoring(false);
      });

    supabase
      .from("wallpapers")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .then(({ count, error }) => {
        if (error) {
          console.error("FreeDownloads wallpapers fetch error:", error.message);
        } else if (count !== null) {
          setWallpaperCount(count);
        }
        setLoadingWallpaper(false);
      });
  }, []);

  const items: StatItem[] = [
    {
      id: "pdf",
      title: "PDF Coloring Pages",
      description: loadingColoring
        ? "Loading..."
        : `${coloringCount ?? 0} printable coloring pages ready to download`,
      icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7" />,
      href: "/coloring-pages",
      count: coloringCount,
      loading: loadingColoring,
    },
    {
      id: "wallpapers",
      title: "4K Wallpapers",
      description: loadingWallpaper
        ? "Loading..."
        : `${wallpaperCount ?? 0} beautiful wallpapers for your devices`,
      icon: <Image className="w-6 h-6 sm:w-7 sm:h-7" />,
      href: "/wallpapers",
      count: wallpaperCount,
      loading: loadingWallpaper,
    },
    {
      id: "activities",
      title: "Printable Activities",
      description: "Fun activities for all ages",
      icon: <Puzzle className="w-6 h-6 sm:w-7 sm:h-7" />,
      href: "/coloring-pages",
      count: null,
      loading: false,
    },
  ];

  return (
    <section id="wallpapers" className="py-16 sm:py-24 lg:py-32 bg-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222222]">
            Free Downloads
          </h2>
        </motion.div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="group block w-full text-left p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#7A8A6E]/30 hover:shadow-lg hover:shadow-[#7A8A6E]/5 transition-all duration-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-[#7A8A6E] mb-4 sm:mb-5 group-hover:bg-[#7A8A6E] group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>

                    <h3 className="text-lg sm:text-xl font-medium text-[#222222] mb-1.5 sm:mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#666666]">
                      {item.loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        item.description
                      )}
                    </p>
                  </div>

                  <div className="ml-4 mt-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F5F2EC] flex items-center justify-center group-hover:bg-[#7A8A6E] transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-[#666666] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

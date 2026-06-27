"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Video, ImageIcon, BookOpen, FolderOpen, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/supabase";

const typeConfig: Record<string, { icon: React.ReactNode; href: string; bgColor: string; label: string }> = {
  coloring: {
    icon: <Palette className="w-8 h-8" />,
    href: "/coloring-pages",
    bgColor: "bg-[#E8EDE5]",
    label: "Coloring Pages",
  },
  wallpaper: {
    icon: <ImageIcon className="w-8 h-8" />,
    href: "/wallpapers",
    bgColor: "bg-[#EDE8E5]",
    label: "Wallpapers",
  },
  video: {
    icon: <Video className="w-8 h-8" />,
    href: "/videos",
    bgColor: "bg-[#E5E8ED]",
    label: "Videos",
  },
  story: {
    icon: <BookOpen className="w-8 h-8" />,
    href: "/bible-stories",
    bgColor: "bg-[#E5EDE8]",
    label: "Bible Stories",
  },
  all: {
    icon: <FolderOpen className="w-8 h-8" />,
    href: "/coloring-pages",
    bgColor: "bg-[#F5F2EC]",
    label: "All Content",
  },
};

interface CategoryWithCount extends Category {
  count: number;
}

export function FeaturedCollections() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: cats, error: catError } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true })
          .limit(6);

        if (catError) {
          console.error("FeaturedCollections fetch error:", catError.message);
          setError(catError.message);
          setLoading(false);
          return;
        }

        if (!cats || cats.length === 0) {
          setCategories([]);
          setLoading(false);
          return;
        }

        // 统计每个分类的内容数量
        const withCounts = await Promise.all(
          cats.map(async (cat) => {
            let count = 0;
            if (cat.type === "coloring" || cat.type === "all") {
              const { count: c } = await supabase
                .from("coloring_pages")
                .select("*", { count: "exact", head: true })
                .eq("status", "published");
              count += c || 0;
            }
            if (cat.type === "wallpaper" || cat.type === "all") {
              const { count: c } = await supabase
                .from("wallpapers")
                .select("*", { count: "exact", head: true })
                .eq("status", "published");
              count += c || 0;
            }
            if (cat.type === "video" || cat.type === "all") {
              const { count: c } = await supabase
                .from("videos")
                .select("*", { count: "exact", head: true })
                .eq("status", "published");
              count += c || 0;
            }
            if (cat.type === "story" || cat.type === "all") {
              const { count: c } = await supabase
                .from("bible_stories")
                .select("*", { count: "exact", head: true })
                .eq("status", "published");
              count += c || 0;
            }
            return { ...cat, count };
          })
        );

        setCategories(withCounts);
      } catch (err: any) {
        console.error("FeaturedCollections error:", err);
        setError(err?.message || "Failed to load collections");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#FAF8F4]">
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
            Featured Collections
          </h2>
          <Link
            href="/coloring-pages"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#666666] hover:text-[#7A8A6E] transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#7A8A6E]" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-lg text-red-500">Failed to load collections: {error}</p>
            <p className="text-sm text-[#888888] mt-2">Please check your database connection.</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 mx-auto text-[#A8B8A1] mb-4" />
            <p className="text-lg text-[#666666]">No collections available yet.</p>
            <p className="text-sm text-[#888888] mt-2">Add categories in the admin panel to see them here.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category, index) => {
              const config = typeConfig[category.type] || typeConfig.all;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={config.href} className="group block">
                    <div
                      className={`relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden ${config.bgColor} mb-4 sm:mb-5 flex items-center justify-center`}
                    >
                      <div className="text-[#7A8A6E] group-hover:scale-110 transition-transform duration-500">
                        {config.icon}
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#222222]/0 group-hover:bg-[#222222]/5 transition-colors duration-500" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-medium text-[#222222] group-hover:text-[#7A8A6E] transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-[#666666] mt-0.5">
                          {category.count} {category.count === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5F2EC] flex items-center justify-center group-hover:bg-[#7A8A6E] transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-[#666666] group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/coloring-pages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#666666] hover:text-[#7A8A6E] transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

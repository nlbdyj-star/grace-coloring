"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Download, Palette } from "lucide-react";
import type { ColoringPage } from "@/lib/supabase";

export default function ColoringPagesPage() {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("coloring_pages")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setPages(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen bg-[#FAF8F4] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-medium text-[#222222] mb-4">
              Coloring Pages
            </h1>
            <p className="text-[#666666] mb-10 max-w-2xl">
              Download and print beautiful Bible-themed coloring pages. Perfect
              for kids and adults to reflect on God&apos;s word while being creative.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#7A8A6E]" />
            </div>
          ) : pages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Palette className="w-12 h-12 mx-auto text-[#A8B8A1] mb-4" />
              <p className="text-lg text-[#666666]">
                No coloring pages available yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pages.map((page, index) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={page.line_art_image}
                      alt={page.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                    {page.pdf_file && (
                      <a
                        href={page.pdf_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#222222] backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label={`Download ${page.title}`}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#222222] truncate">
                      {page.title}
                    </h3>
                    <p className="text-sm text-[#666666] capitalize mt-0.5">
                      {page.difficulty}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

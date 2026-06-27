"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Download, ImageIcon } from "lucide-react";
import type { Wallpaper } from "@/lib/supabase";

export default function WallpapersPage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("wallpapers")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Wallpapers page fetch error:", error.message);
          setError(error.message);
        } else if (data) {
          setWallpapers(data);
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
              Wallpapers
            </h1>
            <p className="text-[#666666] mb-10 max-w-2xl">
              Beautiful Christian wallpapers for your phone, tablet, and
              desktop. Download and be reminded of God&apos;s love every day.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#7A8A6E]" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-red-500">Failed to load wallpapers: {error}</p>
              <p className="text-sm text-[#888888] mt-2">Please check your database connection and try again.</p>
            </div>
          ) : wallpapers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ImageIcon className="w-12 h-12 mx-auto text-[#A8B8A1] mb-4" />
              <p className="text-lg text-[#666666]">
                No wallpapers available yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallpapers.map((wallpaper, index) => (
                <motion.div
                  key={wallpaper.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {wallpaper.image_original ? (
                      <Image
                        src={wallpaper.image_original}
                        alt={wallpaper.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F5F2EC]">
                        <ImageIcon className="w-8 h-8 text-[#888888]" />
                      </div>
                    )}
                    <a
                      href={wallpaper.image_original}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#222222] backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label={`Download ${wallpaper.title}`}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-[#222222]">
                      {wallpaper.title}
                    </h3>
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

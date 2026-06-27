"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import type { Video } from "@/lib/supabase";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("videos")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setVideos(data);
        }
        setLoading(false);
      });
  }, []);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("youtube.com/watch?v=", "youtube.com/embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

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
              Videos
            </h1>
            <p className="text-[#666666] mb-10 max-w-2xl">
              Watch and color along with our Bible story videos. Perfect for
              family devotion time or Sunday school.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#7A8A6E]" />
            </div>
          ) : videos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Play className="w-12 h-12 mx-auto text-[#A8B8A1] mb-4" />
              <p className="text-lg text-[#666666]">
                No videos available yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500"
                >
                  <div className="aspect-video w-full bg-black">
                    {video.youtube_url ? (
                      <iframe
                        src={getEmbedUrl(video.youtube_url)}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <Play className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-medium text-[#222222] mb-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-[#666666] line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    {video.bible_verse && (
                      <p className="text-xs text-[#7A8A6E] mt-3 italic">
                        {video.bible_verse}
                      </p>
                    )}
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

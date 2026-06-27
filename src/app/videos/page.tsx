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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("videos")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Videos page fetch error:", error.message);
          setError(error.message);
        } else if (data) {
          setVideos(data);
        }
        setLoading(false);
      });
  }, []);

  // 将 YouTube URL 转换为 youtube-nocookie.com 嵌入 URL，避免 Referer 检查被拒绝
  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";

    // https://www.youtube.com/watch?v=xxxxx → https://www.youtube-nocookie.com/embed/xxxxx
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
    }

    // https://youtu.be/xxxxx → https://www.youtube-nocookie.com/embed/xxxxx
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
    }

    // 已经是 embed URL，替换为 youtube-nocookie.com
    if (url.includes("youtube.com/embed/")) {
      return url.replace("youtube.com/embed/", "www.youtube-nocookie.com/embed/");
    }

    // 已经是 youtube-nocookie.com/embed/，直接返回
    if (url.includes("youtube-nocookie.com/embed/")) {
      return url;
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
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-red-500">Failed to load videos: {error}</p>
              <p className="text-sm text-[#888888] mt-2">Please check your database connection and try again.</p>
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
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
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

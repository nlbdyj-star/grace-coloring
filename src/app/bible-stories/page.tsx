"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, BookOpen, Quote } from "lucide-react";
import type { BibleStory } from "@/lib/supabase";

export default function BibleStoriesPage() {
  const [stories, setStories] = useState<BibleStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("bible_stories")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setStories(data);
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
              Bible Stories
            </h1>
            <p className="text-[#666666] mb-10 max-w-2xl">
              Explore timeless Bible stories that inspire faith, hope, and love.
              Read, reflect, and grow closer to God.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#7A8A6E]" />
            </div>
          ) : stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="w-12 h-12 mx-auto text-[#A8B8A1] mb-4" />
              <p className="text-lg text-[#666666]">
                No Bible stories available yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story, index) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 border border-[#E8E4DC]/50"
                >
                  <h3 className="text-xl sm:text-2xl font-medium text-[#222222] mb-3">
                    {story.title}
                  </h3>

                  {(story.bible_verse || story.bible_reference) && (
                    <div className="flex items-start gap-2 mb-4 p-3 bg-[#F5F2EC] rounded-xl">
                      <Quote className="w-4 h-4 text-[#7A8A6E] mt-0.5 shrink-0" />
                      <div>
                        {story.bible_verse && (
                          <p className="text-sm text-[#222222] italic">
                            {story.bible_verse}
                          </p>
                        )}
                        {story.bible_reference && (
                          <p className="text-xs text-[#7A8A6E] mt-1 font-medium">
                            {story.bible_reference}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-[#666666]">
                    <p className="line-clamp-4">{story.content}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Eye, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { BibleStory } from "@/lib/supabase";

const mockStories: BibleStory[] = [
  {
    id: "1",
    title: "The Creation Story",
    slug: "the-creation-story",
    hero_image: "/images/stories/creation.jpg",
    content: "In the beginning, God created the heavens and the earth...",
    bible_verse: "In the beginning God created the heavens and the earth.",
    bible_reference: "Genesis 1:1",
    related_coloring_pages: ["1", "2"],
    related_videos: ["1"],
    category_id: "1",
    seo_title: "The Creation Story - Bible Story",
    seo_description: "Read the story of creation from Genesis.",
    seo_keywords: ["creation", "genesis", "bible story"],
    status: "published",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    published_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Noah's Ark",
    slug: "noahs-ark",
    hero_image: "/images/stories/noahs-ark.jpg",
    content: "God saw how corrupt the earth had become...",
    bible_verse: "But Noah found favor in the eyes of the Lord.",
    bible_reference: "Genesis 6:8",
    related_coloring_pages: ["3", "4"],
    related_videos: ["2"],
    category_id: "2",
    seo_title: "Noah's Ark - Bible Story",
    seo_description: "The story of Noah and the great flood.",
    seo_keywords: ["noah", "ark", "flood", "bible story"],
    status: "published",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
    published_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    title: "David and Goliath",
    slug: "david-and-goliath",
    hero_image: "/images/stories/david-goliath.jpg",
    content: "Now the Philistines gathered their forces for war...",
    bible_verse: "The Lord who rescued me from the paw of the lion...",
    bible_reference: "1 Samuel 17:37",
    related_coloring_pages: ["5"],
    related_videos: ["3"],
    category_id: "3",
    seo_title: "David and Goliath - Bible Story",
    seo_description: "The inspiring story of David defeating Goliath.",
    seo_keywords: ["david", "goliath", "courage", "bible story"],
    status: "published",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
    published_at: "2024-02-20T10:00:00Z",
  },
  {
    id: "4",
    title: "The Birth of Jesus",
    slug: "birth-of-jesus",
    hero_image: "/images/stories/birth-jesus.jpg",
    content: "In those days Caesar Augustus issued a decree...",
    bible_verse: "Today in the town of David a Savior has been born to you...",
    bible_reference: "Luke 2:11",
    related_coloring_pages: ["6", "7"],
    related_videos: ["4"],
    category_id: "1",
    seo_title: "The Birth of Jesus - Bible Story",
    seo_description: "The Christmas story of Jesus' birth in Bethlehem.",
    seo_keywords: ["jesus", "birth", "christmas", "bible story"],
    status: "draft",
    created_at: "2024-03-05T10:00:00Z",
    updated_at: "2024-03-05T10:00:00Z",
    published_at: null,
  },
  {
    id: "5",
    title: "The Good Samaritan",
    slug: "the-good-samaritan",
    hero_image: "/images/stories/good-samaritan.jpg",
    content: "A man was going down from Jerusalem to Jericho...",
    bible_verse: "Love your neighbor as yourself.",
    bible_reference: "Luke 10:27",
    related_coloring_pages: ["8"],
    related_videos: ["5"],
    category_id: "2",
    seo_title: "The Good Samaritan - Bible Story",
    seo_description: "Jesus teaches about loving your neighbor.",
    seo_keywords: ["samaritan", "love", "neighbor", "bible story"],
    status: "published",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
    published_at: "2024-03-10T10:00:00Z",
  },
];

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const columns: Column<BibleStory>[] = [
  {
    key: "hero_image",
    header: "Hero",
    width: "80px",
    render: (story) => (
      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[#F5F2EC]">
        {story.hero_image ? (
          <img
            src={story.hero_image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#888888]" />
          </div>
        )}
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (story) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{story.title}</p>
        <p className="text-xs text-[#888888]">{story.slug}</p>
      </div>
    ),
  },
  {
    key: "bible_verse",
    header: "Bible Verse",
    width: "240px",
    render: (story) => (
      <div>
        <p className="text-xs text-[#666666] italic line-clamp-1">"{story.bible_verse}"</p>
        <p className="text-xs text-[#7A8A6E] font-medium">{story.bible_reference}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "110px",
    render: (story) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusColors[story.status]
        }`}
      >
        {story.status}
      </span>
    ),
  },
  {
    key: "views",
    header: "Views",
    width: "100px",
    render: (story) => (
      <div className="flex items-center gap-1 text-sm text-[#666666]">
        <Eye className="w-3.5 h-3.5" />
        {(story.related_coloring_pages.length * 1200 + story.related_videos.length * 3400).toLocaleString()}
      </div>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    width: "130px",
    sortable: true,
    render: (story) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Calendar className="w-3 h-3" />
        {new Date(story.created_at).toLocaleDateString()}
      </div>
    ),
  },
];

export default function BibleStoriesPage() {
  const [stories] = useState<BibleStory[]>(mockStories);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-medium text-[#222222]">Bible Stories</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your Bible story collection</p>
        </div>
        <Link href="/admin/bible-stories/new">
          <Button className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2">
            <Plus className="w-4 h-4" />
            New Story
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stories.length },
          { label: "Published", value: stories.filter((s) => s.status === "published").length },
          { label: "Drafts", value: stories.filter((s) => s.status === "draft").length },
          { label: "Related Content", value: stories.reduce((sum, s) => sum + s.related_coloring_pages.length + s.related_videos.length, 0) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[#E8E4DC]/50 p-4"
          >
            <p className="text-lg font-semibold text-[#222222]">{stat.value}</p>
            <p className="text-xs text-[#888888]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={stories}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search stories..."
        filterOptions={[
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ]}
        onEdit={(story) => console.log("Edit", story.id)}
        onDelete={(story) => console.log("Delete", story.id)}
      />
    </div>
  );
}

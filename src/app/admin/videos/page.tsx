"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Eye, Calendar, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { ContentForm } from "@/components/admin/content-form";
import { Video } from "@/lib/supabase";

const mockVideos: Video[] = [
  {
    id: "1",
    title: "Jesus Calms the Storm",
    slug: "jesus-calms-the-storm",
    thumbnail: "/images/video/jesus-calms-storm.jpg",
    video_url: "https://youtube.com/watch?v=abc123",
    youtube_url: "https://youtube.com/watch?v=abc123",
    category_id: "1",
    tags: ["miracles", "jesus", "storm"],
    description: "Watch the miracle of Jesus calming the storm on the Sea of Galilee.",
    bible_verse: "He got up, rebuked the wind and said to the waves, 'Quiet! Be still!'",
    seo_title: "Jesus Calms the Storm - Bible Story Video",
    seo_description: "Watch the powerful story of Jesus calming the storm. A miracle that shows His divine power.",
    seo_keywords: ["jesus", "miracle", "storm", "bible story"],
    duration: "24:45",
    views: 15600,
    status: "published",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    published_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Good Shepherd",
    slug: "the-good-shepherd",
    thumbnail: "/images/collections/jesus.jpg",
    video_url: "https://youtube.com/watch?v=def456",
    youtube_url: "https://youtube.com/watch?v=def456",
    category_id: "1",
    tags: ["jesus", "parable", "shepherd"],
    description: "Jesus teaches about being the Good Shepherd.",
    bible_verse: "I am the good shepherd. The good shepherd lays down his life for the sheep.",
    seo_title: "The Good Shepherd - Jesus' Teaching",
    seo_description: "Discover the meaning of Jesus as the Good Shepherd in this beautiful video.",
    seo_keywords: ["good shepherd", "jesus", "john 10", "bible"],
    duration: "18:30",
    views: 12300,
    status: "published",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
    published_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    title: "Noah's Ark - The Full Story",
    slug: "noahs-ark-full-story",
    thumbnail: "/images/collections/noahs-ark.jpg",
    video_url: "https://youtube.com/watch?v=ghi789",
    youtube_url: "https://youtube.com/watch?v=ghi789",
    category_id: "2",
    tags: ["noah", "ark", "flood", "old testament"],
    description: "The complete story of Noah and the great flood.",
    bible_verse: "But Noah found favor in the eyes of the Lord.",
    seo_title: "Noah's Ark Complete Story",
    seo_description: "Watch the full story of Noah's Ark from Genesis. A story of faith and obedience.",
    seo_keywords: ["noah", "ark", "genesis", "flood"],
    duration: "32:15",
    views: 8900,
    status: "published",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
    published_at: "2024-02-20T10:00:00Z",
  },
  {
    id: "4",
    title: "Walking on Water",
    slug: "walking-on-water",
    thumbnail: "/images/coloring/walking-water-color.jpg",
    video_url: "https://youtube.com/watch?v=jkl012",
    youtube_url: "https://youtube.com/watch?v=jkl012",
    category_id: "1",
    tags: ["miracles", "jesus", "water", "faith"],
    description: "Peter walks on water with Jesus.",
    bible_verse: "'Come,' he said. Then Peter got down out of the boat, walked on the water and came toward Jesus.",
    seo_title: "Walking on Water - Peter's Faith",
    seo_description: "Experience the miracle of walking on water. A lesson in faith and trust.",
    seo_keywords: ["walking on water", "peter", "miracle", "faith"],
    duration: "15:20",
    views: 7200,
    status: "draft",
    created_at: "2024-03-05T10:00:00Z",
    updated_at: "2024-03-05T10:00:00Z",
    published_at: null,
  },
  {
    id: "5",
    title: "David and Goliath",
    slug: "david-and-goliath",
    thumbnail: "/images/hero/hero-main.jpg",
    video_url: "https://youtube.com/watch?v=mno345",
    youtube_url: "https://youtube.com/watch?v=mno345",
    category_id: "4",
    tags: ["david", "goliath", "courage", "faith"],
    description: "The story of young David defeating the giant Goliath.",
    bible_verse: "The Lord who rescued me from the paw of the lion and the paw of the bear will rescue me from the hand of this Philistine.",
    seo_title: "David and Goliath - Bible Story",
    seo_description: "Watch the inspiring story of David and Goliath. A testament to faith over fear.",
    seo_keywords: ["david", "goliath", "courage", "1 samuel"],
    duration: "28:00",
    views: 0,
    status: "draft",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
    published_at: null,
  },
];

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const videoFormFields = [
  { name: "title", label: "Title", type: "text" as const, required: true, placeholder: "Enter video title" },
  { name: "slug", label: "Slug", type: "text" as const, required: true, placeholder: "video-url-slug" },
  { name: "thumbnail", label: "Thumbnail", type: "image" as const, required: true },
  { name: "youtube_url", label: "YouTube URL", type: "url" as const, placeholder: "https://youtube.com/watch?v=..." },
  { name: "video_url", label: "Video URL", type: "url" as const, placeholder: "https://..." },
  { name: "category_id", label: "Category", type: "select" as const, options: [
    { label: "Jesus", value: "1" },
    { label: "Noah's Ark", value: "2" },
    { label: "Moses", value: "3" },
    { label: "David", value: "4" },
    { label: "Miracles", value: "5" },
  ]},
  { name: "tags", label: "Tags", type: "multiselect" as const, options: [
    { label: "Jesus", value: "jesus" },
    { label: "Miracles", value: "miracles" },
    { label: "Parables", value: "parables" },
    { label: "Old Testament", value: "old-testament" },
    { label: "New Testament", value: "new-testament" },
    { label: "Faith", value: "faith" },
    { label: "Courage", value: "courage" },
  ]},
  { name: "description", label: "Description", type: "textarea" as const, rows: 3, placeholder: "Enter video description..." },
  { name: "bible_verse", label: "Bible Verse", type: "textarea" as const, rows: 2, placeholder: "Enter related Bible verse..." },
  { name: "seo_title", label: "SEO Title", type: "text" as const, aiGenerate: true, placeholder: "SEO optimized title" },
  { name: "seo_description", label: "SEO Description", type: "textarea" as const, aiGenerate: true, rows: 2, placeholder: "Meta description for search engines..." },
  { name: "status", label: "Status", type: "select" as const, options: [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
  ]},
];

const columns: Column<Video>[] = [
  {
    key: "thumbnail",
    header: "Thumbnail",
    width: "80px",
    render: (video) => (
      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[#F5F2EC]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
          <Play className="w-4 h-4 text-white" fill="white" />
        </div>
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (video) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{video.title}</p>
        <p className="text-xs text-[#888888]">{video.slug}</p>
      </div>
    ),
  },
  {
    key: "duration",
    header: "Duration",
    width: "100px",
    render: (video) => (
      <span className="text-sm text-[#666666]">{video.duration}</span>
    ),
  },
  {
    key: "views",
    header: "Views",
    width: "100px",
    sortable: true,
    render: (video) => (
      <div className="flex items-center gap-1 text-sm text-[#666666]">
        <Eye className="w-3.5 h-3.5" />
        {video.views.toLocaleString()}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "110px",
    render: (video) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusColors[video.status]
        }`}
      >
        {video.status}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    width: "130px",
    sortable: true,
    render: (video) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Calendar className="w-3 h-3" />
        {new Date(video.created_at).toLocaleDateString()}
      </div>
    ),
  },
];

// Mock AI generation function
const mockAIGenerate = async (field: string, context: Record<string, unknown>): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const title = context.title as string || "Bible Story";
      if (field === "seo_title") {
        resolve(`${title} - Bible Story Video | Grace Coloring`);
      } else if (field === "seo_description") {
        resolve(`Watch ${title} come to life in this beautiful animated Bible story video. Perfect for children and families. Free to watch on Grace Coloring.`);
      } else {
        resolve("");
      }
    }, 800);
  });
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const handleAdd = () => {
    setEditingVideo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    if (editingVideo) {
      // Update existing
      setVideos((prev) =>
        prev.map((v) => (v.id === editingVideo.id ? { ...v, ...data } as Video : v))
      );
    } else {
      // Create new
      const newVideo: Video = {
        ...data,
        id: String(videos.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
      } as Video;
      setVideos((prev) => [newVideo, ...prev]);
    }
  };

  const handleAIGenerate = async (field: string) => {
    return mockAIGenerate(field, editingVideo || {});
  };

  const formInitialData = editingVideo ? {
    title: editingVideo.title,
    slug: editingVideo.slug,
    thumbnail: editingVideo.thumbnail,
    youtube_url: editingVideo.youtube_url,
    video_url: editingVideo.video_url,
    category_id: editingVideo.category_id,
    tags: editingVideo.tags,
    description: editingVideo.description,
    bible_verse: editingVideo.bible_verse,
    seo_title: editingVideo.seo_title,
    seo_description: editingVideo.seo_description,
    status: editingVideo.status,
  } : {};

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
          <h1 className="text-2xl font-medium text-[#222222]">Videos</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your video content</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: videos.length },
          { label: "Published", value: videos.filter((v) => v.status === "published").length },
          { label: "Drafts", value: videos.filter((v) => v.status === "draft").length },
          { label: "Total Views", value: videos.reduce((sum, v) => sum + v.views, 0).toLocaleString() },
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
        data={videos}
        columns={columns}
        keyExtractor={(v) => v.id}
        searchPlaceholder="Search videos..."
        filterOptions={[
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ]}
        onEdit={handleEdit}
        onDelete={(video) => console.log("Delete", video.id)}
      />

      {/* Form Modal */}
      <ContentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingVideo ? "Edit Video" : "Add New Video"}
        fields={videoFormFields}
        initialData={formInitialData}
        onSubmit={handleSubmit}
        onAIGenerate={handleAIGenerate}
      />
    </div>
  );
}

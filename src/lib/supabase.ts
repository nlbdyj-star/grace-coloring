import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "editor" | "user";
          membership: "free" | "premium";
          downloads_today: number;
          downloads_reset_at: string | null;
          created_at: string;
          last_login: string | null;
          is_banned: boolean;
        };
        Insert: Omit<Database["public"]["tables"]["users"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["tables"]["users"]["Insert"]>;
      };
      videos: {
        Row: {
          id: string;
          title: string;
          slug: string;
          thumbnail: string;
          video_url: string;
          youtube_url: string | null;
          category_id: string | null;
          tags: string[];
          description: string | null;
          bible_verse: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          duration: string | null;
          views: number;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: Omit<Database["public"]["tables"]["videos"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["tables"]["videos"]["Insert"]>;
      };
      coloring_pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category_id: string | null;
          bible_character: string | null;
          story: string | null;
          tags: string[];
          line_art_image: string;
          colored_preview_image: string;
          pdf_file: string | null;
          difficulty: "easy" | "medium" | "hard";
          downloads_count: number;
          views_count: number;
          favorites_count: number;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["coloring_pages"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["tables"]["coloring_pages"]["Insert"]>;
      };
      wallpapers: {
        Row: {
          id: string;
          title: string;
          category_id: string | null;
          image_original: string;
          image_mobile: string;
          image_desktop: string;
          image_4k: string | null;
          image_8k: string | null;
          tags: string[];
          downloads_count: number;
          views_count: number;
          favorites_count: number;
          seo_title: string | null;
          seo_description: string | null;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["wallpapers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["tables"]["wallpapers"]["Insert"]>;
      };
      bible_stories: {
        Row: {
          id: string;
          title: string;
          slug: string;
          hero_image: string | null;
          content: string;
          bible_verse: string | null;
          bible_reference: string | null;
          related_coloring_pages: string[];
          related_videos: string[];
          category_id: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: Omit<Database["public"]["tables"]["bible_stories"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["tables"]["bible_stories"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          type: "video" | "coloring" | "wallpaper" | "story" | "all";
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["tables"]["categories"]["Insert"]>;
      };
      downloads: {
        Row: {
          id: string;
          user_id: string | null;
          content_type: "coloring" | "wallpaper" | "video" | "pdf";
          content_id: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["downloads"]["Row"], "id" | "created_at">;
        Update: never;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          content_type: "coloring" | "wallpaper" | "video";
          content_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["favorites"]["Row"], "id" | "created_at">;
        Update: never;
      };
      newsletter: {
        Row: {
          id: string;
          email: string;
          subscribed: boolean;
          source: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["newsletter"]["Row"], "id" | "created_at">;
        Update: Partial<Pick<Database["public"]["tables"]["newsletter"]["Row"], "subscribed">>;
      };
      media_library: {
        Row: {
          id: string;
          filename: string;
          original_name: string;
          file_type: "image" | "pdf" | "video";
          mime_type: string;
          size_bytes: number;
          url: string;
          thumbnail_url: string | null;
          width: number | null;
          height: number | null;
          alt_text: string | null;
          tags: string[];
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["media_library"]["Row"], "id" | "created_at">;
        Update: Partial<Omit<Database["public"]["tables"]["media_library"]["Insert"], "url" | "size_bytes" | "mime_type">>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          group: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["tables"]["site_settings"]["Row"], "updated_at">;
        Update: Partial<Omit<Database["public"]["tables"]["site_settings"]["Insert"], "key">>;
      };
    };
  };
};

export type Tables = Database["public"]["tables"];
export type User = Tables["users"]["Row"];
export type Video = Tables["videos"]["Row"];
export type ColoringPage = Tables["coloring_pages"]["Row"];
export type Wallpaper = Tables["wallpapers"]["Row"];
export type BibleStory = Tables["bible_stories"]["Row"];
export type Category = Tables["categories"]["Row"];
export type Download = Tables["downloads"]["Row"];
export type Favorite = Tables["favorites"]["Row"];
export type Newsletter = Tables["newsletter"]["Row"];
export type MediaItem = Tables["media_library"]["Row"];
export type SiteSetting = Tables["site_settings"]["Row"];

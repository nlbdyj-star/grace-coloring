"use client";

import { useState, useRef, useCallback } from "react";
import { X, Loader2, Upload, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ======================== 类型定义 ======================== */

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  type: "video" | "coloring" | "wallpaper" | "bible-story" | "category";
  onSuccess: () => void;
}

/* ======================== 常量：各类型的标题 ======================== */

const typeTitles: Record<UploadModalProps["type"], string> = {
  video: "添加视频",
  coloring: "添加涂色页面",
  wallpaper: "添加壁纸",
  "bible-story": "添加圣经故事",
  category: "添加分类",
};

/* ======================== 主组件 ======================== */

export default function UploadModal({ open, onClose, type, onSuccess }: UploadModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- 通用字段 ----------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("published");

  // ---------- Video 字段 ----------
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [bibleVerse, setBibleVerse] = useState("");

  // ---------- Coloring Page 字段 ----------
  const [lineArtFile, setLineArtFile] = useState<File | null>(null);
  const [lineArtPreview, setLineArtPreview] = useState<string | null>(null);
  const [coloredPreviewFile, setColoredPreviewFile] = useState<File | null>(null);
  const [coloredPreviewPreview, setColoredPreviewPreview] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [story, setStory] = useState("");
  const [bibleCharacter, setBibleCharacter] = useState("");

  // ---------- Wallpaper 字段 ----------
  const [imageOriginalFile, setImageOriginalFile] = useState<File | null>(null);
  const [imageOriginalPreview, setImageOriginalPreview] = useState<string | null>(null);
  const [imageMobileFile, setImageMobileFile] = useState<File | null>(null);
  const [imageMobilePreview, setImageMobilePreview] = useState<string | null>(null);
  const [imageDesktopFile, setImageDesktopFile] = useState<File | null>(null);
  const [imageDesktopPreview, setImageDesktopPreview] = useState<string | null>(null);

  // ---------- Bible Story 字段 ----------
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [bibleReference, setBibleReference] = useState("");

  // ---------- Category 字段 ----------
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState("all");
  const [sortOrder, setSortOrder] = useState(0);

  // Ref 用于隐藏的 file input
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const lineArtInputRef = useRef<HTMLInputElement>(null);
  const coloredPreviewInputRef = useRef<HTMLInputElement>(null);
  const imageOriginalInputRef = useRef<HTMLInputElement>(null);
  const imageMobileInputRef = useRef<HTMLInputElement>(null);
  const imageDesktopInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  /* ======================== 文件上传辅助函数 ======================== */

  // 上传单个文件到 Supabase Storage，返回公开 URL
  const uploadFile = useCallback(async (file: File, fileType: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "文件上传失败");
    }

    return result.url;
  }, []);

  // 处理文件选择和预览
  const handleFileSelect = useCallback(
    (file: File | null, setFile: (f: File | null) => void, setPreview: (p: string | null) => void) => {
      if (file) {
        setFile(file);
        // 如果是图片，生成预览
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      }
    },
    []
  );

  // 重置所有字段
  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setTags("");
    setStatus("published");
    setYoutubeUrl("");
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setBibleVerse("");
    setLineArtFile(null);
    setLineArtPreview(null);
    setColoredPreviewFile(null);
    setColoredPreviewPreview(null);
    setDifficulty("easy");
    setStory("");
    setBibleCharacter("");
    setImageOriginalFile(null);
    setImageOriginalPreview(null);
    setImageMobileFile(null);
    setImageMobilePreview(null);
    setImageDesktopFile(null);
    setImageDesktopPreview(null);
    setHeroImageFile(null);
    setHeroImagePreview(null);
    setContent("");
    setBibleReference("");
    setName("");
    setCategoryType("all");
    setSortOrder(0);
    setError(null);
  }, []);

  /* ======================== 提交处理 ======================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      switch (type) {
        case "video": {
          if (!title.trim()) throw new Error("请输入视频标题");

          // 上传缩略图（如果有）
          let thumbnailUrl = "";
          if (thumbnailFile) {
            thumbnailUrl = await uploadFile(thumbnailFile, "video");
          }

          // 生成 slug（避免重复，添加时间戳后缀）
          const baseSlug = title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const slug = `${baseSlug}-${Date.now()}`;

          // 解析 tags
          const parsedTags = tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const { error: insertError } = await supabase.from("videos").insert({
            title: title.trim(),
            slug,
            thumbnail: thumbnailUrl || "",
            video_url: "",
            youtube_url: youtubeUrl.trim() || null,
            tags: parsedTags,
            description: description.trim() || null,
            bible_verse: bibleVerse.trim() || null,
            status: status as "draft" | "published",
          });

          if (insertError) throw new Error(insertError.message);
          break;
        }

        case "coloring": {
          if (!title.trim()) throw new Error("请输入涂色页面标题");
          if (!lineArtFile) throw new Error("请上传线条画图片");

          // 上传线条画图片（必须）
          const lineArtUrl = await uploadFile(lineArtFile, "coloring");

          // 上传彩色预览图（可选）
          let coloredPreviewUrl = "";
          if (coloredPreviewFile) {
            coloredPreviewUrl = await uploadFile(coloredPreviewFile, "coloring");
          }

          const baseSlug = title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const slug = `${baseSlug}-${Date.now()}`;

          const parsedTags = tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const { error: insertError } = await supabase.from("coloring_pages").insert({
            title: title.trim(),
            slug,
            line_art_image: lineArtUrl,
            colored_preview_image: coloredPreviewUrl || lineArtUrl,
            difficulty: difficulty as "easy" | "medium" | "hard",
            tags: parsedTags,
            status: status as "draft" | "published",
            story: story.trim() || null,
            bible_character: bibleCharacter.trim() || null,
          });

          if (insertError) throw new Error(insertError.message);
          break;
        }

        case "wallpaper": {
          if (!title.trim()) throw new Error("请输入壁纸标题");
          if (!imageOriginalFile) throw new Error("请上传原始图片");

          // 上传原始图片（必须）
          const originalUrl = await uploadFile(imageOriginalFile, "wallpaper");

          // 上传手机版图片（可选）
          let mobileUrl = "";
          if (imageMobileFile) {
            mobileUrl = await uploadFile(imageMobileFile, "wallpaper");
          }

          // 上传桌面版图片（可选）
          let desktopUrl = "";
          if (imageDesktopFile) {
            desktopUrl = await uploadFile(imageDesktopFile, "wallpaper");
          }

          const parsedTags = tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const { error: insertError } = await supabase.from("wallpapers").insert({
            title: title.trim(),
            image_original: originalUrl,
            image_mobile: mobileUrl || originalUrl,
            image_desktop: desktopUrl || originalUrl,
            tags: parsedTags,
            status: status as "draft" | "published",
          });

          if (insertError) throw new Error(insertError.message);
          break;
        }

        case "bible-story": {
          if (!title.trim()) throw new Error("请输入故事标题");
          if (!content.trim()) throw new Error("请输入故事内容");

          // 上传主图（可选）
          let heroImageUrl = "";
          if (heroImageFile) {
            heroImageUrl = await uploadFile(heroImageFile, "bible-story");
          }

          const baseSlug = title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const slug = `${baseSlug}-${Date.now()}`;

          const { error: insertError } = await supabase.from("bible_stories").insert({
            title: title.trim(),
            slug,
            hero_image: heroImageUrl || null,
            content: content.trim(),
            bible_verse: bibleVerse.trim() || null,
            bible_reference: bibleReference.trim() || null,
            status: status as "draft" | "published",
          });

          if (insertError) throw new Error(insertError.message);
          break;
        }

        case "category": {
          if (!name.trim()) throw new Error("请输入分类名称");

          const baseSlug = name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const slug = `${baseSlug}-${Date.now()}`;

          const { error: insertError } = await supabase.from("categories").insert({
            name: name.trim(),
            slug,
            type: categoryType as "video" | "coloring" | "wallpaper" | "story" | "all",
            description: description.trim() || null,
            sort_order: sortOrder,
          });

          if (insertError) throw new Error(insertError.message);
          break;
        }
      }

      // 成功后重置表单、关闭模态框、刷新列表
      resetForm();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================== 文件上传区域组件 ======================== */

  const FileUploadArea = ({
    label,
    file,
    preview,
    accept,
    required,
    inputRef,
    onFileChange,
  }: {
    label: string;
    file: File | null;
    preview: string | null;
    accept: string;
    required?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (file: File | null) => void;
  }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#222222]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-[#E8E4DC] rounded-lg p-4 cursor-pointer hover:border-[#7A8A6E]/40 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            onFileChange(selected);
          }}
        />
        {preview ? (
          <div className="space-y-2">
            <img
              src={preview}
              alt="预览"
              className="w-full h-32 object-contain rounded-lg bg-[#F5F2EC]"
            />
            <p className="text-xs text-[#888888] text-center truncate">
              {file?.name}
            </p>
          </div>
        ) : file ? (
          <div className="flex items-center justify-center gap-2 text-sm text-[#666666]">
            <Upload className="w-4 h-4" />
            <span className="truncate">{file.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-[#888888]">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">点击选择文件</p>
            <p className="text-xs mt-1">支持 JPG, PNG, WebP 格式</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ======================== 关闭处理 ======================== */

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  /* ======================== 渲染 ======================== */

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* 模态框卡片 */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
          <h2 className="text-lg font-medium text-[#222222]">{typeTitles[type]}</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#F5F2EC] transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5 text-[#666666]" />
          </button>
        </div>

        {/* 表单区域（可滚动） */}
        <form id="upload-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ======================== Video 表单 ======================== */}
          {type === "video" && (
            <>
              <InputField label="标题" value={title} onChange={setTitle} required />
              <TextAreaField label="描述" value={description} onChange={setDescription} />
              <InputField label="YouTube 链接" value={youtubeUrl} onChange={setYoutubeUrl} placeholder="https://www.youtube.com/embed/..." />
              <FileUploadArea
                label="缩略图"
                file={thumbnailFile}
                preview={thumbnailPreview}
                accept="image/*"
                inputRef={thumbnailInputRef}
                onFileChange={(f) => handleFileSelect(f, setThumbnailFile, setThumbnailPreview)}
              />
              <InputField label="标签" value={tags} onChange={setTags} placeholder="以逗号分隔，如: 创世记, 亚伯拉罕" />
              <InputField label="圣经经文" value={bibleVerse} onChange={setBibleVerse} placeholder="可选" />
              <SelectField
                label="状态"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "draft", label: "草稿" },
                  { value: "published", label: "已发布" },
                ]}
              />
            </>
          )}

          {/* ======================== Coloring Page 表单 ======================== */}
          {type === "coloring" && (
            <>
              <InputField label="标题" value={title} onChange={setTitle} required />
              <FileUploadArea
                label="线条画图片"
                file={lineArtFile}
                preview={lineArtPreview}
                accept="image/*"
                required
                inputRef={lineArtInputRef}
                onFileChange={(f) => handleFileSelect(f, setLineArtFile, setLineArtPreview)}
              />
              <FileUploadArea
                label="彩色预览图"
                file={coloredPreviewFile}
                preview={coloredPreviewPreview}
                accept="image/*"
                inputRef={coloredPreviewInputRef}
                onFileChange={(f) => handleFileSelect(f, setColoredPreviewFile, setColoredPreviewPreview)}
              />
              <SelectField
                label="难度"
                value={difficulty}
                onChange={setDifficulty}
                options={[
                  { value: "easy", label: "简单" },
                  { value: "medium", label: "中等" },
                  { value: "hard", label: "困难" },
                ]}
              />
              <InputField label="标签" value={tags} onChange={setTags} placeholder="以逗号分隔" />
              <TextAreaField label="故事" value={story} onChange={setStory} placeholder="可选，关于这幅画的圣经故事" />
              <InputField label="圣经人物" value={bibleCharacter} onChange={setBibleCharacter} placeholder="可选" />
              <SelectField
                label="状态"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "draft", label: "草稿" },
                  { value: "published", label: "已发布" },
                ]}
              />
            </>
          )}

          {/* ======================== Wallpaper 表单 ======================== */}
          {type === "wallpaper" && (
            <>
              <InputField label="标题" value={title} onChange={setTitle} required />
              <FileUploadArea
                label="原始图片"
                file={imageOriginalFile}
                preview={imageOriginalPreview}
                accept="image/*"
                required
                inputRef={imageOriginalInputRef}
                onFileChange={(f) => handleFileSelect(f, setImageOriginalFile, setImageOriginalPreview)}
              />
              <FileUploadArea
                label="手机版图片"
                file={imageMobileFile}
                preview={imageMobilePreview}
                accept="image/*"
                inputRef={imageMobileInputRef}
                onFileChange={(f) => handleFileSelect(f, setImageMobileFile, setImageMobilePreview)}
              />
              <FileUploadArea
                label="桌面版图片"
                file={imageDesktopFile}
                preview={imageDesktopPreview}
                accept="image/*"
                inputRef={imageDesktopInputRef}
                onFileChange={(f) => handleFileSelect(f, setImageDesktopFile, setImageDesktopPreview)}
              />
              <InputField label="标签" value={tags} onChange={setTags} placeholder="以逗号分隔" />
              <SelectField
                label="状态"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "draft", label: "草稿" },
                  { value: "published", label: "已发布" },
                ]}
              />
            </>
          )}

          {/* ======================== Bible Story 表单 ======================== */}
          {type === "bible-story" && (
            <>
              <InputField label="标题" value={title} onChange={setTitle} required />
              <FileUploadArea
                label="主图"
                file={heroImageFile}
                preview={heroImagePreview}
                accept="image/*"
                inputRef={heroImageInputRef}
                onFileChange={(f) => handleFileSelect(f, setHeroImageFile, setHeroImagePreview)}
              />
              <TextAreaField label="内容" value={content} onChange={setContent} required rows={5} placeholder="圣经故事的详细内容..." />
              <InputField label="圣经经文" value={bibleVerse} onChange={setBibleVerse} placeholder="可选，如: For God so loved the world..." />
              <InputField label="圣经出处" value={bibleReference} onChange={setBibleReference} placeholder="可选，如: John 3:16" />
              <SelectField
                label="状态"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "draft", label: "草稿" },
                  { value: "published", label: "已发布" },
                ]}
              />
            </>
          )}

          {/* ======================== Category 表单 ======================== */}
          {type === "category" && (
            <>
              <InputField label="名称" value={name} onChange={setName} required />
              <SelectField
                label="类型"
                value={categoryType}
                onChange={setCategoryType}
                options={[
                  { value: "all", label: "全部" },
                  { value: "video", label: "视频" },
                  { value: "coloring", label: "涂色" },
                  { value: "wallpaper", label: "壁纸" },
                  { value: "story", label: "故事" },
                ]}
              />
              <TextAreaField label="描述" value={description} onChange={setDescription} placeholder="可选" />
              <InputField label="排序" value={String(sortOrder)} onChange={(v) => setSortOrder(Number(v) || 0)} type="number" />
            </>
          )}
        </form>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E4DC]">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="h-10 px-5 text-sm font-medium text-[#666666] rounded-lg hover:bg-[#F5F2EC] transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="submit"
            form="upload-form"
            disabled={submitting}
            className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : (
              "保存"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================== 子组件：表单字段 ======================== */

function InputField({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#222222]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E] placeholder:text-[#AAAAAA]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#222222]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E] resize-none placeholder:text-[#AAAAAA]"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#222222]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

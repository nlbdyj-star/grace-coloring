"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { Category } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import UploadModal from "@/components/admin/upload-modal";
import EditModal from "@/components/admin/edit-modal";
import DeleteDialog from "@/components/admin/delete-dialog";

const typeColors: Record<string, string> = {
  all: "bg-[#7A8A6E]/10 text-[#7A8A6E] border-[#7A8A6E]/20",
  video: "bg-blue-50 text-blue-700 border-blue-200",
  coloring: "bg-purple-50 text-purple-700 border-purple-200",
  wallpaper: "bg-pink-50 text-pink-700 border-pink-200",
  story: "bg-amber-50 text-amber-700 border-amber-200",
};

const columns: Column<Category>[] = [
  {
    key: "name",
    header: "Name",
    render: (category) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{category.name}</p>
        <p className="text-xs text-[#888888]">{category.slug}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    width: "110px",
    render: (category) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
          typeColors[category.type]
        }`}
      >
        {category.type}
      </span>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (category) => (
      <p className="text-sm text-[#666666] line-clamp-1">{category.description}</p>
    ),
  },
  {
    key: "sort_order",
    header: "Sort Order",
    width: "100px",
    sortable: true,
    render: (category) => (
      <span className="text-sm text-[#666666]">{category.sort_order}</span>
    ),
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);

  // 提取 fetchCategories 到组件级别，便于 UploadModal 成功后刷新
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setCategories(data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
          <h1 className="text-2xl font-medium text-[#222222]">Categories</h1>
          <p className="text-sm text-[#666666] mt-1">Manage content categories</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2"
        >
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </motion.div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Data Loading Issue</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A8A6E] animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E4DC]/50 p-12 text-center">
          <Tag className="w-12 h-12 text-[#E8E4DC] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#222222]">No categories yet</h3>
          <p className="text-sm text-[#888888] mt-1">Categories will appear here when you add them.</p>
        </div>
      ) : (
        <DataTable
          data={categories}
          columns={columns}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Search categories..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Video", value: "video" },
            { label: "Coloring", value: "coloring" },
            { label: "Wallpaper", value: "wallpaper" },
            { label: "Story", value: "story" },
          ]}
          onEdit={(category) => setEditItem(category)}
          onDelete={(category) => setDeleteItem(category)}
        />
      )}
      <UploadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type="category"
        onSuccess={() => {
          setShowModal(false);
          fetchCategories();
        }}
      />
      {editItem && (
        <EditModal
          open={!!editItem}
          onClose={() => setEditItem(null)}
          type="category"
          initialData={editItem}
          onSuccess={() => {
            setEditItem(null);
            fetchCategories();
          }}
        />
      )}
      <DeleteDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Category"
        itemName={deleteItem?.name || ""}
        onConfirm={async () => {
          if (!deleteItem) return;
          const { error } = await supabase.from("categories").delete().eq("id", deleteItem.id);
          if (error) throw new Error(error.message);
          setDeleteItem(null);
          fetchCategories();
        }}
      />
    </div>
  );
}

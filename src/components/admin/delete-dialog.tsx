"use client";

import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  onConfirm: () => Promise<void>;
}

export default function DeleteDialog({ open, onClose, title, itemName, onConfirm }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err?.message || "删除失败，请重试");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* 对话框卡片 */}
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-medium text-[#222222]">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#F5F2EC] transition-colors"
            disabled={deleting}
          >
            <X className="w-5 h-5 text-[#666666]" />
          </button>
        </div>

        {/* 内容 */}
        <p className="text-sm text-[#666666] mb-6">
          Are you sure you want to delete &apos;<span className="font-medium text-[#222222]">{itemName}</span>&apos;?
          <br />
          <span className="text-red-600">This action cannot be undone.</span>
        </p>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* 按钮 */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={deleting}
            className="h-10 px-5 text-sm font-medium text-[#666666] rounded-lg hover:bg-[#F5F2EC] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-10 px-5 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

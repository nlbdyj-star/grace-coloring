"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Wand2, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "image" | "file" | "url";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  rows?: number;
  aiGenerate?: boolean;
}

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onAIGenerate?: (field: string) => Promise<string>;
}

export function ContentForm({
  isOpen,
  onClose,
  title,
  fields,
  initialData = {},
  onSubmit,
  onAIGenerate,
}: ContentFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAIGenerate = async (fieldName: string) => {
    if (!onAIGenerate) return;
    setAiLoading((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const result = await onAIGenerate(fieldName);
      handleChange(fieldName, result);
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setAiLoading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleChange(fieldName, files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#E8E4DC]/50 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-medium text-[#222222]">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#F5F2EC] text-[#666666] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {fields.map((field) => (
                <div key={field.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[#666666]">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-0.5">*</span>}
                    </label>
                    {field.aiGenerate && onAIGenerate && (
                      <button
                        type="button"
                        onClick={() => handleAIGenerate(field.name)}
                        disabled={aiLoading[field.name]}
                        className="inline-flex items-center gap-1 text-xs text-[#7A8A6E] hover:text-[#6A7A5E] transition-colors"
                      >
                        {aiLoading[field.name] ? (
                          <div className="w-3 h-3 border-2 border-[#7A8A6E]/30 border-t-[#7A8A6E] rounded-full animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        AI Generate
                      </button>
                    )}
                  </div>

                  {field.type === "text" && (
                    <input
                      type="text"
                      value={(formData[field.name] as string) || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      value={(formData[field.name] as string) || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E] resize-none"
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      value={(formData[field.name] as string) || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === "multiselect" && (
                    <div className="flex flex-wrap gap-2">
                      {field.options?.map((opt) => {
                        const selected = ((formData[field.name] as string[]) || []).includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              const current = (formData[field.name] as string[]) || [];
                              const updated = selected
                                ? current.filter((v) => v !== opt.value)
                                : [...current, opt.value];
                              handleChange(field.name, updated);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              selected
                                ? "bg-[#7A8A6E] text-white border-[#7A8A6E]"
                                : "bg-white text-[#666666] border-[#E8E4DC] hover:bg-[#F5F2EC]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "image" && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, field.name)}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragOver
                          ? "border-[#7A8A6E] bg-[#E8EDE5]/30"
                          : "border-[#E8E4DC] bg-[#FAF8F4]"
                      }`}
                    >
                      {formData[field.name] ? (
                        <div className="relative">
                          <img
                            src={
                              formData[field.name] instanceof File
                                ? URL.createObjectURL(formData[field.name] as File)
                                : (formData[field.name] as string)
                            }
                            alt="Preview"
                            className="max-h-40 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleChange(field.name, null)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                          <p className="text-sm text-[#666666]">
                            Drag & drop or{" "}
                            <span className="text-[#7A8A6E] font-medium">browse</span>
                          </p>
                          <p className="text-xs text-[#888888] mt-1">
                            Supports JPG, PNG, WebP
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {field.type === "url" && (
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                      <input
                        type="url"
                        value={(formData[field.name] as string) || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4DC]/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#E8E4DC] text-[#666666] hover:bg-[#F5F2EC] rounded-lg h-10 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

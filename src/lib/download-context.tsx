"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/** 触发下载时所需的完整信息 */
interface DownloadState {
  contentType: "coloring" | "wallpaper";
  contentId: string;
  contentTitle: string;
  downloadUrl: string;
  imagePreview?: string;
}

/** 下载上下文类型 */
interface DownloadContextType {
  triggerDownload: (state: DownloadState) => void;
  downloadState: DownloadState | null;
  closeDownload: () => void;
}

const DownloadContext = createContext<DownloadContextType | null>(null);

/** 全局下载状态 Provider，包裹在 layout 最外层 */
export function DownloadProvider({ children }: { children: ReactNode }) {
  const [downloadState, setDownloadState] = useState<DownloadState | null>(null);

  const triggerDownload = useCallback((state: DownloadState) => {
    setDownloadState(state);
  }, []);

  const closeDownload = useCallback(() => {
    setDownloadState(null);
  }, []);

  return (
    <DownloadContext.Provider value={{ triggerDownload, downloadState, closeDownload }}>
      {children}
    </DownloadContext.Provider>
  );
}

/** 在组件中使用下载功能的 Hook */
export function useDownload() {
  const context = useContext(DownloadContext);
  if (!context) throw new Error("useDownload must be used within DownloadProvider");
  return context;
}

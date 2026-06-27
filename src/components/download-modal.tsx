"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Download, Loader2, Eye, Crown, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDownload } from "@/lib/download-context";

// ========== 下载计数工具函数 ==========

/** 每日免费下载次数 */
const FREE_DOWNLOADS_PER_DAY = 3;

/** 获取当前下载信息 */
function getDownloadInfo(): {
  count: number;
  date: string;
  userId: string | null;
  isPremium: boolean;
} {
  if (typeof window === "undefined") {
    return { count: 0, date: "", userId: null, isPremium: false };
  }

  const userId = localStorage.getItem("user_id") || null;
  const isPremium = localStorage.getItem("user_membership") === "premium";
  const today = new Date().toISOString().split("T")[0];
  const savedDate = localStorage.getItem("downloads_date") || "";
  const savedCount = parseInt(localStorage.getItem("downloads_today") || "0", 10);

  if (savedDate !== today) {
    // 新的一天，重置计数
    localStorage.setItem("downloads_date", today);
    localStorage.setItem("downloads_today", "0");
    return { count: 0, date: today, userId, isPremium };
  }

  return { count: savedCount, date: savedDate, userId, isPremium };
}

/** 下载计数 +1 */
function incrementDownload() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("downloads_date", today);
  const current = parseInt(localStorage.getItem("downloads_today") || "0", 10);
  localStorage.setItem("downloads_today", String(current + 1));
}

/** 触发实际文件下载 */
function triggerFileDownload(url: string, title: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = title;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ========== 模态框状态枚举 ==========
type ModalState = "closed" | "auth" | "confirm" | "exhausted";

// ========== DownloadModal 组件 ==========

export function DownloadModal() {
  const { downloadState, closeDownload } = useDownload();

  // 模态框当前状态：auth=需要登录，confirm=确认下载，exhausted=次数用完
  const [modalState, setModalState] = useState<ModalState>("closed");
  // 注册/登录表单
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  // 广告倒计时
  const [adCountdown, setAdCountdown] = useState(3);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 每次下载状态变化时，判断应该进入哪个界面
  useEffect(() => {
    if (downloadState) {
      const info = getDownloadInfo();

      if (!info.userId) {
        // 未登录 → 显示注册/登录
        setModalState("auth");
      } else if (info.isPremium || info.count < FREE_DOWNLOADS_PER_DAY) {
        // 已登录且（Premium 或免费次数未用完）→ 确认下载
        setModalState("confirm");
      } else {
        // 免费次数已用完
        setModalState("exhausted");
      }
    } else {
      setModalState("closed");
    }

    // 重置表单状态
    setEmail("");
    setPassword("");
    setAuthError("");
    setAuthLoading(false);
    setAdCountdown(3);
    if (adTimerRef.current) {
      clearInterval(adTimerRef.current);
      adTimerRef.current = null;
    }
  }, [downloadState]);

  // 关闭模态框
  const handleClose = useCallback(() => {
    if (adTimerRef.current) {
      clearInterval(adTimerRef.current);
      adTimerRef.current = null;
    }
    closeDownload();
  }, [closeDownload]);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && downloadState) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [downloadState, handleClose]);

  // ===== 注册逻辑 =====
  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter your email and password.");
      return;
    }
    setAuthError("");
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        localStorage.setItem("user_id", userId);
        localStorage.setItem("user_membership", "free");
      }

      setAuthLoading(false);
      // 注册成功后进入确认下载状态
      setModalState("confirm");
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
      setAuthLoading(false);
    }
  };

  // ===== 登录逻辑 =====
  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter your email and password.");
      return;
    }
    setAuthError("");
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        localStorage.setItem("user_id", userId);
        // 检查是否是 Premium（这里简单判断，实际应从后端获取）
        const membership = localStorage.getItem("user_membership") || "free";
        localStorage.setItem("user_membership", membership);
      }

      setAuthLoading(false);
      // 登录成功后重新检查下载状态
      const info = getDownloadInfo();
      if (info.isPremium || info.count < FREE_DOWNLOADS_PER_DAY) {
        setModalState("confirm");
      } else {
        setModalState("exhausted");
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
      setAuthLoading(false);
    }
  };

  // ===== 确认下载 =====
  const handleConfirmDownload = async () => {
    if (!downloadState) return;

    const userId = localStorage.getItem("user_id");
    const info = getDownloadInfo();

    // 如果不是 Premium，先增加计数
    if (!info.isPremium) {
      incrementDownload();
    }

    // 记录下载到 Supabase
    try {
      if (userId) {
        await supabase.from("downloads").insert({
          user_id: userId,
          content_type: downloadState.contentType,
          content_id: downloadState.contentId,
        });
      }
    } catch (err) {
      console.error("记录下载失败:", err);
    }

    // 触发实际下载
    triggerFileDownload(
      downloadState.downloadUrl,
      downloadState.contentTitle
    );

    // 关闭模态框
    handleClose();
  };

  // ===== 观看广告继续下载 =====
  const handleWatchAd = () => {
    setAdCountdown(3);
    adTimerRef.current = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          if (adTimerRef.current) {
            clearInterval(adTimerRef.current);
            adTimerRef.current = null;
          }
          // 倒计时结束，直接下载
          handleConfirmDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ===== 清理定时器 =====
  useEffect(() => {
    return () => {
      if (adTimerRef.current) {
        clearInterval(adTimerRef.current);
      }
    };
  }, []);

  // 未打开时不渲染
  if (!downloadState) return null;

  // 剩余免费次数
  const remainingCount = FREE_DOWNLOADS_PER_DAY - getDownloadInfo().count;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* 模态框卡片 */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F2EC] hover:bg-[#E8E4DD] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#666666]" />
        </button>

        {/* ===== 状态 1：未登录 — 注册/登录 ===== */}
        {modalState === "auth" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-[#222222] mb-2">
              {isSignUp ? "Sign Up to Download" : "Sign In to Download"}
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              {isSignUp
                ? "Create a free account to download coloring pages and wallpapers."
                : "Welcome back! Sign in to continue downloading."}
            </p>

            {/* 预览图 */}
            {downloadState.imagePreview && (
              <div className="mb-6 rounded-xl overflow-hidden bg-[#F5F2EC] aspect-[3/4] max-w-[200px] mx-auto">
                <img
                  src={downloadState.imagePreview}
                  alt={downloadState.contentTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 错误信息 */}
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            {/* 邮箱输入 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#444444] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#D4CFC6] bg-[#FAF8F4] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/50 focus:border-[#7A8A6E] text-sm text-[#222222] placeholder:text-[#AAAAAA]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      isSignUp ? handleSignUp() : handleSignIn();
                    }
                  }}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#444444] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#D4CFC6] bg-[#FAF8F4] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/50 focus:border-[#7A8A6E] text-sm text-[#222222] placeholder:text-[#AAAAAA]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      isSignUp ? handleSignUp() : handleSignIn();
                    }
                  }}
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={isSignUp ? handleSignUp : handleSignIn}
              disabled={authLoading}
              className="w-full py-2.5 rounded-lg bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </button>

            {/* 切换登录/注册 */}
            <p className="text-center text-sm text-[#666666] mt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError("");
                }}
                className="text-[#7A8A6E] hover:text-[#5A6A4E] font-medium transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            {/* Google 登录按钮（灰置） */}
            <button
              disabled
              className="w-full mt-4 py-2.5 rounded-lg border border-[#D4CFC6] bg-[#F5F2EC] text-[#AAAAAA] font-medium text-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google (Coming Soon)
            </button>
          </div>
        )}

        {/* ===== 状态 2：确认下载 ===== */}
        {modalState === "confirm" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-[#222222] mb-2">
              Ready to Download
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              {downloadState.contentTitle}
            </p>

            {/* 预览图 */}
            {downloadState.imagePreview && (
              <div className="mb-6 rounded-xl overflow-hidden bg-[#F5F2EC] aspect-[3/4] max-w-[200px] mx-auto">
                <img
                  src={downloadState.imagePreview}
                  alt={downloadState.contentTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 下载按钮 */}
            <button
              onClick={handleConfirmDownload}
              className="w-full py-2.5 rounded-lg bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Now
            </button>

            {/* 剩余次数提示（非 Premium 用户） */}
            {getDownloadInfo().isPremium ? (
              <p className="text-center text-sm text-[#7A8A6E] mt-3 flex items-center justify-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Premium Member - Unlimited Downloads
              </p>
            ) : (
              <p className="text-center text-sm text-[#888888] mt-3">
                {remainingCount} free download{remainingCount !== 1 ? "s" : ""} remaining today
              </p>
            )}
          </div>
        )}

        {/* ===== 状态 3：免费次数已用完 ===== */}
        {modalState === "exhausted" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-[#222222] mb-2">
              Free Downloads Exhausted
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              You&apos;ve used all {FREE_DOWNLOADS_PER_DAY} free downloads for today.
              Come back tomorrow or choose an option below.
            </p>

            {/* 预览图 */}
            {downloadState.imagePreview && (
              <div className="mb-6 rounded-xl overflow-hidden bg-[#F5F2EC] aspect-[3/4] max-w-[200px] mx-auto">
                <img
                  src={downloadState.imagePreview}
                  alt={downloadState.contentTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 观看广告按钮 */}
            <button
              onClick={handleWatchAd}
              disabled={adCountdown < 3}
              className="w-full py-2.5 rounded-lg bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
            >
              {adCountdown < 3 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Watching ad... {adCountdown}s
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Watch Ad to Continue
                </>
              )}
            </button>

            {/* 升级 Premium */}
            <button
              disabled
              className="w-full py-2.5 rounded-lg border border-[#7A8A6E] text-[#7A8A6E] font-medium text-sm cursor-not-allowed flex items-center justify-center gap-2 opacity-60"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Premium (Coming Soon)
            </button>

            <p className="text-center text-xs text-[#AAAAAA] mt-4">
              Premium members enjoy unlimited downloads every day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

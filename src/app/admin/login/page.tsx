"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin";

function getStoredPassword(): string {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  return localStorage.getItem("admin_password") || DEFAULT_PASSWORD;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const expectedPassword = getStoredPassword();

    if (username === DEFAULT_USERNAME && password === expectedPassword) {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `admin_session=authenticated; path=/; expires=${expires}; SameSite=Lax`;
      localStorage.setItem("admin_logged_in", "true");
      router.push("/admin");
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4">
            <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
              <path
                d="M6 28V12L18 6L30 12V28L18 34L6 28Z"
                stroke="#7A8A6E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M18 6V34" stroke="#7A8A6E" strokeWidth="1.5" />
              <path d="M6 12L18 18L30 12" stroke="#7A8A6E" strokeWidth="1.5" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-[#222222]">Grace Admin</h1>
          <p className="text-sm text-[#888888] mt-1">Sign in to manage your content</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full h-11 px-4 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 px-4 pr-11 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#666666]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-xs text-[#888888] mt-6">
          Default login: admin / admin
        </p>
      </motion.div>
    </div>
  );
}

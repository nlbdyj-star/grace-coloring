"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "setup">("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Check if user has admin role
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile || (profile.role !== "admin" && profile.role !== "editor")) {
        // Not an admin - sign out
        await supabase.auth.signOut();
        setError("Access denied. You are not authorized to access the admin panel.");
        setIsLoading(false);
        return;
      }
    }

    router.push("/admin");
    router.refresh();
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Sign up the admin user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      // Create admin profile
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        full_name: "Admin",
        role: "admin",
        membership: "premium",
      });

      if (profileError) {
        setError("Account created but profile setup failed. Please contact support.");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
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
        {/* Logo */}
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
          <p className="text-sm text-[#888888] mt-1">
            {mode === "login"
              ? "Sign in to manage your content"
              : "Create your admin account"}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6 shadow-sm"
        >
          <form
            onSubmit={mode === "login" ? handleLogin : handleSetup}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gracecoloring.com"
                className="w-full h-11 px-4 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                required
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
                  placeholder={
                    mode === "login"
                      ? "Enter your password"
                      : "Min 8 characters"
                  }
                  minLength={mode === "setup" ? 8 : undefined}
                  className="w-full h-11 px-4 pr-11 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#666666]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
                  {mode === "login" ? "Sign In" : "Create Admin Account"}
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "setup" : "login");
                setError("");
              }}
              className="text-sm text-[#7A8A6E] hover:text-[#6A7A5E] transition-colors"
            >
              {mode === "login"
                ? "First time? Create admin account"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-[#888888] mt-6">
          Protected area. Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}

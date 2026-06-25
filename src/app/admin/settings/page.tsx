"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Globe, BarChart3, Mail, Upload, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [general, setGeneral] = useState({
    siteName: "Grace Coloring",
    siteDescription: "Bible-themed coloring pages, wallpapers, and stories for all ages.",
    logo: "",
    favicon: "",
  });

  const [analytics, setAnalytics] = useState({
    googleAnalytics: "G-XXXXXXXXXX",
    googleSearchConsole: "",
    facebookPixel: "",
  });

  const [email, setEmail] = useState({
    mailchimpApiKey: "",
    convertKitApiKey: "",
    brevoApiKey: "",
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    const storedPassword = localStorage.getItem("admin_password") || "admin";

    if (currentPassword !== storedPassword) {
      setPasswordError("Current password is incorrect");
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    localStorage.setItem("admin_password", newPassword);
    setPasswordMessage("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-[#222222]">Site Settings</h1>
        <p className="text-sm text-[#666666] mt-1">Configure your website settings and integrations</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#7A8A6E]" />
            <h2 className="text-base font-medium text-[#222222]">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Site Name</label>
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Site Description</label>
              <textarea
                value={general.siteDescription}
                onChange={(e) => setGeneral({ ...general, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Logo</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#F5F2EC] flex items-center justify-center">
                  {general.logo ? (
                    <img src={general.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#888888]" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E8E4DC] text-[#666666] hover:bg-[#F5F2EC] text-xs h-8"
                >
                  Upload Logo
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Favicon</label>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#F5F2EC] flex items-center justify-center">
                  {general.favicon ? (
                    <img src={general.favicon} alt="Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-3 h-3 text-[#888888]" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E8E4DC] text-[#666666] hover:bg-[#F5F2EC] text-xs h-8"
                >
                  Upload Favicon
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#7A8A6E]" />
            <h2 className="text-base font-medium text-[#222222]">Analytics</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Google Analytics ID</label>
              <input
                type="text"
                value={analytics.googleAnalytics}
                onChange={(e) => setAnalytics({ ...analytics, googleAnalytics: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Google Search Console</label>
              <input
                type="text"
                value={analytics.googleSearchConsole}
                onChange={(e) => setAnalytics({ ...analytics, googleSearchConsole: e.target.value })}
                placeholder="Verification code"
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Facebook Pixel ID</label>
              <input
                type="text"
                value={analytics.facebookPixel}
                onChange={(e) => setAnalytics({ ...analytics, facebookPixel: e.target.value })}
                placeholder="XXXXXXXXXX"
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
          </div>
        </motion.div>

        {/* Email Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-[#7A8A6E]" />
            <h2 className="text-base font-medium text-[#222222]">Email Integrations</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Mailchimp API Key</label>
              <input
                type="password"
                value={email.mailchimpApiKey}
                onChange={(e) => setEmail({ ...email, mailchimpApiKey: e.target.value })}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxx-us1"
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">ConvertKit API Key</label>
              <input
                type="password"
                value={email.convertKitApiKey}
                onChange={(e) => setEmail({ ...email, convertKitApiKey: e.target.value })}
                placeholder="Your ConvertKit API key"
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Brevo API Key</label>
              <input
                type="password"
                value={email.brevoApiKey}
                onChange={(e) => setEmail({ ...email, brevoApiKey: e.target.value })}
                placeholder="Your Brevo API key"
                className="w-full h-10 px-3 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
              />
            </div>
          </div>
        </motion.div>

        {/* Security / Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#7A8A6E]" />
            <h2 className="text-base font-medium text-[#222222]">Security</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#666666]"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#666666]"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#666666]"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="text-sm text-emerald-600">{passwordMessage}</p>
            )}

            <Button
              type="submit"
              variant="outline"
              className="w-full border-[#7A8A6E] text-[#7A8A6E] hover:bg-[#E8EDE5] rounded-lg h-10 text-sm font-medium"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-end"
      >
        <Button className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-6 text-sm font-medium gap-2">
          <Settings className="w-4 h-4" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}

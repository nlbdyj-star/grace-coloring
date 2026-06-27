"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Camera, MessageCircle } from "lucide-react";

const exploreLinks = [
  { label: "Coloring Pages", href: "/coloring-pages" },
  { label: "Wallpapers", href: "/wallpapers" },
  { label: "Videos", href: "/videos" },
  { label: "Bible Stories", href: "/bible-stories" },
];

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Mission", href: "/about" },
  { label: "Contact", href: "/about" },
];

const supportLinks = [
  { label: "FAQ", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
];

export function Footer() {
  return (
    <footer id="about" className="bg-[#FAF8F4] border-t border-[#E8E4DC]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 group mb-4 sm:mb-5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M6 28V12L18 6L30 12V28L18 34L6 28Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#7A8A6E]"
                  />
                  <path
                    d="M18 6V34"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-[#7A8A6E]"
                  />
                  <path
                    d="M6 12L18 18L30 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#7A8A6E]"
                  />
                  <path
                    d="M12 9C12 9 14 14 18 14C22 14 24 9 24 9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="text-[#A8B8A1]"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-medium tracking-tight text-[#222222]">
                Grace Coloring
              </span>
            </Link>

            <p className="text-sm sm:text-base text-[#666666] mb-5 sm:mb-6 max-w-xs">
              Color.
              <br />
              Reflect.
              <br />
              Pray.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#666666] hover:bg-[#7A8A6E] hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Play className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#666666] hover:bg-[#7A8A6E] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#666666] hover:bg-[#7A8A6E] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#222222] uppercase tracking-wider mb-3 sm:mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-[#666666] hover:text-[#7A8A6E] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#222222] uppercase tracking-wider mb-3 sm:mb-4">
              About
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-[#666666] hover:text-[#7A8A6E] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#222222] uppercase tracking-wider mb-3 sm:mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-[#666666] hover:text-[#7A8A6E] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#222222] uppercase tracking-wider mb-3 sm:mb-4">
              Stay Inspired
            </h4>
            <p className="text-sm text-[#666666] mb-3">
              Get updates on new content.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-sm font-medium text-[#7A8A6E] hover:text-[#6A7A5E] transition-colors"
            >
              Subscribe
              <svg
                className="ml-1.5 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[#E8E4DC]/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#888888]">
              &copy; {new Date().getFullYear()} Grace Coloring. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-xs sm:text-sm text-[#888888] hover:text-[#666666] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs sm:text-sm text-[#888888] hover:text-[#666666] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

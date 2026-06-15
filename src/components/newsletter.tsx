"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F2EC]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222222] mb-3 sm:mb-4">
            Stay Inspired
          </h2>

          <p className="text-base sm:text-lg text-[#666666] mb-8 sm:mb-10 max-w-md mx-auto">
            Get new coloring pages and Bible stories delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 sm:h-14 px-5 rounded-full bg-white border border-[#E8E4DC] text-[#222222] placeholder:text-[#888888] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20 focus:border-[#7A8A6E] transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitted}
              className={`h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                isSubmitted
                  ? "bg-[#7A8A6E] text-white"
                  : "bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white hover:shadow-lg hover:shadow-[#7A8A6E]/20"
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-[#888888] mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

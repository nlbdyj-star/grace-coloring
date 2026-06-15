"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { collections } from "@/lib/data";

export function FeaturedCollections() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222222]">
            Featured Collections
          </h2>
          <Link
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#666666] hover:text-[#7A8A6E] transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href="#" className="group block">
                <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F5F2EC] mb-4 sm:mb-5">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#222222]/0 group-hover:bg-[#222222]/5 transition-colors duration-500" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-[#222222] group-hover:text-[#7A8A6E] transition-colors duration-300">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-[#666666] mt-0.5">
                      {collection.pageCount} Pages
                    </p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5F2EC] flex items-center justify-center group-hover:bg-[#7A8A6E] transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-[#666666] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#666666] hover:text-[#7A8A6E] transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { CarCategory } from "../lib/types";
import { Search, SlidersHorizontal } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: CarCategory;
  onSelectCategory: (category: CarCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "latest" | "likes" | "price-asc" | "price-desc";
  onSortChange: (sort: "latest" | "likes" | "price-asc" | "price-desc") => void;
  categoryCounts: Record<string, number>;
}

const CATEGORIES: { label: CarCategory; name: string }[] = [
  { label: "All", name: "All Models" },
  { label: "Sports", name: "Sports" },
  { label: "Supercar" as any, name: "" }, // filtered out below
  { label: "Luxury", name: "Luxury" },
  { label: "SUV", name: "SUV" },
  { label: "Sedan", name: "Sedan" },
  { label: "Coupe", name: "Coupe" },
  { label: "Electric", name: "Electric" },
].filter((c) => c.name !== "");

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categoryCounts,
}) => {
  return (
    <div className="space-y-5">
      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A1A6AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by brand, model, city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#191D24] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-xs text-white placeholder-[#A1A6AF]/60 transition-colors"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#191D24] border border-[#262C36] text-xs text-[#A1A6AF]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="latest" className="bg-[#191D24] text-white">
                Recently Added
              </option>
              <option value="likes" className="bg-[#191D24] text-white">
                Most Liked
              </option>
              <option value="price-asc" className="bg-[#191D24] text-white">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-[#191D24] text-white">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          const count = categoryCounts[cat.label] || 0;

          return (
            <button
              key={cat.label}
              onClick={() => onSelectCategory(cat.label)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FF5212] text-white shadow-glow border border-[#FF6B35]"
                  : "bg-[#191D24] hover:bg-[#20252E] text-[#A1A6AF] hover:text-white border border-[#262C36]"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                  isSelected
                    ? "bg-black/30 text-white"
                    : "bg-[#0C0E12] text-[#A1A6AF]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


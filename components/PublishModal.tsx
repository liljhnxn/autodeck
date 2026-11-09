"use client";

import React, { useState } from "react";
import { parseEther } from "viem";
import { PublishFormData } from "../lib/types";
import { SAMPLE_CARS } from "../lib/sampleCars";
import {
  X,
  UploadCloud,
  Car,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    brand: string;
    model: string;
    year: number;
    description: string;
    priceWei: bigint;
    location: string;
    imageUrl: string;
    category: string;
  }) => Promise<void>;
  isPublishing: boolean;
  isConnected: boolean;
}

const CATEGORIES = [
  "Sports",
  "Luxury",
  "SUV",
  "Sedan",
  "Coupe",
  "Electric",
] as const;

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPublishing,
  isConnected,
}) => {
  const [formData, setFormData] = useState<PublishFormData>({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    description: "",
    price: "",
    location: "",
    imageUrl: "",
    category: "Sports",
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? (value === "" ? "" : Number(value)) : value,
    }));
    setFormError(null);
  };

  const handleApplyPreset = (preset: PublishFormData) => {
    setFormData(preset);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isConnected) {
      setFormError("Please connect your wallet first to publish a car.");
      return;
    }

    if (!formData.name.trim()) {
      setFormError("Car name is required.");
      return;
    }
    if (!formData.brand.trim()) {
      setFormError("Brand is required.");
      return;
    }
    if (!formData.model.trim()) {
      setFormError("Model is required.");
      return;
    }
    if (
      !formData.year ||
      formData.year < 1886 ||
      formData.year > new Date().getFullYear() + 2
    ) {
      setFormError(
        `Please enter a valid year between 1886 and ${
          new Date().getFullYear() + 2
        }.`
      );
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setFormError("Please enter a valid price in BHR (greater than 0).");
      return;
    }
    if (!formData.location.trim()) {
      setFormError("Location is required.");
      return;
    }
    if (!formData.imageUrl.trim() || !formData.imageUrl.startsWith("http")) {
      setFormError("Please provide a valid image URL starting with http:// or https://.");
      return;
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      setFormError("Description must be at least 10 characters long.");
      return;
    }

    try {
      const priceWei = parseEther(formData.price.toString());
      await onSubmit({
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        description: formData.description.trim(),
        priceWei,
        location: formData.location.trim(),
        imageUrl: formData.imageUrl.trim(),
        category: formData.category,
      });
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit listing. Check wallet.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => !isPublishing && onClose()}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#191D24] border border-[#262C36] shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#262C36] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Publish Car Listing</h2>
              <p className="text-xs text-[#A1A6AF]">
                Record your machine permanently on Botchain Testnet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isPublishing}
            className="p-2 rounded-xl text-[#A1A6AF] hover:text-white hover:bg-[#20252E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="px-6 pt-4 pb-2 bg-[#14171E] border-b border-[#262C36]/60">
          <div className="flex items-center gap-2 text-[11px] text-[#A1A6AF] mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>Fast Autofill Presets:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SAMPLE_CARS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.data)}
                disabled={isPublishing}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#191D24] hover:bg-[#20252E] border border-[#262C36] text-[11px] font-medium text-white hover:text-[#FF6B35] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Car Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Car Listing Title <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Porsche 911 GT3 RS (992)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Brand / Manufacturer <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Porsche, Ferrari"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Model <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 911 GT3 RS"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Manufacturing Year */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Year <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="number"
                name="year"
                min="1886"
                max="2030"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Category <span className="text-[#FF6B35]">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#191D24] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Asking Price */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Asking Price (BHR) <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 0.25"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Location <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Stuttgart, Germany"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Car Image URL <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors"
              />
            </div>

            {/* Live Image Preview if entered */}
            {formData.imageUrl && (
              <div className="sm:col-span-2 rounded-xl overflow-hidden border border-[#262C36] bg-[#14171E] relative aspect-[21/9]">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as any).style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white backdrop-blur">
                  Live Preview
                </div>
              </div>
            )}

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A6AF] uppercase tracking-wider mb-1.5">
                Description & Vehicle Specifications{" "}
                <span className="text-[#FF6B35]">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail engine specs, horsepower, transmission, condition, modifications, and history..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-[#262C36] focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder-[#A1A6AF]/50 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#262C36] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#A1A6AF] hover:text-white hover:bg-[#20252E] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPublishing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF5212] hover:from-[#ff7947] hover:to-[#FF6B35] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing on Botchain...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish Car Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


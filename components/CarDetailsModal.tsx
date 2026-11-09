"use client";

import React, { useState } from "react";
import { formatEther } from "viem";
import { CarItem } from "../lib/types";
import {
  X,
  Heart,
  MapPin,
  Calendar,
  Gauge,
  User,
  Clock,
  ExternalLink,
  Shield,
  Trash2,
  Loader2,
  Tag,
} from "lucide-react";

interface CarDetailsModalProps {
  car: CarItem | null;
  onClose: () => void;
  currentAddress?: string;
  onLikeToggle: (id: bigint, hasLiked: boolean) => void;
  onRemove: (id: bigint) => void;
  isActionLoading?: boolean;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  car,
  onClose,
  currentAddress,
  onLikeToggle,
  onRemove,
  isActionLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!car) return null;

  const isAuthor =
    currentAddress &&
    car.author.toLowerCase() === currentAddress.toLowerCase();

  const formattedPrice = Number(formatEther(car.price)).toLocaleString(
    undefined,
    { maximumFractionDigits: 6 }
  );

  const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";

  const publishedDate = new Date(Number(car.createdAt) * 1000).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#191D24] border border-[#262C36] shadow-2xl overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-[#A1A6AF] hover:text-white backdrop-blur-md border border-white/10 transition-colors"
          aria-label="Close vehicle modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#14171E]">
          <img
            src={imageError ? fallbackImage : car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D24] via-transparent to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#0C0E12]/80 backdrop-blur-md border border-[#262C36] text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              {car.category}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0C0E12]/80 backdrop-blur-md border border-[#262C36] text-xs font-bold text-white flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F5B942]" />
              {car.year}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#FF6B35]">
              {car.brand}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
              {car.name || `${car.brand} ${car.model}`}
            </h2>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#14171E] border border-[#262C36]">
              <div className="flex items-center gap-1.5 text-xs text-[#A1A6AF] font-medium">
                <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>Price</span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                {formattedPrice} <span className="text-xs text-[#F5B942] font-bold">BHR</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14171E] border border-[#262C36]">
              <div className="flex items-center gap-1.5 text-xs text-[#A1A6AF] font-medium">
                <Gauge className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Model</span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5 truncate">
                {car.model}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14171E] border border-[#262C36]">
              <div className="flex items-center gap-1.5 text-xs text-[#A1A6AF] font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Location</span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5 truncate">
                {car.location}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14171E] border border-[#262C36]">
              <div className="flex items-center gap-1.5 text-xs text-[#A1A6AF] font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Published</span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5 truncate">
                {publishedDate}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#A1A6AF] tracking-wider mb-2">
              Vehicle Overview & Specs
            </h4>
            <div className="p-4 rounded-2xl bg-[#14171E] border border-[#262C36] text-sm text-[#FFFFFF]/90 leading-relaxed whitespace-pre-wrap">
              {car.description}
            </div>
          </div>

          {/* On-Chain Identity / Author Details */}
          <div className="p-4 rounded-2xl bg-[#14171E] border border-[#262C36] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#262C36] flex items-center justify-center text-[#FF6B35]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Owner / Listing Author</p>
                <p className="font-mono text-[#A1A6AF] text-[11px] truncate max-w-[220px] sm:max-w-none">
                  {car.author}
                </p>
              </div>
            </div>

            <a
              href={`https://scan.bohr.life/address/${car.author}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#FF6B35] hover:text-[#F5B942] font-semibold"
            >
              Verify on Bohr Scan <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {/* Like Action */}
            <button
              onClick={() => onLikeToggle(car.id, !!car.hasLiked)}
              disabled={isActionLoading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                car.hasLiked
                  ? "bg-[#FF6B35] border-[#FF6B35] text-white shadow-glow"
                  : "bg-[#14171E] border-[#262C36] text-[#A1A6AF] hover:text-white hover:border-[#FF6B35]/40"
              }`}
            >
              {isActionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Heart
                  className={`w-4 h-4 ${
                    car.hasLiked ? "fill-white text-white" : "text-[#A1A6AF]"
                  }`}
                />
              )}
              <span>{car.hasLiked ? "Liked" : "Like Car"}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-black/30 text-xs">
                {car.likesCount.toString()}
              </span>
            </button>

            {/* Author Delete Action */}
            {isAuthor && (
              <button
                onClick={() => {
                  onRemove(car.id);
                  onClose();
                }}
                disabled={isActionLoading}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove My Listing</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


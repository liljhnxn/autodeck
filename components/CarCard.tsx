"use client";

import React, { useState } from "react";
import { formatEther } from "viem";
import { CarItem } from "../lib/types";
import {
  Heart,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  Loader2,
  ExternalLink,
  Shield,
} from "lucide-react";

interface CarCardProps {
  car: CarItem;
  currentAddress?: string;
  onViewDetails: (car: CarItem) => void;
  onLikeToggle: (id: bigint, hasLiked: boolean) => void;
  onRemove: (id: bigint) => void;
  isActionLoading?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  currentAddress,
  onViewDetails,
  onLikeToggle,
  onRemove,
  isActionLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const isAuthor =
    currentAddress &&
    car.author.toLowerCase() === currentAddress.toLowerCase();

  const formattedPrice = Number(formatEther(car.price)).toLocaleString(
    undefined,
    { maximumFractionDigits: 4 }
  );

  const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="group relative rounded-2xl bg-[#191D24] border border-[#262C36] hover:border-[#FF6B35]/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-card-hover">
      {/* Top Image Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#14171E] cursor-pointer" onClick={() => onViewDetails(car)}>
        <img
          src={imageError ? fallbackImage : car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191D24] via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0C0E12]/80 backdrop-blur-md border border-[#262C36] text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
          {car.category}
        </div>

        {/* Year Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0C0E12]/80 backdrop-blur-md border border-[#262C36] text-[10px] font-bold text-white tracking-wider flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#F5B942]" />
          <span>{car.year}</span>
        </div>

        {/* Author badge if own car */}
        {isAuthor && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-[#FF6B35]/20 backdrop-blur-md border border-[#FF6B35]/40 text-[9px] font-semibold text-[#FF6B35] flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" />
            <span>Your Listing</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand & Model */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35]">
              {car.brand}
            </span>
            <span className="text-xs text-[#A1A6AF] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A1A6AF]" />
              <span className="truncate max-w-[130px]">{car.location}</span>
            </span>
          </div>

          <h3
            onClick={() => onViewDetails(car)}
            className="text-lg font-bold text-white group-hover:text-[#FF6B35] transition-colors cursor-pointer truncate mt-0.5"
            title={`${car.brand} ${car.model}`}
          >
            {car.name || `${car.brand} ${car.model}`}
          </h3>

          <p className="text-xs text-[#A1A6AF] line-clamp-2 mt-2 leading-relaxed">
            {car.description}
          </p>
        </div>

        {/* Price & Actions Row */}
        <div className="pt-3 border-t border-[#262C36]/70 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#A1A6AF]">
              Asking Price
            </div>
            <div className="text-base font-extrabold text-white flex items-baseline gap-1">
              <span>{formattedPrice}</span>
              <span className="text-xs font-semibold text-[#F5B942]">BHR</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Like Button */}
            <button
              onClick={() => onLikeToggle(car.id, !!car.hasLiked)}
              disabled={isActionLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                car.hasLiked
                  ? "bg-[#FF6B35]/15 border-[#FF6B35] text-[#FF6B35] shadow-glow-sm"
                  : "bg-[#14171E] border-[#262C36] text-[#A1A6AF] hover:text-white hover:border-[#FF6B35]/40"
              }`}
              title={car.hasLiked ? "Unlike listing" : "Like listing"}
            >
              {isActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B35]" />
              ) : (
                <Heart
                  className={`w-3.5 h-3.5 ${
                    car.hasLiked
                      ? "fill-[#FF6B35] text-[#FF6B35]"
                      : "text-[#A1A6AF]"
                  }`}
                />
              )}
              <span>{car.likesCount.toString()}</span>
            </button>

            {/* Quick Details Trigger */}
            <button
              onClick={() => onViewDetails(car)}
              className="p-2 rounded-xl bg-[#14171E] hover:bg-[#20252E] border border-[#262C36] text-[#A1A6AF] hover:text-white transition-colors"
              title="View Complete Vehicle Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Remove button if author */}
            {isAuthor && (
              <button
                onClick={() => onRemove(car.id)}
                disabled={isActionLoading}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                title="Remove your listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


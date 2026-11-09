"use client";

import React from "react";
import { Car, Heart, Flame, ShieldCheck, Sparkles, ArrowDown } from "lucide-react";

interface HeroProps {
  totalCars: number;
  totalLikes: number;
  totalEverPublished: number;
  onExploreClick: () => void;
  onPublishClick: () => void;
  isLoadingStats?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  totalCars,
  totalLikes,
  totalEverPublished,
  onExploreClick,
  onPublishClick,
  isLoadingStats = false,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#262C36]/50">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#FF6B35]/15 via-[#F5B942]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191D24] border border-[#262C36] text-xs font-semibold text-[#A1A6AF]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span className="text-white">Discover Cars.</span>
              <span className="text-[#FF6B35]">Share Your Passion.</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
              Find Your <br />
              <span className="text-gradient-orange">Dream Car.</span>
            </h1>

            {/* Hero Description */}
            <p className="text-base sm:text-lg text-[#A1A6AF] max-w-xl leading-relaxed">
              Explore incredible cars shared by enthusiasts across the community.
              Showcase your machine, discover rare models, and curate community favorites permanently on-chain.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF5212] hover:from-[#ff7947] hover:to-[#FF6B35] text-white font-bold text-sm tracking-wide uppercase transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Explore Showroom</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onPublishClick}
                className="px-7 py-3.5 rounded-xl bg-[#191D24] hover:bg-[#20252E] text-white font-semibold text-sm border border-[#262C36] hover:border-[#FF6B35]/40 transition-all flex items-center gap-2 shadow-sm"
              >
                <Flame className="w-4 h-4 text-[#FF6B35]" />
                <span>Publish Listing</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#A1A6AF]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% On-Chain Proof</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
                <span>Botchain Testnet (968)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Automotive Visual Showcase & Stats */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#262C36] bg-[#14171E] shadow-2xl group">
              {/* Automotive Image Preview */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Porsche 911 GT3 RS"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14171E] via-[#14171E]/20 to-transparent"></div>

                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white tracking-wider uppercase">
                  Featured
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B35]">
                    Porsche
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    911 GT3 RS (992)
                  </h3>
                </div>
              </div>

              {/* Live Contract Counters */}
              <div className="p-5 grid grid-cols-3 gap-3 border-t border-[#262C36] bg-[#191D24]/90 backdrop-blur-sm">
                <div className="text-center p-2 rounded-xl bg-[#0C0E12]/60 border border-[#262C36]/60">
                  <div className="flex items-center justify-center gap-1 text-[#FF6B35] mb-1">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {isLoadingStats ? "..." : totalCars}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#A1A6AF] tracking-wider mt-0.5">
                    Active Cars
                  </div>
                </div>

                <div className="text-center p-2 rounded-xl bg-[#0C0E12]/60 border border-[#262C36]/60">
                  <div className="flex items-center justify-center gap-1 text-[#F5B942] mb-1">
                    <Heart className="w-4 h-4 fill-[#F5B942]/20" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {isLoadingStats ? "..." : totalLikes}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#A1A6AF] tracking-wider mt-0.5">
                    Total Likes
                  </div>
                </div>

                <div className="text-center p-2 rounded-xl bg-[#0C0E12]/60 border border-[#262C36]/60">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {isLoadingStats ? "..." : totalEverPublished}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#A1A6AF] tracking-wider mt-0.5">
                    Published
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


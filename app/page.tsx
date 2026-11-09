"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from "wagmi";
import {
  AUTODECK_ABI,
  AUTODECK_CONTRACT_ADDRESS,
  botchainTestnet,
} from "../contracts/contractConfig";
import { CarCategory, CarItem, ToastMessage } from "../lib/types";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { CategoryFilter } from "../components/CategoryFilter";
import { CarCard } from "../components/CarCard";
import { CarDetailsModal } from "../components/CarDetailsModal";
import { PublishModal } from "../components/PublishModal";
import { ToastContainer } from "../components/Toast";
import {
  Car,
  PlusCircle,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export default function AutoDeckPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<"explore" | "my-listings">("explore");
  const [selectedCategory, setSelectedCategory] = useState<CarCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "likes" | "price-asc" | "price-desc">("latest");

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedCarForModal, setSelectedCarForModal] = useState<CarItem | null>(null);

  // Local feedback / Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [actionCarId, setActionCarId] = useState<bigint | null>(null);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    if (toast.type !== "loading") {
      setTimeout(() => {
        removeToast(id);
      }, 6000);
    }
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  // --- CONTRACT READS ---
  // 1. Get all active listings directly from contract
  const {
    data: rawListings,
    isLoading: isLoadingListings,
    refetch: refetchListings,
    isRefetching: isRefetchingListings,
  } = useReadContract({
    address: AUTODECK_CONTRACT_ADDRESS,
    abi: AUTODECK_ABI,
    functionName: "getAllListings",
  });

  // 2. Get platform stats directly from contract
  const {
    data: platformStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useReadContract({
    address: AUTODECK_CONTRACT_ADDRESS,
    abi: AUTODECK_ABI,
    functionName: "getStats",
  });

  // Extract listing IDs to batch query whether current connected wallet has liked each car
  const listingIds = useMemo(() => {
    if (!rawListings || !Array.isArray(rawListings)) return [];
    return rawListings.map((car: any) => BigInt(car.id));
  }, [rawListings]);

  // 3. Batch check user likes
  const { data: userLikesBatch, refetch: refetchLikes } = useReadContract({
    address: AUTODECK_CONTRACT_ADDRESS,
    abi: AUTODECK_ABI,
    functionName: "hasUserLikedBatch",
    args: address && listingIds.length > 0 ? [listingIds, address] : undefined,
    query: {
      enabled: !!address && listingIds.length > 0,
    },
  });

  // Transform raw contract tuples into typed CarItem objects
  const allCars: CarItem[] = useMemo(() => {
    if (!rawListings || !Array.isArray(rawListings)) return [];

    return rawListings.map((car: any, idx: number) => {
      const hasLiked =
        userLikesBatch && Array.isArray(userLikesBatch) && userLikesBatch[idx] !== undefined
          ? Boolean(userLikesBatch[idx])
          : false;

      return {
        id: BigInt(car.id),
        author: car.author,
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: Number(car.year),
        description: car.description,
        price: BigInt(car.price),
        location: car.location,
        imageUrl: car.imageUrl,
        category: car.category,
        likesCount: BigInt(car.likesCount),
        createdAt: BigInt(car.createdAt),
        isActive: Boolean(car.isActive),
        hasLiked,
      };
    });
  }, [rawListings, userLikesBatch]);

  // Keep modal car up to date with fresh state if open
  useEffect(() => {
    if (selectedCarForModal) {
      const updated = allCars.find((c) => c.id === selectedCarForModal.id);
      if (updated) {
        setSelectedCarForModal(updated);
      }
    }
  }, [allCars, selectedCarForModal]);

  // User's own listings count
  const myCars = useMemo(() => {
    if (!address) return [];
    return allCars.filter(
      (c) => c.author.toLowerCase() === address.toLowerCase()
    );
  }, [allCars, address]);

  // Filtered and Sorted Cars
  const displayedCars = useMemo(() => {
    let list = activeTab === "my-listings" ? myCars : allCars;

    // Filter by Category
    if (selectedCategory !== "All") {
      list = list.filter(
        (c) => c.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "likes") {
        return Number(b.likesCount - a.likesCount);
      }
      if (sortBy === "price-asc") {
        return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
      }
      if (sortBy === "price-desc") {
        return a.price > b.price ? -1 : a.price < b.price ? 1 : 0;
      }
      // "latest"
      return Number(b.createdAt - a.createdAt);
    });
  }, [allCars, myCars, activeTab, selectedCategory, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const baseList = activeTab === "my-listings" ? myCars : allCars;
    const counts: Record<string, number> = { All: baseList.length };

    baseList.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    return counts;
  }, [allCars, myCars, activeTab]);

  // Contract stats counts
  const totalActiveCars = platformStats ? Number(platformStats[0]) : allCars.length;
  const totalLikesCount = platformStats ? Number(platformStats[1]) : 0;
  const totalEverPublished = platformStats ? Number(platformStats[2]) : allCars.length;

  // --- CONTRACT WRITES ---
  const { writeContractAsync } = useWriteContract();
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isSuccess: isTxSuccess, isLoading: isTxWaiting } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
  });

  // When transaction receipt confirms, refresh data
  useEffect(() => {
    if (isTxSuccess && pendingTxHash) {
      refetchListings();
      refetchStats();
      refetchLikes();
      setPendingTxHash(undefined);
      setIsSubmitting(false);
      setActionCarId(null);
    }
  }, [isTxSuccess, pendingTxHash, refetchListings, refetchStats, refetchLikes]);

  // 1. Publish Car Listing Action
  const handlePublishListing = async (data: {
    name: string;
    brand: string;
    model: string;
    year: number;
    description: string;
    priceWei: bigint;
    location: string;
    imageUrl: string;
    category: string;
  }) => {
    if (!isConnected) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your MetaMask wallet to publish on Botchain.",
      });
      return;
    }

    if (isWrongNetwork) {
      try {
        await switchChain({ chainId: botchainTestnet.id });
      } catch {
        addToast({
          type: "error",
          title: "Wrong Network",
          message: "Please switch your wallet to Botchain Testnet (Chain ID 968).",
        });
        return;
      }
    }

    setIsSubmitting(true);
    const toastId = addToast({
      type: "loading",
      title: "Publishing Car Listing",
      message: "Please confirm the transaction in your wallet...",
    });

    try {
      const hash = await writeContractAsync({
        address: AUTODECK_CONTRACT_ADDRESS,
        abi: AUTODECK_ABI,
        functionName: "publishListing",
        args: [
          data.name,
          data.brand,
          data.model,
          data.year,
          data.description,
          data.priceWei,
          data.location,
          data.imageUrl,
          data.category,
        ],
      });

      removeToast(toastId);
      setPendingTxHash(hash);
      addToast({
        type: "success",
        title: "Transaction Submitted",
        message: "Listing broadcasted to Botchain. Waiting for block confirmation...",
        txHash: hash,
      });
    } catch (err: any) {
      removeToast(toastId);
      setIsSubmitting(false);

      const errorMessage =
        err?.shortMessage ||
        err?.message ||
        "Transaction was rejected or failed. Please check gas and try again.";

      addToast({
        type: "error",
        title: "Publishing Failed",
        message: errorMessage,
      });
      throw err;
    }
  };

  // 2. Like / Unlike Action
  const handleLikeToggle = async (carId: bigint, hasLiked: boolean) => {
    if (!isConnected) {
      addToast({
        type: "info",
        title: "Connect Wallet",
        message: "Please connect your wallet to like cars on AutoDeck.",
      });
      return;
    }

    if (isWrongNetwork) {
      try {
        await switchChain({ chainId: botchainTestnet.id });
      } catch {
        addToast({
          type: "error",
          title: "Wrong Network",
          message: "Please switch to Botchain Testnet (Chain ID 968) to like cars.",
        });
        return;
      }
    }

    setActionCarId(carId);
    const actionName = hasLiked ? "unlikeCar" : "likeCar";
    const label = hasLiked ? "Removing like" : "Liking car";

    const toastId = addToast({
      type: "loading",
      title: `${label}...`,
      message: "Confirm the transaction in your wallet...",
    });

    try {
      const hash = await writeContractAsync({
        address: AUTODECK_CONTRACT_ADDRESS,
        abi: AUTODECK_ABI,
        functionName: actionName,
        args: [carId],
      });

      removeToast(toastId);
      setPendingTxHash(hash);
      addToast({
        type: "success",
        title: hasLiked ? "Unliked Car" : "Liked Car!",
        message: `On-chain reaction registered. Waiting for block confirmation...`,
        txHash: hash,
      });
    } catch (err: any) {
      removeToast(toastId);
      setActionCarId(null);
      const errorMessage =
        err?.shortMessage || err?.message || "Transaction was cancelled or failed.";
      addToast({
        type: "error",
        title: `${hasLiked ? "Unlike" : "Like"} Failed`,
        message: errorMessage,
      });
    }
  };

  // 3. Remove Listing Action
  const handleRemoveListing = async (carId: bigint) => {
    if (!confirm("Are you sure you want to remove this car listing from AutoDeck? This cannot be undone.")) {
      return;
    }

    if (isWrongNetwork) {
      try {
        await switchChain({ chainId: botchainTestnet.id });
      } catch {
        addToast({
          type: "error",
          title: "Wrong Network",
          message: "Please switch to Botchain Testnet to manage listings.",
        });
        return;
      }
    }

    setActionCarId(carId);
    const toastId = addToast({
      type: "loading",
      title: "Removing Listing...",
      message: "Confirm removal in your wallet...",
    });

    try {
      const hash = await writeContractAsync({
        address: AUTODECK_CONTRACT_ADDRESS,
        abi: AUTODECK_ABI,
        functionName: "removeListing",
        args: [carId],
      });

      removeToast(toastId);
      setPendingTxHash(hash);
      addToast({
        type: "success",
        title: "Removal Submitted",
        message: "Your listing removal is being verified on Botchain.",
        txHash: hash,
      });
    } catch (err: any) {
      removeToast(toastId);
      setActionCarId(null);
      const errorMessage =
        err?.shortMessage || err?.message || "Failed to remove listing.";
      addToast({
        type: "error",
        title: "Removal Failed",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0E12] text-white selection:bg-[#FF6B35]/30">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Network Warning Banner if connected to wrong chain */}
      {isWrongNetwork && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-3 shadow-lg z-50">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>
            You are connected to an unsupported network. Please switch to{" "}
            <strong>Botchain Testnet (Chain ID 968)</strong> to interact with AutoDeck.
          </span>
          <button
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            className="px-3 py-1 bg-black/40 hover:bg-black/60 rounded-lg text-white underline font-bold transition-colors"
          >
            Switch Now
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        onOpenPublish={() => setIsPublishModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userListingsCount={myCars.length}
      />

      {/* Hero Section */}
      <Hero
        totalCars={totalActiveCars}
        totalLikes={totalLikesCount}
        totalEverPublished={totalEverPublished}
        onExploreClick={() => {
          const exploreEl = document.getElementById("explore-section");
          exploreEl?.scrollIntoView({ behavior: "smooth" });
        }}
        onPublishClick={() => setIsPublishModalOpen(true)}
        isLoadingStats={isLoadingStats}
      />

      {/* Main Content Area: Showroom & Listings */}
      <main id="explore-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Section Heading & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262C36]/50 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeTab === "explore" ? "Explore Showroom" : "My Personal Garage"}
              </h2>
              {activeTab === "my-listings" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/40">
                  {myCars.length} Cars
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#A1A6AF] mt-1">
              {activeTab === "explore"
                ? "Browse authentic vehicles published directly to the blockchain by car enthusiasts."
                : "Manage and track vehicles published from your connected wallet."}
            </p>
          </div>

          {/* Quick Refresh Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                refetchListings();
                refetchStats();
                refetchLikes();
              }}
              disabled={isRefetchingListings}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#191D24] hover:bg-[#20252E] border border-[#262C36] text-xs font-semibold text-[#A1A6AF] hover:text-white transition-all shadow-sm"
              title="Refresh contract data"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefetchingListings ? "animate-spin text-[#FF6B35]" : ""
                }`}
              />
              <span>{isRefetchingListings ? "Syncing..." : "Sync Chain"}</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryCounts={categoryCounts}
        />

        {/* Car Cards Grid */}
        {isLoadingListings ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-[#FF6B35] animate-spin mb-4" />
            <p className="text-base font-bold text-white">Loading On-Chain Vehicles...</p>
            <p className="text-xs text-[#A1A6AF] mt-1">
              Querying Bohr RPC (https://rpc.bohr.life)
            </p>
          </div>
        ) : displayedCars.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-[#14171E] border border-[#262C36] p-12 text-center max-w-xl mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-[#191D24] border border-[#262C36] mx-auto flex items-center justify-center text-[#FF6B35] shadow-glow-sm">
              <Car className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {activeTab === "my-listings"
                  ? "You haven't published any cars yet"
                  : "No cars match your criteria"}
              </h3>
              <p className="text-xs text-[#A1A6AF] max-w-sm mx-auto leading-relaxed">
                {activeTab === "my-listings"
                  ? "Share your first vehicle with the community and have it recorded permanently on Botchain Testnet."
                  : searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search keywords or selecting a different category filter above."
                  : "Be the very first enthusiast to showcase a supercar on the AutoDeck showroom!"}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              {searchQuery || selectedCategory !== "All" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#191D24] hover:bg-[#20252E] text-xs font-semibold text-white border border-[#262C36] transition-colors"
                >
                  Clear Filters
                </button>
              ) : null}

              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF5212] hover:from-[#ff7947] hover:to-[#FF6B35] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-glow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Car Now</span>
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.map((car) => (
              <CarCard
                key={car.id.toString()}
                car={car}
                currentAddress={address}
                onViewDetails={(c) => setSelectedCarForModal(c)}
                onLikeToggle={(id, liked) => handleLikeToggle(id, liked)}
                onRemove={(id) => handleRemoveListing(id)}
                isActionLoading={actionCarId === car.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Publish Car Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSubmit={handlePublishListing}
        isPublishing={isSubmitting || isTxWaiting}
        isConnected={isConnected}
      />

      {/* Car Details Modal */}
      <CarDetailsModal
        car={selectedCarForModal}
        onClose={() => setSelectedCarForModal(null)}
        currentAddress={address}
        onLikeToggle={(id, liked) => handleLikeToggle(id, liked)}
        onRemove={(id) => handleRemoveListing(id)}
        isActionLoading={actionCarId === selectedCarForModal?.id}
      />

      {/* Single Page Footer */}
      <footer className="mt-auto border-t border-[#262C36]/50 bg-[#0C0E12] py-8 text-xs text-[#A1A6AF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wider">AUTODECK</span>
              <span className="mx-2 text-[#262C36]">•</span>
              <span>Discover Cars. Share Your Passion.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Botchain Testnet (968)</span>
            </span>
            <a
              href={`https://scan.bohr.life/address/${AUTODECK_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#FF6B35] hover:text-[#F5B942] underline flex items-center gap-1"
            >
              Contract on Bohr Scan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


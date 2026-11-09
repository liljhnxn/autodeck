"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { botchainTestnet } from "../contracts/contractConfig";
import {
  Car,
  PlusCircle,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Copy,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onOpenPublish: () => void;
  activeTab: "explore" | "my-listings";
  setActiveTab: (tab: "explore" | "my-listings") => void;
  userListingsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPublish,
  activeTab,
  setActiveTab,
  userListingsCount = 0,
}) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.id === "metaMask" || c.id === "injected") ||
      connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab("explore")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#F5B942] p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0C0E12] rounded-[10px] flex items-center justify-center">
                <Car className="w-6 h-6 text-[#FF6B35] group-hover:text-[#F5B942] transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider text-white">
                  AUTO<span className="text-[#FF6B35]">DECK</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30">
                  WEB3
                </span>
              </div>
              <p className="text-[11px] text-[#A1A6AF] tracking-tight hidden sm:block font-medium">
                Discover Cars. Share Your Passion.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#14171E] p-1 rounded-xl border border-[#262C36]/80">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "explore"
                  ? "bg-[#191D24] text-white shadow-sm border border-[#262C36]"
                  : "text-[#A1A6AF] hover:text-white"
              }`}
            >
              Explore Showroom
            </button>
            <button
              onClick={() => setActiveTab("my-listings")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                activeTab === "my-listings"
                  ? "bg-[#191D24] text-white shadow-sm border border-[#262C36]"
                  : "text-[#A1A6AF] hover:text-white"
              }`}
            >
              My Garage
              {userListingsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF6B35] text-white font-bold">
                  {userListingsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Actions & Wallet Connection */}
        <div className="flex items-center gap-3">
          {/* Network Indicator / Switcher */}
          {isConnected && (
            <div>
              {isWrongNetwork ? (
                <button
                  onClick={() => switchChain({ chainId: botchainTestnet.id })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-colors animate-pulse"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Switch to Botchain</span>
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14171E] border border-[#262C36] text-xs text-[#A1A6AF]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-white font-medium">Botchain Testnet</span>
                  <span className="text-[10px] text-[#A1A6AF]/70 font-mono">968</span>
                </div>
              )}
            </div>
          )}

          {/* Publish Car CTA */}
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF5212] hover:from-[#ff7947] hover:to-[#FF6B35] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Publish Car</span>
            <span className="sm:hidden">Publish</span>
          </button>

          {/* Wallet Connection */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#191D24] hover:bg-[#20252E] text-white font-semibold text-xs border border-[#262C36] hover:border-[#FF6B35]/40 transition-all shadow-sm"
            >
              <Wallet className="w-4 h-4 text-[#FF6B35]" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#191D24] hover:bg-[#20252E] border border-[#262C36] text-white text-xs font-mono transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <span>
                  {address
                    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                    : "Connected"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A1A6AF]" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#191D24] border border-[#262C36] p-3 shadow-2xl z-50 flex flex-col gap-2">
                    <div className="px-2 py-1 border-b border-[#262C36]/80 pb-2">
                      <p className="text-[10px] uppercase font-bold text-[#A1A6AF] tracking-wider">
                        Connected Wallet
                      </p>
                      <p className="text-xs font-mono text-white truncate mt-1">
                        {address}
                      </p>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-[#A1A6AF] hover:text-white hover:bg-[#20252E] transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://scan.bohr.life/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-[#A1A6AF] hover:text-white hover:bg-[#20252E] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
                      <span>View on Bohr Scan</span>
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-1 border-t border-[#262C36]/80 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


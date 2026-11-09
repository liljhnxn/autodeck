import { defineChain } from "viem";

export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Bohr",
    symbol: "BHR",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "Bohr Scan",
      url: "https://scan.bohr.life",
    },
  },
  testnet: true,
});

export const AUTODECK_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xE57F4840d5Aa065eef51B0d3F62925E6428B820C"
) as `0x${string}`;

export const AUTODECK_ABI = [
  {
    type: "function",
    name: "activeListingsCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalLikes",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalListingsCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getStats",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "totalCars", type: "uint256" },
      { name: "totalLikesCount", type: "uint256" },
      { name: "totalEverPublished", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getAllListings",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "author", type: "address" },
          { name: "name", type: "string" },
          { name: "brand", type: "string" },
          { name: "model", type: "string" },
          { name: "year", type: "uint16" },
          { name: "description", type: "string" },
          { name: "price", type: "uint256" },
          { name: "location", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "category", type: "string" },
          { name: "likesCount", type: "uint256" },
          { name: "createdAt", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getListingsByAuthor",
    stateMutability: "view",
    inputs: [{ name: "author", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "author", type: "address" },
          { name: "name", type: "string" },
          { name: "brand", type: "string" },
          { name: "model", type: "string" },
          { name: "year", type: "uint16" },
          { name: "description", type: "string" },
          { name: "price", type: "uint256" },
          { name: "location", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "category", type: "string" },
          { name: "likesCount", type: "uint256" },
          { name: "createdAt", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getListing",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "author", type: "address" },
          { name: "name", type: "string" },
          { name: "brand", type: "string" },
          { name: "model", type: "string" },
          { name: "year", type: "uint16" },
          { name: "description", type: "string" },
          { name: "price", type: "uint256" },
          { name: "location", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "category", type: "string" },
          { name: "likesCount", type: "uint256" },
          { name: "createdAt", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "hasUserLiked",
    stateMutability: "view",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasUserLikedBatch",
    stateMutability: "view",
    inputs: [
      { name: "ids", type: "uint256[]" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "bool[]" }],
  },
  {
    type: "function",
    name: "publishListing",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "brand", type: "string" },
      { name: "model", type: "string" },
      { name: "year", type: "uint16" },
      { name: "description", type: "string" },
      { name: "price", type: "uint256" },
      { name: "location", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "category", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "likeCar",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "unlikeCar",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "removeListing",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "event",
    name: "CarPublished",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "author", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "brand", type: "string", indexed: false },
      { name: "category", type: "string", indexed: false },
      { name: "price", type: "uint256", indexed: false },
      { name: "createdAt", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CarLiked",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "newLikesCount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CarUnliked",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "newLikesCount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CarRemoved",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "author", type: "address", indexed: true },
      { name: "removedAt", type: "uint256", indexed: false },
    ],
  },
] as const;

export type CarListing = {
  id: bigint;
  author: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  price: bigint;
  location: string;
  imageUrl: string;
  category: string;
  likesCount: bigint;
  createdAt: bigint;
  isActive: boolean;
};


export type CarCategory =
  | "All"
  | "SUV"
  | "Sedan"
  | "Coupe"
  | "Sports"
  | "Luxury"
  | "Electric";

export interface CarItem {
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
  hasLiked?: boolean;
}

export interface PublishFormData {
  name: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  price: string;
  location: string;
  imageUrl: string;
  category: "SUV" | "Sedan" | "Coupe" | "Sports" | "Luxury" | "Electric";
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "loading";
  title: string;
  message?: string;
  txHash?: string;
}


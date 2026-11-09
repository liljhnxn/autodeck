import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AutoDeck | Discover Cars. Share Your Passion.",
  description:
    "A decentralized car-discovery platform where users showcase cars, explore different models, and discover vehicles shared by car enthusiasts on Botchain Testnet.",
  keywords: ["AutoDeck", "Web3 Cars", "Bohr", "Botchain", "Supercars", "Car Discovery"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0C0E12] text-white antialiased selection:bg-[#FF6B35]/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


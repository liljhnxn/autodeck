# AutoDeck 🏎️
> **"Discover Cars. Share Your Passion."**

AutoDeck is a decentralized car-discovery Web3 platform where automotive enthusiasts showcase luxury, sports, and rare vehicles, explore different models, and curate the finest machines on-chain.

Built as a single-page dApp powered by **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **wagmi**, and **viem**, interacting directly with the `AutoDeck.sol` smart contract on **Botchain Testnet**.

---

## 🌟 Key Features

### 1. 100% On-Chain Vehicle Showcase
- **Real Blockchain Data**: All car listings, authors, timestamps, and community likes are stored directly in `AutoDeck.sol`. No backend or database is used.
- **Rich Vehicle Metadata**: Store car name, brand, model, manufacturing year, detailed description, asking price, location, high-res photography URL, and vehicle category.
- **Categorization**: Filter seamlessly by **Sports**, **Luxury**, **SUV**, **Sedan**, **Coupe**, and **Electric**.

### 2. On-Chain Engagement & Curation
- **Decentralized Likes**: Connect MetaMask to like or unlike vehicles.
- **Duplicate Prevention**: Contract-enforced protection prevents duplicate likes from the same wallet address.
- **Real-Time Counters**: Displays live on-chain stats for Active Cars, Total Likes, and Lifetime Published Cars.

### 3. Personal Garage & Authorship
- **My Garage Filter**: View and manage all listings published by your connected wallet.
- **Author-Only Removal**: Only the original creator of a vehicle listing has permission to remove it from the platform.
- **Direct Explorer Links**: Inspect listing creators and transactions directly on Bohr Scan.

### 4. Luxury Automotive Aesthetic
- Deep black and charcoal showroom design (`#0C0E12`, `#191D24`).
- Glowing automotive orange accents (`#FF6B35`) and golden highlights (`#F5B942`).
- Responsive cards with image fallbacks, hover micro-interactions, and detailed vehicle modals.

---

## 🌐 Network Configuration (Botchain Testnet)

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Currency Symbol** | `BHR` |

The dApp automatically checks whether MetaMask is connected to Chain ID `968` and offers a one-click network switch if connected to any other chain.

---

## 🏗️ Architecture

```
AutoDeck/
├── contracts/
│   ├── AutoDeck.sol            # The single Solidity smart contract
│   ├── contractConfig.ts       # Viem/Wagmi ABI, chain definition, & address
│   └── deployedAddress.json    # Deployment artifact
├── scripts/
│   └── deploy.js               # Hardhat deployment script for Botchain
├── test/
│   └── AutoDeck.test.js        # Comprehensive Hardhat contract test suite
├── app/
│   ├── layout.tsx              # Root HTML & Providers layout
│   ├── page.tsx                # The single webpage dApp
│   ├── providers.tsx           # Wagmi & TanStack Query configuration
│   └── globals.css             # Tailwind dark automotive styling
├── components/
│   ├── Navbar.tsx              # Header, wallet connection, & network status
│   ├── Hero.tsx                # Showroom headline, stats ticker, & actions
│   ├── CategoryFilter.tsx      # Category selector, search, & sorting
│   ├── CarCard.tsx             # Vehicle cards with on-chain likes & actions
│   ├── CarDetailsModal.tsx     # Full vehicle specifications modal
│   ├── PublishModal.tsx        # Publishing dialog with instant presets
│   └── Toast.tsx               # Transaction feedback & error notifications
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   └── sampleCars.ts           # Fast preset templates for testing
├── hardhat.config.js           # Hardhat config with Botchain Testnet RPC
├── tailwind.config.js          # Custom colors, glows, & shadows
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18, v20, or v22 recommended)
- **MetaMask** browser extension installed

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your configuration:
```env
PRIVATE_KEY=your_wallet_private_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x973a94828E433c2a6888f4B82725A69bE62f2229
NEXT_PUBLIC_RPC_URL=https://rpc.bohr.life
```

### 4. Compile & Test Smart Contract
```bash
# Compile contracts
npm run compile

# Run Hardhat test suite
npm test
```

### 5. Deploy to Botchain Testnet
Make sure your deployer wallet has testnet `BHR` from the Botchain faucet.
```bash
npm run deploy
```
This deploys `AutoDeck.sol` to Botchain Testnet and writes the deployed address to `contracts/deployedAddress.json`.

### 6. Run the Next.js Frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Smart Contract Security & Validations

- **Input Validation**: Ensures titles, brands, models, descriptions, locations, and image URLs are non-empty and within safe size limits.
- **Year Check**: Requires manufacturing years between 1886 (the invention of the modern automobile) and reasonable near-future models.
- **Category Check**: Enforces standard vehicle categories (`Sports`, `Luxury`, `SUV`, `Sedan`, `Coupe`, `Electric`).
- **Like Idempotency**: Prevents a wallet from liking the same vehicle multiple times (`AlreadyLiked` error).
- **Author Guard**: Enforces that only `msg.sender == listing.author` can remove a car listing (`NotListingAuthor` error).

---

## 📄 License
MIT


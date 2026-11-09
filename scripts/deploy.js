const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("----------------------------------------------------");
  console.log("🚗 Starting AutoDeck Deployment to Botchain Testnet");
  console.log("----------------------------------------------------");

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account found. Please check PRIVATE_KEY in .env");
  }

  const deployerAddress = await deployer.getAddress();
  console.log("Deployer Address:", deployerAddress);

  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  console.log("Deployer Balance:", hre.ethers.formatEther(balance), "BHR");

  if (balance === 0n) {
    console.warn("⚠️ Warning: Deployer balance is 0 BHR! Transaction may fail if gas is needed.");
  }

  console.log("Deploying AutoDeck.sol...");
  const AutoDeck = await hre.ethers.getContractFactory("AutoDeck");
  const autodeck = await AutoDeck.deploy();
  await autodeck.waitForDeployment();

  const contractAddress = await autodeck.getAddress();
  const deployTx = autodeck.deploymentTransaction();
  console.log("✅ AutoDeck deployed to:", contractAddress);
  if (deployTx) {
    console.log("Transaction Hash:", deployTx.hash);
    console.log("Explorer URL: https://scan.bohr.life/tx/" + deployTx.hash);
  }

  // Save deployment info to contracts/deployedAddress.json
  const deploymentData = {
    network: hre.network.name,
    chainId: hre.network.config.chainId || 968,
    address: contractAddress,
    deployer: deployerAddress,
    txHash: deployTx ? deployTx.hash : null,
    deployedAt: new Date().toISOString(),
  };

  const contractsDir = path.join(__dirname, "..", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "deployedAddress.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  // Update .env and .env.local
  const envFiles = [
    path.join(__dirname, "..", ".env"),
    path.join(__dirname, "..", ".env.local"),
  ];

  for (const envPath of envFiles) {
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, "utf8");
      if (content.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
        content = content.replace(
          /NEXT_PUBLIC_CONTRACT_ADDRESS=0x[0-9a-fA-F]+/g,
          `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        content = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n` + content;
      }
      fs.writeFileSync(envPath, content);
      console.log(`Updated contract address in ${path.basename(envPath)}`);
    }
  }

  // Update contracts/contractConfig.ts
  const configPath = path.join(contractsDir, "contractConfig.ts");
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, "utf8");
    content = content.replace(
      /0x[0-9a-fA-F]{40}/,
      contractAddress
    );
    fs.writeFileSync(configPath, content);
    console.log("Updated contract address in contracts/contractConfig.ts");
  }

  console.log("----------------------------------------------------");
  console.log("Waiting for 5 block confirmations before verification...");
  try {
    if (deployTx) {
      await deployTx.wait(5);
    }
    console.log("5 blocks confirmed! Attempting contract verification...");

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Verification succeeded on Bohr Scan!");
  } catch (verifyError) {
    console.log("Verification note:", verifyError.message || verifyError);
    console.log("You can also view the contract at: https://scan.bohr.life/address/" + contractAddress);
  }

  console.log("----------------------------------------------------");
  console.log("🎉 All deployment steps complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

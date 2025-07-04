import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting LegalEaseDocRegistry deployment...");
  
  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer address: ${deployer.address}`);
  
  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} ETH`);
  
  // Get contract factory
  const LegalEaseDocRegistry = await ethers.getContractFactory("LegalEaseDocRegistry");
  
  // Deploy contract
  console.log("🔄 Deploying LegalEaseDocRegistry...");
  const registry = await LegalEaseDocRegistry.deploy();
  
  // Wait for deployment to be mined
  await registry.waitForDeployment();
  const contractAddress = await registry.getAddress();
  
  console.log("✅ LegalEaseDocRegistry deployed successfully!");
  console.log(`📍 Contract address: ${contractAddress}`);
  
  // Get deployment transaction
  const deploymentTx = registry.deploymentTransaction();
  if (deploymentTx) {
    console.log(`🔗 Deployment transaction: ${deploymentTx.hash}`);
    const receipt = await deploymentTx.wait();
    console.log(`⛽ Gas used: ${receipt?.gasUsed?.toString()}`);
  }
  
  // Test contract functionality
  console.log("\n🧪 Testing contract functionality...");
  
  // Test notarize function with a sample hash
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Sample document content"));
  const sampleMeta = JSON.stringify({
    filename: "sample.pdf",
    timestamp: new Date().toISOString(),
    ipfs: "QmSampleHash"
  });
  
  console.log("🔄 Testing notarize function...");
  const notarizeTx = await registry.notarize(sampleHash, sampleMeta);
  await notarizeTx.wait();
  console.log("✅ Notarize test successful!");
  
  // Test exists function
  const exists = await registry.exists(sampleHash);
  console.log(`🔍 Document exists: ${exists}`);
  
  // Get document details
  const doc = await registry.docs(sampleHash);
  console.log(`📄 Document details:`);
  console.log(`   Hash: ${doc.hash}`);
  console.log(`   Submitter: ${doc.submitter}`);
  console.log(`   Timestamp: ${doc.timestamp}`);
  console.log(`   Meta: ${doc.meta}`);
  
  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTx: deploymentTx?.hash,
    blockNumber: deploymentTx ? (await deploymentTx.wait())?.blockNumber : null,
    timestamp: new Date().toISOString(),
    gasUsed: deploymentTx ? (await deploymentTx.wait())?.gasUsed?.toString() : null,
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network.name}-${network.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);
  
  // Generate frontend configuration
  const frontendConfig = {
    LEGAL_EASE_REGISTRY_ADDRESS: contractAddress,
    LEGAL_EASE_REGISTRY_CHAIN_ID: Number(network.chainId),
    LEGAL_EASE_REGISTRY_NETWORK: network.name,
  };
  
  const frontendConfigFile = path.join(deploymentsDir, `frontend-config-${network.name}.json`);
  fs.writeFileSync(frontendConfigFile, JSON.stringify(frontendConfig, null, 2));
  console.log(`🌐 Frontend config saved to: ${frontendConfigFile}`);
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Update your .env file with the contract address");
  console.log("2. Verify the contract on Basescan (optional):");
  console.log(`   npx hardhat verify --network ${network.name} ${contractAddress}`);
  console.log("3. Update your frontend configuration with the contract address");
  console.log(`4. Fund the deployer wallet if needed for future operations`);
}

// Handle errors
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
}); 
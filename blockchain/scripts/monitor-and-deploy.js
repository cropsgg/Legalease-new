const { ethers } = require("hardhat");
const { exec } = require("child_process");

async function checkBalance() {
  try {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    
    return {
      network: network.name,
      chainId: network.chainId.toString(),
      address: deployer.address,
      balance: balance,
      balanceEth: ethers.formatEther(balance)
    };
  } catch (error) {
    console.error("Error checking balance:", error);
    return null;
  }
}

async function deployContract() {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting automatic deployment...");
    
    exec("npx hardhat run scripts/deploy.ts --network base-sepolia", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Deployment failed:", error);
        reject(error);
        return;
      }
      
      console.log("✅ Deployment completed successfully!");
      console.log(stdout);
      
      if (stderr) {
        console.warn("Warnings:", stderr);
      }
      
      resolve(stdout);
    });
  });
}

async function main() {
  console.log("🔍 LegalEase Wallet Monitor & Auto-Deploy");
  console.log("==========================================");
  
  const minBalance = ethers.parseEther("0.001"); // Minimum balance for deployment
  const checkInterval = 30000; // Check every 30 seconds
  let attempts = 0;
  const maxAttempts = 120; // Stop after 1 hour (120 * 30 seconds)
  
  console.log(`⏰ Monitoring wallet every ${checkInterval/1000} seconds...`);
  console.log(`🎯 Target balance: ${ethers.formatEther(minBalance)} ETH`);
  console.log(`⏳ Will stop after ${maxAttempts} attempts (${(maxAttempts * checkInterval)/60000} minutes)`);
  console.log("");
  
  const monitor = setInterval(async () => {
    attempts++;
    
    console.log(`[${new Date().toLocaleTimeString()}] Attempt ${attempts}/${maxAttempts}`);
    
    const balanceInfo = await checkBalance();
    
    if (!balanceInfo) {
      console.log("❌ Failed to check balance, retrying...");
      return;
    }
    
    console.log(`💰 Current balance: ${balanceInfo.balanceEth} ETH`);
    
    if (balanceInfo.balance >= minBalance) {
      console.log("✅ Sufficient funds detected!");
      clearInterval(monitor);
      
      try {
        await deployContract();
        
        // Extract contract address from deployment output if possible
        console.log("🎉 Automatic deployment completed!");
        console.log("");
        console.log("📋 Next steps:");
        console.log("1. Check the deployment files in the deployments/ folder");
        console.log("2. Update your frontend .env.local with the contract address");
        console.log("3. Start your frontend with: npm run dev");
        console.log("4. Test the application at: http://localhost:3000/notary");
        
        process.exit(0);
        
      } catch (error) {
        console.error("❌ Automatic deployment failed:", error.message);
        console.log("Please run deployment manually:");
        console.log("npx hardhat run scripts/deploy.ts --network base-sepolia");
        process.exit(1);
      }
    } else {
      const needed = ethers.formatEther(minBalance - balanceInfo.balance);
      console.log(`⏳ Need ${needed} more ETH...`);
      
      if (attempts === 1) {
        console.log("");
        console.log("💡 Get testnet ETH from:");
        console.log("   🔗 https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
        console.log(`   📍 Wallet: ${balanceInfo.address}`);
        console.log("");
      }
    }
    
    if (attempts >= maxAttempts) {
      console.log("⏰ Maximum monitoring time reached.");
      console.log("Please fund the wallet manually and run:");
      console.log("npx hardhat run scripts/deploy.ts --network base-sepolia");
      clearInterval(monitor);
      process.exit(1);
    }
  }, checkInterval);
  
  // Initial balance check
  const initialBalance = await checkBalance();
  if (initialBalance) {
    console.log(`👤 Monitoring wallet: ${initialBalance.address}`);
    console.log(`🌐 Network: ${initialBalance.network} (${initialBalance.chainId})`);
    console.log(`💰 Starting balance: ${initialBalance.balanceEth} ETH`);
    console.log("");
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log("\n🛑 Monitoring stopped by user");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log("\n🛑 Monitoring terminated");
  process.exit(0);
});

main().catch((error) => {
  console.error("❌ Monitor failed:", error);
  process.exit(1);
}); 
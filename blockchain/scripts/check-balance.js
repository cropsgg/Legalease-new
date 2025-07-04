const { ethers } = require("hardhat");

async function main() {
  try {
    // Get network information
    const network = await ethers.provider.getNetwork();
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    
    // Check deployer balance
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceInEth = ethers.formatEther(balance);
    
    console.log(`💰 Balance on ${network.name}: ${balanceInEth} ETH`);
    
    // Check if balance is sufficient for deployment (minimum 0.001 ETH recommended)
    const minBalance = ethers.parseEther("0.001");
    
    if (balance < minBalance) {
      console.log(`⚠️  WARNING: Balance might be insufficient for deployment`);
      console.log(`   Recommended minimum: 0.001 ETH`);
      console.log(`   Current balance: ${balanceInEth} ETH`);
      console.log(`   Please fund wallet: ${deployer.address}`);
    } else {
      console.log(`✅ Balance sufficient for deployment`);
    }
    
  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
  }
}

main().catch((error) => {
  console.error("❌ Balance check failed:", error);
  process.exitCode = 1;
}); 
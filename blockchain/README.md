# LegalEase Blockchain

Smart contract infrastructure for LegalEase document notarization on Base blockchain.

## 🎯 Overview

This directory contains the smart contract implementation for LegalEase's blockchain-based document notarization system. The system allows users to create immutable, timestamped proofs of document existence on the Base blockchain.

## 📁 Directory Structure

```
blockchain/
├── contracts/
│   └── LegalEaseDocRegistry.sol    # Main smart contract
├── scripts/
│   ├── deploy.ts                   # Deployment script
│   ├── check-balance.js           # Balance checking utility
│   └── monitor-and-deploy.js      # Automated deployment
├── deployments/                   # Deployment artifacts
├── hardhat.config.ts             # Hardhat configuration
├── package.json                  # Dependencies and scripts
└── DEPLOYMENT_GUIDE.md           # Comprehensive deployment guide
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env with your private key and API keys
```

### 3. Compile Contracts
```bash
npm run compile
```

### 4. Deploy to Base Sepolia
```bash
npm run deploy:base-sepolia
```

## 📜 Smart Contract Features

### LegalEaseDocRegistry.sol
- **Document Notarization**: Store SHA-256 hashes with metadata
- **Existence Verification**: Check if documents are already notarized
- **Immutable Storage**: Permanent on-chain records
- **Event Emission**: Real-time frontend integration
- **Gas Optimized**: Efficient storage using uint40 timestamps

### Core Functions
```solidity
function notarize(bytes32 _hash, string calldata _meta) external
function exists(bytes32 _hash) external view returns (bool)
function docs(bytes32 _hash) external view returns (Doc memory)
```

## 🌐 Network Support

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia** (Chain ID: 84532) - Current testnet

## 🔧 Available Scripts

```bash
npm run compile         # Compile smart contracts
npm run deploy:base-sepolia  # Deploy to Base Sepolia testnet
npm run deploy:base     # Deploy to Base mainnet
npm run verify:base-sepolia  # Verify contract on Basescan
npm run clean          # Clean build artifacts
npm run gas-report     # Generate gas usage report
```

## 💰 Gas Costs

- **Contract Deployment**: ~390,693 gas (~$7 USD on mainnet)
- **Document Notarization**: ~45,000-350,000 gas (~$0.007-0.012 USD)
- **Existence Check**: ~23,000 gas (view function - no cost for reads)

## 🔗 Integration

The smart contract integrates with the LegalEase frontend via:
- **Contract ABI**: Exported to `frontend/lib/blockchain.ts`
- **Deployment Configs**: Auto-generated in `deployments/` directory
- **Environment Variables**: Contract addresses in frontend `.env.local`

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Hardhat Documentation](https://hardhat.org/docs) - Development framework
- [Base Documentation](https://docs.base.org) - Base blockchain information

## 🔒 Security

- **Private Keys**: Never commit to version control
- **Testnet First**: Always test on Base Sepolia before mainnet
- **Contract Verification**: Verify source code on Basescan
- **Gas Limits**: High limits to prevent out-of-gas errors

## 🆘 Support

For deployment issues, check:
1. Wallet has sufficient ETH for gas fees
2. Connected to correct network (Base Sepolia/Mainnet)
3. Private key is properly formatted (no 0x prefix)
4. RPC endpoints are accessible

## 📄 License

MIT License - see LICENSE file for details.

# LegalEase Smart Contract Deployment Guide

## 🎯 Base Sepolia Testnet Deployment

### Prerequisites

1. **MetaMask or Compatible Wallet** with Base Sepolia testnet added
2. **Testnet ETH** on Base Sepolia (get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))
3. **Private Key** with sufficient testnet ETH for deployment

### Step 1: Setup Environment

```bash
# Copy environment template
cp env.example .env
```

Update `.env` with your credentials:
```env
# Base Sepolia Testnet Configuration
BASE_SEPOLIA_RPC=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here_without_0x_prefix
BASESCAN_API_KEY=your_basescan_api_key_optional
REPORT_GAS=true
```

### Step 2: Get Testnet ETH

1. Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request testnet ETH (you need ~0.01 ETH for deployment)

### Step 3: Deploy Contract

```bash
# Deploy to Base Sepolia
npm run deploy:base-sepolia
```

Expected output:
```
🚀 Starting LegalEaseDocRegistry deployment...
📡 Network: base-sepolia (Chain ID: 84532)
👤 Deployer address: 0x...
💰 Deployer balance: 0.1 ETH
🔄 Deploying LegalEaseDocRegistry...
✅ LegalEaseDocRegistry deployed successfully!
📍 Contract address: 0x...
```

### Step 4: Verify Contract (Optional)

```bash
# Verify on Basescan
npx hardhat verify --network base-sepolia CONTRACT_ADDRESS
```

### Step 5: Update Frontend Configuration

The deployment script automatically generates:
- `deployments/base-sepolia-84532.json` - Deployment details
- `deployments/frontend-config-base-sepolia.json` - Frontend configuration

Copy the contract address to your frontend `.env.local`:
```env
NEXT_PUBLIC_REGISTRY_BASE_SEPOLIA=0xYourContractAddress
```

## 🔍 Deployment Verification

### Smart Contract Features Tested:
- ✅ `notarize(bytes32 hash, string meta)` - Store document hash
- ✅ `exists(bytes32 hash)` - Check if document exists  
- ✅ `docs(bytes32 hash)` - Get document details
- ✅ Event emission: `DocumentNotarized`

### Gas Usage:
- **Deployment**: ~390,693 gas (~$0.007 on Base Sepolia)
- **Notarize**: ~45,000-350,000 gas (~$0.001-0.012 per document)

### Security Features:
- ✅ Duplicate hash prevention
- ✅ Immutable on-chain storage
- ✅ Event-based verification
- ✅ Gas-optimized storage

## 🌐 Network Information

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

## 🔗 Frontend Integration

After deployment, update these files:

1. **Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_REGISTRY_BASE_SEPOLIA=0xYourContractAddress
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

2. **Blockchain Config** (`lib/blockchain.ts`):
Already configured with Base Sepolia support.

3. **Test Integration**:
```bash
cd ../frontend
npm run build
npm run dev
```

## 🎉 Deployment Success Checklist

- [ ] Smart contract deployed to Base Sepolia
- [ ] Contract verified on Basescan
- [ ] Test transaction successful
- [ ] Frontend environment updated
- [ ] Wallet connection working
- [ ] Document notarization functional

## 📱 Testing the Integration

1. **Connect Wallet**: Use MetaMask with Base Sepolia
2. **Upload Document**: Drag & drop PDF file
3. **Generate Hash**: SHA-256 client-side hashing
4. **Notarize**: Submit transaction to blockchain
5. **Verify**: Check transaction on Basescan

## 🚨 Important Notes

- **Never commit private keys** to version control
- **Use testnet only** for development and testing
- **Monitor gas costs** on mainnet deployment
- **Verify contract source code** on Basescan for transparency
- **Keep deployment artifacts** for reference

## 🔄 Mainnet Deployment

For production deployment to Base Mainnet:

1. Update `.env` with mainnet RPC and real ETH
2. Run: `npm run deploy:base`
3. Verify contract: `npm run verify:base CONTRACT_ADDRESS`
4. Update frontend with mainnet contract address

**Estimated Mainnet Costs:**
- Deployment: ~$7 USD (at 2 gwei)
- Per notarization: ~$0.007-0.012 USD (depending on metadata size)

## 🆘 Troubleshooting

### Common Issues

1. **Insufficient Funds Error**
   ```
   Error: insufficient funds for gas * price + value
   ```
   **Solution:** Fund wallet with at least 0.01 ETH from faucets

2. **Network Connection Issues**
   ```
   Error: could not detect network
   ```
   **Solution:** Check RPC URLs in hardhat.config.ts

3. **Contract Verification Failed**
   ```
   Error: Verification failed
   ```
   **Solution:** Add BASESCAN_API_KEY to .env file

### Useful Commands

```bash
# Check wallet balance
npx hardhat run scripts/check-balance.js --network base-sepolia

# Compile contracts
npx hardhat compile

# Clean build artifacts
npx hardhat clean

# Run gas report
npm run gas-report
``` 
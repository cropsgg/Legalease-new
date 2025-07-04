# LegalEase Testnet Deployment Guide

## 🚨 **URGENT: Fund Wallet First**

**Wallet Address:** `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf`
**Current Balance:** `0.000000000000024372 ETH` (Insufficient)
**Required:** `0.001 ETH minimum`

### 💰 Get Testnet ETH:

1. **Base Sepolia Faucet (Recommended):**
   - Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Connect wallet with address: `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf`
   - Request testnet ETH

2. **Alternative - Bridge from Sepolia:**
   - Get Sepolia ETH: https://sepoliafaucet.com/
   - Bridge to Base Sepolia: https://bridge.base.org/

3. **Alchemy Faucet:**
   - Visit: https://www.alchemy.com/faucets/ethereum-sepolia
   - Then bridge to Base Sepolia

---

## 🚀 **Deployment Process**

### Option 1: Automated Deployment (Recommended)

```bash
# Navigate to blockchain directory
cd blockchain

# Run automated deployment script
./deploy-testnet.sh
```

### Option 2: Manual Deployment

```bash
# Check balance first
npx hardhat run scripts/check-balance.js --network base-sepolia

# Deploy contract
npx hardhat run scripts/deploy.ts --network base-sepolia

# Verify contract (optional, requires BASESCAN_API_KEY)
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS>
```

---

## 📋 **Post-Deployment Setup**

### 1. Update Frontend Configuration

After successful deployment, add to `frontend/.env.local`:

```env
# Contract Addresses
NEXT_PUBLIC_REGISTRY_BASE_SEPOLIA=<DEPLOYED_CONTRACT_ADDRESS>

# Network URLs
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org

# WalletConnect (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<YOUR_PROJECT_ID>

# Environment
NEXT_PUBLIC_NODE_ENV=development
```

### 2. Test the Application

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies if needed
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- Open: http://localhost:3000/notary
- Connect wallet to Base Sepolia (Chain ID: 84532)
- Test document notarization

---

## 🧪 **Testing Checklist**

### Pre-Deployment Tests
- [ ] ✅ Local deployment successful (gas: 390,693)
- [ ] ✅ Contract functionality verified
- [ ] ✅ Frontend build successful (71.7kB)
- [ ] ⚠️  Wallet funding pending

### Post-Deployment Tests
- [ ] Wallet connection to Base Sepolia
- [ ] File upload and hash generation
- [ ] Gas estimation display
- [ ] Transaction submission
- [ ] Transaction confirmation
- [ ] Document verification
- [ ] Explorer link verification

---

## 🔧 **Troubleshooting**

### Common Issues

1. **Insufficient Funds Error**
   ```
   Error: insufficient funds for gas * price + value
   ```
   **Solution:** Fund wallet with at least 0.001 ETH from faucets above

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

# Get network info
npx hardhat console --network base-sepolia

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Clean build artifacts
npx hardhat clean
```

---

## 📊 **Expected Results**

### Successful Deployment Output:
```
🚀 Starting LegalEaseDocRegistry deployment...
📡 Network: base-sepolia (Chain ID: 84532)
👤 Deployer address: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
💰 Deployer balance: 0.001+ ETH
🔄 Deploying LegalEaseDocRegistry...
✅ LegalEaseDocRegistry deployed successfully!
📍 Contract address: 0x...
⛽ Gas used: ~390,693
```

### Generated Files:
- `deployments/base-sepolia-84532.json` - Deployment details
- `deployments/frontend-config-base-sepolia.json` - Frontend configuration
- Contract verification on BaseScan

---

## 🔗 **Important Links**

- **Base Sepolia Explorer:** https://sepolia.basescan.org/
- **Base Sepolia Faucet:** https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Base Bridge:** https://bridge.base.org/
- **WalletConnect Dashboard:** https://cloud.walletconnect.com/
- **Base Documentation:** https://docs.base.org/

---

## 🎯 **Next Steps After Deployment**

1. **Immediate:**
   - [ ] Fund wallet and deploy contract
   - [ ] Update frontend environment variables
   - [ ] Test end-to-end functionality

2. **Production Preparation:**
   - [ ] Deploy to Base Mainnet
   - [ ] Set up monitoring and analytics
   - [ ] Configure production environment
   - [ ] Conduct security audit

3. **User Acceptance Testing:**
   - [ ] Test with multiple wallets
   - [ ] Test with various file types
   - [ ] Verify gas cost estimates
   - [ ] Test document verification flow

---

**Status:** ⚠️ Waiting for wallet funding to proceed with deployment 
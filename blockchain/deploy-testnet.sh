#!/bin/bash

# LegalEase Testnet Deployment Script
# This script deploys the contract to Base Sepolia and configures the frontend

set -e

echo "🚀 LegalEase Testnet Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found! Please create .env file with PRIVATE_KEY"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    print_error "PRIVATE_KEY not set in .env file"
    exit 1
fi

print_status "Environment variables loaded"

# Function to check wallet balance
check_balance() {
    local network=$1
    print_status "Checking wallet balance on $network..."
    
    # Run a quick balance check using hardhat console
    npx hardhat run scripts/check-balance.js --network $network 2>/dev/null || true
}

# Function to deploy contract
deploy_contract() {
    local network=$1
    print_status "Deploying contract to $network..."
    
    # Deploy the contract
    npx hardhat run scripts/deploy.ts --network $network
    
    if [ $? -eq 0 ]; then
        print_success "Contract deployed successfully to $network"
        return 0
    else
        print_error "Deployment failed on $network"
        return 1
    fi
}

# Function to verify contract
verify_contract() {
    local network=$1
    local address=$2
    
    if [ ! -z "$BASESCAN_API_KEY" ]; then
        print_status "Verifying contract on $network..."
        npx hardhat verify --network $network $address || print_warning "Contract verification failed (optional)"
    else
        print_warning "BASESCAN_API_KEY not set, skipping contract verification"
    fi
}

# Function to update frontend config
update_frontend_config() {
    local network=$1
    local config_file="deployments/frontend-config-$network.json"
    
    if [ -f "$config_file" ]; then
        print_status "Updating frontend configuration..."
        
        # Extract contract address from deployment config
        local contract_address=$(cat $config_file | jq -r '.LEGAL_EASE_REGISTRY_ADDRESS')
        
        print_success "Contract address: $contract_address"
        print_status "Please update your frontend .env.local file with:"
        echo "NEXT_PUBLIC_REGISTRY_BASE_SEPOLIA=$contract_address"
        
        # Copy config to frontend directory
        cp $config_file ../frontend/public/contract-config-$network.json
        print_success "Contract config copied to frontend/public/"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check Node.js version warning
    node_version=$(node --version)
    print_warning "Using Node.js $node_version (Hardhat recommends LTS versions)"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Compile contracts
    print_status "Compiling contracts..."
    npx hardhat compile
    
    # Choose network for deployment
    NETWORK="base-sepolia"
    print_status "Deploying to $NETWORK"
    
    # Check balance first
    check_balance $NETWORK
    
    # Deploy contract
    if deploy_contract $NETWORK; then
        # Get the deployed contract address
        config_file="deployments/base-sepolia-84532.json"
        if [ -f "$config_file" ]; then
            contract_address=$(cat $config_file | jq -r '.contractAddress')
            
            # Verify contract
            verify_contract $NETWORK $contract_address
            
            # Update frontend config
            update_frontend_config "base-sepolia"
            
            print_success "🎉 Deployment completed successfully!"
            echo ""
            print_status "📋 Next Steps:"
            echo "1. Add the following to your frontend/.env.local:"
            echo "   NEXT_PUBLIC_REGISTRY_BASE_SEPOLIA=$contract_address"
            echo "2. Test the application with Base Sepolia testnet"
            echo "3. Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
            echo "4. Verify the contract on BaseScan: https://sepolia.basescan.org/address/$contract_address"
            
        else
            print_error "Deployment config file not found"
            exit 1
        fi
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Run main function
main "$@" 
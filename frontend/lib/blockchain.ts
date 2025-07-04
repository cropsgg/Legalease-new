import { createConfig, http } from 'wagmi'
import { base, baseGoerli, baseSepolia, hardhat } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [base.id]: process.env.NEXT_PUBLIC_REGISTRY_BASE || '',
  [baseGoerli.id]: process.env.NEXT_PUBLIC_REGISTRY_BASE_GOERLI || '',
  [baseSepolia.id]: process.env.NEXT_PUBLIC_REGISTRY_BASE_SEPOLIA || '0xB8C12Ff0f2628Af59dEF9D4BAf89BB250D8A87F3',
  [hardhat.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Default hardhat deployment
} as const

// Supported chains
export const supportedChains = [base, baseGoerli, baseSepolia, hardhat] as const
export type SupportedChainId = typeof supportedChains[number]['id']

// Get contract address for current chain
export function getContractAddress(chainId: number): string {
  const address = CONTRACT_ADDRESSES[chainId as SupportedChainId]
  if (!address) {
    throw new Error(`No contract address found for chain ID: ${chainId}`)
  }
  return address
}

// Check if chain is supported
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.keys(CONTRACT_ADDRESSES).includes(chainId.toString())
}

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'LegalEase',
      appLogoUrl: '/logo.png',
    }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
    [baseGoerli.id]: http(process.env.NEXT_PUBLIC_BASE_GOERLI_RPC || 'https://goerli.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

// Explorer URLs
export const BLOCK_EXPLORERS = {
  [base.id]: 'https://basescan.org',
  [baseGoerli.id]: 'https://goerli.basescan.org',
  [baseSepolia.id]: 'https://sepolia.basescan.org',
  [hardhat.id]: 'http://localhost:8545',
} as const

// Get explorer URL for transaction
export function getExplorerUrl(chainId: number, txHash: string): string {
  const baseUrl = BLOCK_EXPLORERS[chainId as SupportedChainId]
  if (!baseUrl) return ''
  return `${baseUrl}/tx/${txHash}`
}

// Get explorer URL for contract
export function getContractExplorerUrl(chainId: number, address: string): string {
  const baseUrl = BLOCK_EXPLORERS[chainId as SupportedChainId]
  if (!baseUrl) return ''
  return `${baseUrl}/address/${address}`
}

// Network display names
export const NETWORK_NAMES = {
  [base.id]: 'Base Mainnet',
  [baseGoerli.id]: 'Base Goerli',
  [baseSepolia.id]: 'Base Sepolia',
  [hardhat.id]: 'Local Hardhat',
} as const

// Gas price configurations (using strings to avoid BigInt issues)
export const GAS_CONFIGS = {
  [base.id]: {
    maxFeePerGas: '2000000000', // 2 gwei
    maxPriorityFeePerGas: '1000000000', // 1 gwei
  },
  [baseGoerli.id]: {
    maxFeePerGas: '2000000000',
    maxPriorityFeePerGas: '1000000000',
  },
  [baseSepolia.id]: {
    maxFeePerGas: '2000000000',
    maxPriorityFeePerGas: '1000000000',
  },
  [hardhat.id]: {
    maxFeePerGas: '20000000000',
    maxPriorityFeePerGas: '1000000000',
  },
} as const

// Contract ABI
export const LEGAL_EASE_REGISTRY_ABI = [
  {
    "type": "function",
    "name": "notarize",
    "inputs": [
      { "name": "_hash", "type": "bytes32" },
      { "name": "_meta", "type": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "exists",
    "inputs": [{ "name": "_hash", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "docs",
    "inputs": [{ "name": "", "type": "bytes32" }],
    "outputs": [
      { "name": "hash", "type": "bytes32" },
      { "name": "submitter", "type": "address" },
      { "name": "timestamp", "type": "uint40" },
      { "name": "meta", "type": "string" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DocumentNotarized",
    "inputs": [
      { "name": "hash", "type": "bytes32", "indexed": true },
      { "name": "submitter", "type": "address", "indexed": true },
      { "name": "timestamp", "type": "uint256", "indexed": false },
      { "name": "meta", "type": "string", "indexed": false }
    ]
  }
] as const

// Utility types
export type NotarizeArgs = {
  hash: `0x${string}`
  meta: string
}

export type DocumentData = {
  hash: `0x${string}`
  submitter: `0x${string}`
  timestamp: number
  meta: string
}

export type NotarizeEvent = {
  hash: `0x${string}`
  submitter: `0x${string}`
  timestamp: bigint
  meta: string
} 
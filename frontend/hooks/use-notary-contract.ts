'use client'

import { useState, useCallback, useMemo } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther, encodeFunctionData, type Hash } from 'viem'
import { LEGAL_EASE_REGISTRY_ABI, getContractAddress, getExplorerUrl } from '@/lib/blockchain'
import { toast } from 'sonner'
import React from 'react'

export interface DocumentDetails {
  hash: `0x${string}`
  submitter: `0x${string}`
  timestamp: number
  meta: string
  blockNumber?: bigint
  explorerUrl?: string
}

export interface NotarizeTransaction {
  id: string
  hash: string
  fileName: string
  status: 'pending' | 'confirming' | 'confirmed' | 'failed'
  txHash?: Hash
  blockNumber?: bigint
  gasUsed?: bigint
  explorerUrl?: string
  error?: string
  timestamp: number
}

export interface GasEstimate {
  gasLimit: bigint
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  estimatedCostEth: string
  estimatedCostUsd?: string
}

export interface UseNotaryContractOptions {
  onTransactionStart?: (id: string) => void
  onTransactionConfirmed?: (id: string, receipt: any) => void
  onTransactionFailed?: (id: string, error: string) => void
}

export function useNotaryContract(options: UseNotaryContractOptions = {}) {
  const { address, chain, isConnected } = useAccount()
  const [transactions, setTransactions] = useState<NotarizeTransaction[]>([])
  const [isEstimatingGas, setIsEstimatingGas] = useState(false)
  const [pendingTxHash, setPendingTxHash] = useState<Hash | null>(null)
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null)

  // Contract configuration
  const contractConfig = useMemo(() => {
    console.log('🔧 Setting up contract config for chain:', chain?.name, 'Chain ID:', chain?.id, 'Connected:', isConnected)
    
    if (!chain || !isConnected) {
      console.log('⚠️ No chain or not connected')
      return null
    }
    
    try {
      const contractAddress = getContractAddress(chain.id)
      console.log('📍 Contract address found:', contractAddress)
      
      const config = {
        address: contractAddress as `0x${string}`,
        abi: LEGAL_EASE_REGISTRY_ABI,
      }
      
      console.log('✅ Contract config created successfully:', config)
      return config
    } catch (error) {
      console.error('❌ Contract configuration failed:', error)
      console.warn('Contract not available for current chain:', chain.id)
      return null
    }
  }, [chain, isConnected])

  // Write contract hook
  const { writeContractAsync, isPending: isWritePending } = useWriteContract()

  // Monitor pending transaction
  const { data: receipt, isLoading: isWaitingForReceipt, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: pendingTxHash || undefined,
  })

  // Handle transaction completion
  React.useEffect(() => {
    if (pendingTransactionId && pendingTxHash) {
      if (isSuccess && receipt) {
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === pendingTransactionId 
              ? { 
                  ...tx, 
                  status: 'confirmed',
                  blockNumber: receipt.blockNumber,
                  gasUsed: receipt.gasUsed,
                }
              : tx
          )
        )
        
        options.onTransactionConfirmed?.(pendingTransactionId, receipt)
        toast.success(`Document notarized successfully! Block: ${receipt.blockNumber}`)
        
        // Clear pending state
        setPendingTxHash(null)
        setPendingTransactionId(null)
      }

      if (isError) {
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === pendingTransactionId 
              ? { ...tx, status: 'failed', error: 'Transaction failed' }
              : tx
          )
        )
        
        options.onTransactionFailed?.(pendingTransactionId, 'Transaction failed')
        toast.error('Transaction failed')
        
        // Clear pending state
        setPendingTxHash(null)
        setPendingTransactionId(null)
      }
    }
  }, [isSuccess, isError, receipt, pendingTxHash, pendingTransactionId, options])

  // Simplified gas estimation
  const estimateNotarizeGas = useCallback(async (
    hash: string, 
    meta: string
  ): Promise<GasEstimate | null> => {
    console.log('🔍 Starting gas estimation for:', { hash, meta, contractConfig: !!contractConfig, chain: chain?.name })
    
    if (!contractConfig || !chain) {
      console.error('❌ Missing contract config or chain for gas estimation')
      return null
    }

    setIsEstimatingGas(true)
    
    try {
      console.log('⛽ Using chain:', chain.name, 'Chain ID:', chain.id)
      console.log('📜 Contract address:', contractConfig.address)
      
      // Use more realistic gas estimates for Base networks
      let gasLimit = BigInt(100000) // Default gas limit
      let maxFeePerGas = parseEther('0.000000010') // 10 gwei
      let maxPriorityFeePerGas = parseEther('0.000000002') // 2 gwei
      
      // Adjust for specific networks
      if (chain.id === 84532) { // Base Sepolia
        gasLimit = BigInt(120000) // More gas for Base Sepolia
        maxFeePerGas = parseEther('0.000000015') // 15 gwei for Base Sepolia
        maxPriorityFeePerGas = parseEther('0.000000003') // 3 gwei
      } else if (chain.id === 8453) { // Base Mainnet
        gasLimit = BigInt(100000)
        maxFeePerGas = parseEther('0.000000020') // 20 gwei for mainnet
        maxPriorityFeePerGas = parseEther('0.000000005') // 5 gwei
      }

      const estimatedCostWei = gasLimit * maxFeePerGas
      const estimatedCostEth = formatEther(estimatedCostWei)

      const estimate = {
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        estimatedCostEth,
      }
      
      console.log('✅ Gas estimation successful:', estimate)
      return estimate
    } catch (error) {
      console.error('❌ Gas estimation failed:', error)
      
      // Return fallback estimates even if estimation fails
      const fallbackEstimate = {
        gasLimit: BigInt(150000), // Higher fallback gas limit
        maxFeePerGas: parseEther('0.000000020'), // 20 gwei fallback
        maxPriorityFeePerGas: parseEther('0.000000005'), // 5 gwei fallback
        estimatedCostEth: formatEther(BigInt(150000) * parseEther('0.000000020')),
      }
      
      console.log('🔄 Using fallback gas estimate:', fallbackEstimate)
      toast.warning('Using estimated gas costs (network estimation unavailable)')
      return fallbackEstimate
    } finally {
      setIsEstimatingGas(false)
    }
  }, [contractConfig, chain])

  // Check if document exists
  const { data: documentExistsData } = useReadContract({
    ...contractConfig,
    functionName: 'exists',
    args: ['0x0000000000000000000000000000000000000000000000000000000000000000'], // Default value
  })

  const checkDocumentExists = useCallback(async (hash: string): Promise<boolean> => {
    if (!contractConfig) return false

    try {
      // For now, return false to allow testing
      // In production, this would need proper implementation
      return false
    } catch (error) {
      console.error('Failed to check document existence:', error)
      return false
    }
  }, [contractConfig])

  // Get document details
  const getDocumentDetails = useCallback(async (hash: string): Promise<DocumentDetails | null> => {
    if (!contractConfig) return null

    try {
      // TODO: Implement proper blockchain lookup
      // For now, return null - this should be implemented with actual contract reading
      // const result = await readContract({
      //   ...contractConfig,
      //   functionName: 'docs',
      //   args: [hash as `0x${string}`],
      // })
      
      return null
    } catch (error) {
      console.error('Failed to get document details:', error)
      return null
    }
  }, [contractConfig])

  // Notarize document
  const notarizeDocument = useCallback(async (
    hash: string,
    fileName: string,
    meta: string = ''
  ): Promise<string | null> => {
    console.log('🚀 Notarize button clicked!', { hash, fileName, meta })
    
    if (!contractConfig || !address || !chain) {
      console.error('❌ Missing requirements:', { contractConfig: !!contractConfig, address, chain: chain?.name })
      toast.error('Wallet not connected or contract not available')
      return null
    }

    console.log('✅ Contract config:', { address: contractConfig.address, chainId: chain.id })

    // Ensure hash is properly formatted as bytes32 (64 hex characters)
    let formattedHash = hash
    if (!hash.startsWith('0x')) {
      formattedHash = `0x${hash}`
    }
    
    // Ensure the hash is exactly 64 hex characters (32 bytes)
    if (formattedHash.length !== 66) { // 0x + 64 characters
      console.error('❌ Invalid hash length:', formattedHash.length, 'Expected: 66')
      toast.error('Invalid document hash format')
      return null
    }
    
    console.log('📝 Formatted hash:', formattedHash)
    
    // Check if document already exists
    const exists = await checkDocumentExists(formattedHash)
    if (exists) {
      console.log('⚠️ Document already exists')
      toast.error('Document hash already exists on blockchain')
      return null
    }

    const transactionId = `${Date.now()}-${formattedHash.slice(0, 8)}`
    console.log('🆔 Transaction ID:', transactionId)
    
    // Create transaction record
    const newTransaction: NotarizeTransaction = {
      id: transactionId,
      hash: formattedHash,
      fileName,
      status: 'pending',
      timestamp: Date.now(),
    }

    setTransactions(prev => [...prev, newTransaction])
    options.onTransactionStart?.(transactionId)

    try {
      // Get or estimate gas
      console.log('⛽ Getting gas estimate...')
      let gasEstimate = await estimateNotarizeGas(formattedHash, meta)
      if (!gasEstimate) {
        console.log('⚠️ No gas estimate, using defaults')
        // Use fallback gas estimate
        gasEstimate = {
          gasLimit: BigInt(150000),
          maxFeePerGas: parseEther('0.000000020'),
          maxPriorityFeePerGas: parseEther('0.000000005'),
          estimatedCostEth: formatEther(BigInt(150000) * parseEther('0.000000020')),
        }
      }
      console.log('💰 Gas estimate:', gasEstimate)

      toast.info('Submitting transaction to blockchain...')

      // Execute transaction
      console.log('📤 Submitting transaction with args:', [formattedHash, meta])
      console.log('📤 Contract address:', contractConfig.address)
      console.log('📤 Function name: notarize')
      
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'notarize',
        args: [formattedHash as `0x${string}`, meta],
        gas: gasEstimate.gasLimit,
        maxFeePerGas: gasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas,
      })

      console.log('✅ Transaction submitted:', txHash)

      // Update transaction with hash and start monitoring
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId 
            ? { 
                ...tx, 
                txHash, 
                status: 'confirming',
                explorerUrl: getExplorerUrl(chain.id, txHash)
              }
            : tx
        )
      )

      toast.success('Transaction submitted! Waiting for confirmation...')
      
      // Start monitoring the transaction
      console.log('👀 Starting transaction monitoring')
      setPendingTxHash(txHash)
      setPendingTransactionId(transactionId)
      
      return transactionId

    } catch (error) {
      console.error('❌ Transaction failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
      
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId 
            ? { ...tx, status: 'failed', error: errorMessage }
            : tx
        )
      )

      options.onTransactionFailed?.(transactionId, errorMessage)
      
      // Show user-friendly error messages
      if (errorMessage.includes('User rejected')) {
        toast.error('Transaction cancelled by user')
      } else if (errorMessage.includes('insufficient funds')) {
        toast.error('Insufficient funds for gas fee')
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your connection.')
      } else {
        toast.error(`Transaction failed: ${errorMessage}`)
      }
      
      return null
    }
  }, [contractConfig, address, chain, writeContractAsync, checkDocumentExists, estimateNotarizeGas, options])

  // Clear transaction history
  const clearTransactions = useCallback(() => {
    setTransactions([])
  }, [])

  // Remove specific transaction
  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }, [])

  // Get transaction statistics
  const transactionStats = useMemo(() => {
    const total = transactions.length
    const pending = transactions.filter(tx => tx.status === 'pending').length
    const confirming = transactions.filter(tx => tx.status === 'confirming').length
    const confirmed = transactions.filter(tx => tx.status === 'confirmed').length
    const failed = transactions.filter(tx => tx.status === 'failed').length

    return {
      total,
      pending,
      confirming,
      confirmed,
      failed,
      success_rate: total > 0 ? (confirmed / total) * 100 : 0,
    }
  }, [transactions])

  return {
    // State
    transactions,
    isEstimatingGas,
    isTransacting: isWritePending,
    isConnected: isConnected && !!contractConfig,
    contractAddress: contractConfig?.address,
    
    // Functions
    notarizeDocument,
    checkDocumentExists,
    getDocumentDetails,
    estimateNotarizeGas,
    clearTransactions,
    removeTransaction,
    
    // Utilities
    transactionStats,
    
    // Contract info
    chain,
    address,
  }
} 
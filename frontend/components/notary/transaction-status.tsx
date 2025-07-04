'use client'

import React, { useState, useEffect } from 'react'
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Fuel, 
  Clock, 
  Hash,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useNotaryContract, type NotarizeTransaction, type GasEstimate } from '@/hooks/use-notary-contract'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'

interface TransactionStatusProps {
  fileHash?: string
  fileName?: string
  onTransactionComplete?: (txHash: string) => void
  className?: string
}

export function TransactionStatus({
  fileHash,
  fileName,
  onTransactionComplete,
  className
}: TransactionStatusProps) {
  const { isConnected, chain } = useAccount()
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [usingFallbackGas, setUsingFallbackGas] = useState(false)
  
  const {
    notarizeDocument,
    estimateNotarizeGas,
    transactions,
    isEstimatingGas,
    isTransacting,
    transactionStats,
    hasRecentFailures,
    isHealthy,
    recoverTransaction,
  } = useNotaryContract({
    onTransactionConfirmed: (id, receipt) => {
      const transaction = transactions.find(tx => tx.id === id)
      if (transaction?.txHash) {
        onTransactionComplete?.(transaction.txHash)
      }
    }
  })

  // Get gas estimate when file hash is available
  useEffect(() => {
    if (fileHash && fileName && isConnected) {
      console.log('🔍 Getting gas estimate for:', { fileHash, fileName, isConnected })
      const getGasEstimate = async () => {
        try {
          const estimate = await estimateNotarizeGas(fileHash, JSON.stringify({
            filename: fileName,
            timestamp: new Date().toISOString(),
          }))
          console.log('⛽ Gas estimate result:', estimate)
          setGasEstimate(estimate)
          setUsingFallbackGas(false)
        } catch (error) {
          console.error('❌ Gas estimation failed:', error)
          // Set a fallback gas estimate so the button remains clickable
          const fallbackEstimate = {
            gasLimit: BigInt(400000), // Much higher to prevent out of gas
            maxFeePerGas: parseEther('0.000000030'), // 30 gwei fallback
            maxPriorityFeePerGas: parseEther('0.000000010'), // 10 gwei fallback
            estimatedCostEth: formatEther(BigInt(400000) * parseEther('0.000000030')),
          }
          console.log('🔄 Using high fallback gas estimate:', fallbackEstimate)
          setGasEstimate(fallbackEstimate)
          setUsingFallbackGas(true)
        }
      }
      
      getGasEstimate()
    } else {
      console.log('⚠️ Missing requirements for gas estimation:', { fileHash: !!fileHash, fileName: !!fileName, isConnected })
    }
  }, [fileHash, fileName, isConnected, estimateNotarizeGas])

  // Handle notarization
  const handleNotarize = async () => {
    console.log('🚀 Notarize button clicked!')
    console.log('📋 Current state:', { 
      fileHash: !!fileHash, 
      fileName: !!fileName, 
      isConnected, 
      gasEstimate: !!gasEstimate,
      chain: chain?.name 
    })
    
    if (!fileHash || !fileName) {
      console.error('❌ Missing file data')
      toast.error('No file hash available')
      return
    }

    if (!isConnected) {
      console.error('❌ Wallet not connected')
      toast.error('Please connect your wallet first')
      return
    }

    const metadata = JSON.stringify({
      filename: fileName,
      timestamp: new Date().toISOString(),
      version: '1.0',
    })

    console.log('📤 Starting notarization with:', { fileHash, fileName, metadata })
    await notarizeDocument(fileHash, fileName, metadata)
  }

  // Copy to clipboard helper
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
      toast.success(`${type} copied to clipboard`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Get current transaction for this file
  const currentTransaction = transactions.find(tx => tx.hash === fileHash)

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to proceed with blockchain notarization
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!fileHash || !fileName) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please upload and process a file first to enable blockchain notarization
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`legal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Blockchain Notarization
        </CardTitle>
        <CardDescription>
          Anchor your document hash on Base blockchain for permanent proof
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Gas Estimation */}
        {gasEstimate && !currentTransaction && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-legal-secondary" />
              <span className="text-sm font-medium text-legal-dark-text">Gas Estimation</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-legal-beige/50 rounded-lg">
              <div>
                <span className="text-xs text-legal-secondary">Gas Limit</span>
                <div className="text-sm font-medium text-legal-dark-text">
                  {gasEstimate.gasLimit.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-xs text-legal-secondary">Est. Cost</span>
                <div className="text-sm font-medium text-legal-dark-text">
                  {parseFloat(gasEstimate.estimatedCostEth).toFixed(6)} ETH
                </div>
              </div>
              <div>
                <span className="text-xs text-legal-secondary">Max Fee</span>
                <div className="text-sm font-medium text-legal-dark-text">
                  {formatEther(gasEstimate.maxFeePerGas)} ETH/gas
                </div>
              </div>
              <div>
                <span className="text-xs text-legal-secondary">Priority Fee</span>
                <div className="text-sm font-medium text-legal-dark-text">
                  {formatEther(gasEstimate.maxPriorityFeePerGas)} ETH/gas
                </div>
              </div>
            </div>

            <Alert>
              <Fuel className="h-4 w-4" />
              <AlertDescription>
                <strong>Estimated cost: ~{parseFloat(gasEstimate.estimatedCostEth).toFixed(6)} ETH</strong>
                <br />
                This will create a permanent, tamper-proof record on Base blockchain.
                {usingFallbackGas && (
                  <>
                    <br />
                    <em className="text-yellow-600">Note: Using estimated gas costs (network unavailable)</em>
                  </>
                )}
                {gasEstimate.gasLimit > BigInt(200000) && (
                  <>
                    <br />
                    <em className="text-orange-600">High gas limit ({gasEstimate.gasLimit.toLocaleString()}) to prevent out-of-gas errors</em>
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Notarize Button or Transaction Status */}
        {!currentTransaction ? (
          <div className="space-y-4">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                Debug: isEstimatingGas={isEstimatingGas.toString()}, isTransacting={isTransacting.toString()}, hasGasEstimate={!!gasEstimate}
              </div>
            )}
            <Button
              onClick={handleNotarize}
              disabled={isEstimatingGas || isTransacting || !isConnected}
              className="w-full btn-legal-primary"
              size="lg"
            >
              {isEstimatingGas ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Estimating Gas...
                </>
              ) : isTransacting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting Transaction...
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 mr-2" />
                  Notarize on Blockchain
                </>
              )}
            </Button>

            <div className="text-xs text-center text-legal-secondary">
              By clicking "Notarize on Blockchain", you agree to pay the gas fee 
              and create a permanent record on Base blockchain.
            </div>
            
            {/* Helpful Tips */}
            {(hasRecentFailures || !isHealthy) && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Having issues? Try these tips:</strong>
                  <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
                    <li>Ensure you have sufficient ETH for gas fees (~0.012 ETH recommended)</li>
                    <li>Check you're connected to Base Sepolia network (Chain ID: 84532)</li>
                    <li>Try refreshing the page and reconnecting your wallet</li>
                    <li>Wait a few minutes between transactions during network congestion</li>
                    <li>Check transaction status on <a href="https://sepolia.basescan.org" target="_blank" rel="noopener noreferrer" className="text-legal-accent underline">BaseScan</a></li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <TransactionProgress transaction={currentTransaction} onCopy={copyToClipboard} copied={copied} />
        )}

        {/* Network Info */}
        {chain && (
          <div className="pt-4 border-t border-legal-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-legal-secondary">Network</span>
              <Badge variant="outline" className="text-xs">
                {chain.name} (Chain ID: {chain.id})
              </Badge>
            </div>
          </div>
        )}

        {/* Transaction Statistics */}
        {transactionStats.total > 0 && (
          <div className="pt-4 border-t border-legal-border">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-legal-dark-text">{transactionStats.total}</div>
                <div className="text-xs text-legal-secondary">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{transactionStats.confirmed}</div>
                <div className="text-xs text-legal-secondary">Confirmed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">{transactionStats.confirming}</div>
                <div className="text-xs text-legal-secondary">Pending</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{transactionStats.failed}</div>
                <div className="text-xs text-legal-secondary">Failed</div>
              </div>
            </div>
            
            {/* System Health Status */}
            <div className="mt-4 pt-4 border-t border-legal-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-legal-dark-text">System Status</span>
                <Badge 
                  variant={isHealthy ? "default" : "destructive"}
                  className={isHealthy ? "bg-green-100 text-green-800" : ""}
                >
                  {isHealthy ? "✅ Healthy" : "⚠️ Issues"}
                </Badge>
              </div>
              
              {hasRecentFailures && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Recent transaction failures detected. Try increasing gas limit or check network status.
                  </AlertDescription>
                </Alert>
              )}
              
              {transactionStats.success_rate < 50 && transactionStats.total > 2 && (
                <Alert className="mt-2" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Low success rate ({transactionStats.success_rate.toFixed(0)}%). Consider checking wallet balance and network connection.
                  </AlertDescription>
                </Alert>
              )}
              
              {transactionStats.success_rate >= 80 && transactionStats.total > 2 && (
                <Alert className="mt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Excellent success rate ({transactionStats.success_rate.toFixed(0)}%)! System performing well.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Transaction progress component
interface TransactionProgressProps {
  transaction: NotarizeTransaction
  onCopy: (text: string, type: string) => void
  copied: string | null
}

function TransactionProgress({ transaction, onCopy, copied }: TransactionProgressProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'confirming':
        return <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
      case 'confirmed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (transaction.status) {
      case 'pending':
        return 'Preparing Transaction...'
      case 'confirming':
        return 'Confirming on Blockchain...'
      case 'confirmed':
        return 'Successfully Notarized!'
      case 'failed':
        return 'Transaction Failed'
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'pending':
        return 'text-blue-600'
      case 'confirming':
        return 'text-yellow-600'
      case 'confirmed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
    }
  }

  const getProgressValue = () => {
    switch (transaction.status) {
      case 'pending':
        return 25
      case 'confirming':
        return 75
      case 'confirmed':
        return 100
      case 'failed':
        return 0
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            <div className="text-xs text-legal-secondary">
              {transaction.fileName}
            </div>
          </div>
        </div>
        {transaction.status === 'confirmed' && (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )}
      </div>

      {/* Progress Bar */}
      {transaction.status !== 'failed' && (
        <div className="space-y-2">
          <Progress value={getProgressValue()} className="h-2" />
          <div className="text-xs text-legal-secondary text-center">
            {transaction.status === 'pending' && 'Submitting to network...'}
            {transaction.status === 'confirming' && 'Waiting for block confirmation...'}
            {transaction.status === 'confirmed' && 'Transaction confirmed and recorded!'}
          </div>
        </div>
      )}

      {/* Transaction Details */}
      {transaction.txHash && (
        <div className="space-y-3 p-3 bg-legal-beige/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-legal-secondary">Transaction Hash</span>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-legal-dark-text">
                {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(transaction.txHash!, 'Transaction hash')}
                className="h-6 w-6 p-0"
              >
                {copied === 'Transaction hash' ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {transaction.blockNumber && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-legal-secondary">Block Number</span>
              <span className="text-sm text-legal-dark-text">
                {transaction.blockNumber.toString()}
              </span>
            </div>
          )}

          {transaction.gasUsed && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-legal-secondary">Gas Used</span>
              <span className="text-sm text-legal-dark-text">
                {transaction.gasUsed.toLocaleString()}
              </span>
            </div>
          )}

          {transaction.explorerUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full"
            >
              <a 
                href={transaction.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Error Details */}
      {transaction.status === 'failed' && transaction.error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Transaction Failed:</strong>
            <br />
            {transaction.error}
          </AlertDescription>
        </Alert>
      )}
      {/* Success Message */}
      {transaction.status === 'confirmed' && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <strong>Document Successfully Notarized!</strong>
            <br />
            Your document hash has now been permanently recorded on the blockchain. 
            This serves as cryptographic proof of your document's existence and integrity.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 
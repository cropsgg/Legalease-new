'use client'

import React, { useState, useCallback } from 'react'
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  Hash,
  Calendar,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useNotaryContract } from '@/hooks/use-notary-contract'
import { useAccount } from 'wagmi'
import { useFileHasher, type ProcessedFile } from '@/hooks/use-file-hasher'

interface VerificationResult {
  exists: boolean
  hash: string
  blockNumber?: bigint
  timestamp?: number
  explorerUrl?: string
  error?: string
}

interface DocumentVerifierProps {
  className?: string
}

export function DocumentVerifier({ className }: DocumentVerifierProps) {
  const { isConnected, chain } = useAccount()
  const [hashInput, setHashInput] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const { checkDocumentExists, getDocumentDetails } = useNotaryContract()
  
  const { 
    processFiles, 
    files, 
    isProcessing, 
    clearFiles 
  } = useFileHasher({
    enableIPFS: false, // Don't need IPFS for verification
  })

  // Verify by hash input
  const verifyByHash = useCallback(async () => {
    if (!hashInput.trim()) {
      toast.error('Please enter a document hash')
      return
    }

    const hash = hashInput.trim()
    
    // Basic hash validation (SHA-256 is 64 hex characters)
    if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
      toast.error('Invalid hash format. SHA-256 hashes should be 64 hexadecimal characters.')
      return
    }

    setIsVerifying(true)
    
    try {
      const exists = await checkDocumentExists(hash)
      let details = null
      
      if (exists) {
        details = await getDocumentDetails(hash)
      }

      const result: VerificationResult = {
        exists,
        hash,
        blockNumber: details?.blockNumber,
        timestamp: details?.timestamp ? Number(details.timestamp) * 1000 : undefined,
        explorerUrl: details?.explorerUrl,
      }

      setVerificationResult(result)
      
      if (exists) {
        toast.success('Document found on blockchain!')
      } else {
        toast.error('Document not found on blockchain')
      }
      
    } catch (error) {
      console.error('Verification failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Verification failed'
      
      setVerificationResult({
        exists: false,
        hash,
        error: errorMessage,
      })
      
      toast.error(`Verification failed: ${errorMessage}`)
    } finally {
      setIsVerifying(false)
    }
  }, [hashInput, checkDocumentExists, getDocumentDetails])

  // Handle file drop for verification
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      clearFiles()
      processFiles(files)
    }
  }, [processFiles, clearFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      clearFiles()
      processFiles(files)
    }
  }, [processFiles, clearFiles])

  // Verify uploaded file
  const verifyUploadedFile = useCallback(async () => {
    const completedFile = files.find((f: ProcessedFile) => f.status === 'completed' && f.hash)
    
    if (!completedFile?.hash) {
      toast.error('No file hash available')
      return
    }

    setHashInput(completedFile.hash)
    
    setIsVerifying(true)
    
    try {
      const exists = await checkDocumentExists(completedFile.hash)
      let details = null
      
      if (exists) {
        details = await getDocumentDetails(completedFile.hash)
      }

      const result: VerificationResult = {
        exists,
        hash: completedFile.hash,
        blockNumber: details?.blockNumber,
        timestamp: details?.timestamp ? Number(details.timestamp) * 1000 : undefined,
        explorerUrl: details?.explorerUrl,
      }

      setVerificationResult(result)
      
      if (exists) {
        toast.success(`${completedFile.file.name} found on blockchain!`)
      } else {
        toast.error(`${completedFile.file.name} not found on blockchain`)
      }
      
    } catch (error) {
      console.error('Verification failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Verification failed'
      
      setVerificationResult({
        exists: false,
        hash: completedFile.hash,
        error: errorMessage,
      })
      
      toast.error(`Verification failed: ${errorMessage}`)
    } finally {
      setIsVerifying(false)
    }
  }, [files, checkDocumentExists, getDocumentDetails])

  const completedFile = files.find((f: ProcessedFile) => f.status === 'completed')

  return (
    <Card className={`legal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Document Verification
        </CardTitle>
        <CardDescription>
          Verify if a document has been notarized on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {!isConnected && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to verify documents on the blockchain
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="hash" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hash">Verify by Hash</TabsTrigger>
            <TabsTrigger value="upload">Upload & Verify</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hash" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hash-input">Document Hash (SHA-256)</Label>
              <div className="flex gap-2">
                <Input
                  id="hash-input"
                  placeholder="Enter SHA-256 hash (64 hexadecimal characters)"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="font-mono text-sm"
                  disabled={isVerifying}
                />
                <Button 
                  onClick={verifyByHash}
                  disabled={isVerifying || !isConnected || !hashInput.trim()}
                  className="shrink-0"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-legal-accent bg-legal-accent/5' 
                  : 'border-legal-border hover:border-legal-accent/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-8 w-8 mx-auto mb-3 text-legal-secondary" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-legal-dark-text">
                  Drop a file here or click to select
                </p>
                <p className="text-xs text-legal-secondary">
                  We'll generate the hash and check if it exists on blockchain
                </p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload-verify"
                  disabled={isProcessing}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload-verify')?.click()}
                  disabled={isProcessing}
                >
                  Select File
                </Button>
              </div>
            </div>

            {/* File Processing Status */}
            {isProcessing && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-blue-700">Generating hash...</span>
              </div>
            )}

            {/* Completed File */}
            {completedFile && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium text-green-800">
                        {completedFile.file.name}
                      </div>
                      <div className="text-xs font-mono text-green-600">
                        {completedFile.hash?.slice(0, 16)}...
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={verifyUploadedFile}
                  disabled={isVerifying || !isConnected}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying on Blockchain...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify on Blockchain
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Verification Result */}
        {verificationResult && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              verificationResult.exists 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.exists ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                )}
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className={`font-semibold ${
                      verificationResult.exists ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {verificationResult.exists 
                        ? 'Document Found on Blockchain!' 
                        : 'Document Not Found'
                      }
                    </h3>
                    <p className={`text-sm ${
                      verificationResult.exists ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationResult.exists 
                        ? 'This document has been verified and exists on the blockchain.' 
                        : 'This document hash was not found in the blockchain records.'
                      }
                    </p>
                  </div>

                  {/* Hash Display */}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Document Hash:</span>
                    <code className="block text-xs font-mono p-2 bg-gray-100 rounded break-all">
                      {verificationResult.hash}
                    </code>
                  </div>

                  {/* Blockchain Details */}
                  {verificationResult.exists && (
                    <div className="grid gap-3 mt-3">
                      {verificationResult.blockNumber && (
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Block: {verificationResult.blockNumber.toString()}
                          </span>
                        </div>
                      )}
                      
                      {verificationResult.timestamp && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Notarized: {new Date(verificationResult.timestamp).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {verificationResult.explorerUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="self-start"
                        >
                          <a 
                            href={verificationResult.explorerUrl} 
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

                  {/* Error Display */}
                  {verificationResult.error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {verificationResult.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-legal-secondary space-y-1">
          <p>
            <strong>How verification works:</strong> We check if the document hash exists in our blockchain registry.
          </p>
          <p>
            A verified document proves that the exact file existed at the time of notarization.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
'use client'

import React, { useState, useEffect } from 'react'
import { Hash, Shield, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { WalletConnect } from '@/components/wallet-connect'
import { FileDropzone } from '@/components/notary/file-dropzone'
import { HashDisplay } from '@/components/notary/hash-display'
import { TransactionStatus } from '@/components/notary/transaction-status'
import { DocumentVerifier } from '@/components/notary/document-verifier'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import type { ProcessedFile } from '@/hooks/use-file-hasher'

export default function NotaryPage() {
  const { isConnected } = useAccount()
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null)
  const [notarizedHashes, setNotarizedHashes] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileProcessed = (file: ProcessedFile) => {
    setProcessedFiles(prev => {
      const existing = prev.find(f => f.id === file.id)
      if (existing) {
        return prev.map(f => f.id === file.id ? file : f)
      }
      return [...prev, file]
    })

    if (file.status === 'completed' && !selectedFile) {
      setSelectedFile(file)
    }

    toast.success(`Hash generated for ${file.file.name}`)
  }

  const handleAllFilesProcessed = (files: ProcessedFile[]) => {
    setProcessedFiles(files)
    const completedFiles = files.filter(f => f.status === 'completed')
    
    if (completedFiles.length > 0) {
      toast.success(`All ${completedFiles.length} files processed successfully!`)
    }
  }

  const handleError = (error: string) => {
    toast.error(error)
  }

  const handleTransactionComplete = (txHash: string) => {
    if (selectedFile?.hash) {
      setNotarizedHashes(prev => new Set([...prev, selectedFile.hash!]))
      toast.success('Document successfully notarized on blockchain!')
    }
  }

  const completedFiles = processedFiles?.filter(f => f.status === 'completed') || []
  const hasCompletedFiles = completedFiles.length > 0
  const isSelectedFileNotarized = selectedFile?.hash ? notarizedHashes.has(selectedFile.hash) : false

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-legal-accent rounded-lg">
            <Hash className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-legal-dark-text font-playfair">
              Document Notarization
            </h1>
            <p className="text-legal-secondary">
              Loading...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-legal-accent rounded-lg">
            <Hash className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-legal-dark-text font-playfair">
              Document Notarization
            </h1>
            <p className="text-legal-secondary">
              Generate cryptographic proofs of your documents on the blockchain
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="legal-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-legal-accent" />
                <div>
                  <h3 className="font-semibold text-legal-dark-text">Tamper-Proof</h3>
                  <p className="text-sm text-legal-secondary">
                    SHA-256 cryptographic hashing ensures document integrity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-legal-accent" />
                <div>
                  <h3 className="font-semibold text-legal-dark-text">Timestamped</h3>
                  <p className="text-sm text-legal-secondary">
                    Blockchain timestamps prove when documents existed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Hash className="h-8 w-8 text-legal-accent" />
                <div>
                  <h3 className="font-semibold text-legal-dark-text">Verifiable</h3>
                  <p className="text-sm text-legal-secondary">
                    Anyone can verify document authenticity using the hash
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="bg-legal-border" />

      {/* Wallet Connection Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-legal-dark-text">
          Step 1: Connect Your Wallet
        </h2>
        
        <WalletConnect />

        {isConnected && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Wallet connected successfully! You can now generate document hashes and notarize them on blockchain.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Separator className="bg-legal-border" />

      {/* File Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-legal-dark-text">
            Step 2: Upload Documents
          </h2>
          {hasCompletedFiles && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {completedFiles.length} file{completedFiles.length !== 1 ? 's' : ''} processed
            </Badge>
          )}
        </div>

        <FileDropzone
          onFileProcessed={handleFileProcessed}
          onFilesProcessed={handleAllFilesProcessed}
          onError={handleError}
          maxFiles={10}
          maxFileSize={25 * 1024 * 1024}
        />
      </div>

      {/* Hash Display Section */}
      {hasCompletedFiles && (
        <>
          <Separator className="bg-legal-border" />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-legal-dark-text">
              Step 3: Document Hashes
            </h2>

            {/* File Selector for Multiple Files */}
            {completedFiles.length > 1 && (
              <Card className="legal-card">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-legal-dark-text">Select a file to view details:</h3>
                    <div className="grid gap-2">
                      {completedFiles.map((file) => (
                        <Button
                          key={file.id}
                          variant={selectedFile?.id === file.id ? "default" : "outline"}
                          className="justify-start h-auto p-3"
                          onClick={() => setSelectedFile(file)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="text-left">
                              <div className="font-medium">{file.file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {file.hash?.slice(0, 16)}...
                              </div>
                            </div>
                            {file.hash && notarizedHashes.has(file.hash) && (
                              <Badge className="bg-green-100 text-green-800 ml-2">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Notarized
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected File Hash Display */}
            {selectedFile && selectedFile.hash && (
              <div className="grid lg:grid-cols-2 gap-6">
                <HashDisplay
                  hash={selectedFile.hash}
                  fileName={selectedFile.file.name}
                  fileSize={selectedFile.file.size}
                  processingTime={selectedFile.processingTime}
                  ipfsCID={selectedFile.ipfsCID}
                  ipfsUrl={selectedFile.ipfsUrl}
                />

                {/* Blockchain Notarization */}
                {isConnected && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-legal-dark-text">
                      Step 4: Blockchain Notarization
                    </h3>
                    
                    {isSelectedFileNotarized ? (
                      <Card className="legal-card border-green-200 bg-green-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                            <div>
                              <h4 className="font-semibold text-green-800">Successfully Notarized!</h4>
                              <p className="text-sm text-green-600">
                                This document has been permanently recorded on the blockchain.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <TransactionStatus
                        fileHash={selectedFile.hash}
                        fileName={selectedFile.file.name}
                        onTransactionComplete={handleTransactionComplete}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Help Section */}
      <Card className="legal-card">
        <CardHeader>
          <CardTitle>How Document Notarization Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-legal-dark-text mb-2">File Hashing</h4>
              <p className="text-sm text-legal-secondary">
                SHA-256 algorithm creates a unique fingerprint of your document. 
                Even tiny changes result in completely different hashes.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-legal-dark-text mb-2">Blockchain Storage</h4>
              <p className="text-sm text-legal-secondary">
                Hashes are stored on Base blockchain, creating an immutable, 
                timestamped record that proves document existence.
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="mt-6 p-4 bg-legal-beige/30 rounded-lg">
            <h4 className="font-medium text-legal-dark-text mb-3">Complete Process:</h4>
            <div className="space-y-2 text-sm text-legal-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-legal-accent rounded-full"></div>
                <span>Upload document → Generate SHA-256 hash locally</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-legal-accent rounded-full"></div>
                <span>Connect wallet → Estimate gas costs for transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-legal-accent rounded-full"></div>
                <span>Submit transaction → Store hash on Base blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-legal-accent rounded-full"></div>
                <span>Receive confirmation → Permanent proof established</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-legal-border" />

      {/* Document Verification Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-legal-dark-text">
          Document Verification
        </h2>
        <p className="text-legal-secondary">
          Verify if a document has been previously notarized on the blockchain by checking its hash.
        </p>
        
        <DocumentVerifier />
      </div>
    </div>
  )
}
 
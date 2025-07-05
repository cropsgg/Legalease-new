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
      <div className="min-h-screen bg-gradient-to-br from-legal-beige/20 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-legal-accent rounded-xl shadow-lg">
                <Hash className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-legal-dark-text font-playfair">
                  Document Notarization
                </h1>
                <p className="text-legal-secondary text-lg">
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-legal-beige/20 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16">
          {/* Header */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-legal-accent rounded-xl shadow-lg">
                <Hash className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-legal-dark-text font-playfair">
                  Document Notarization
                </h1>
                <p className="text-legal-secondary text-lg mt-2">
                  Generate cryptographic proofs of your documents on the blockchain
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="legal-card hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-legal-accent/10 rounded-xl">
                      <Shield className="h-8 w-8 text-legal-accent" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-legal-dark-text text-lg">Tamper-Proof</h3>
                      <p className="text-sm text-legal-secondary leading-relaxed">
                        SHA-256 cryptographic hashing ensures document integrity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-legal-accent/10 rounded-xl">
                      <Clock className="h-8 w-8 text-legal-accent" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-legal-dark-text text-lg">Timestamped</h3>
                      <p className="text-sm text-legal-secondary leading-relaxed">
                        Blockchain timestamps prove when documents existed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-legal-accent/10 rounded-xl">
                      <Hash className="h-8 w-8 text-legal-accent" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-legal-dark-text text-lg">Verifiable</h3>
                      <p className="text-sm text-legal-secondary leading-relaxed">
                        Anyone can verify document authenticity using the hash
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="bg-legal-border h-px" />

          {/* Wallet Connection Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-semibold text-legal-dark-text">
                Step 1: Connect Your Wallet
              </h2>
              <p className="text-legal-secondary">
                Connect your Web3 wallet to enable blockchain transactions
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-legal-border">
              <WalletConnect />
            </div>

            {isConnected && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  Wallet connected successfully! You can now generate document hashes and notarize them on blockchain.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator className="bg-legal-border h-px" />

          {/* File Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-semibold text-legal-dark-text">
                  Step 2: Upload Documents
                </h2>
                <p className="text-legal-secondary">
                  Upload your documents to generate cryptographic hashes
                </p>
              </div>
              {hasCompletedFiles && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
                  {completedFiles.length} file{completedFiles.length !== 1 ? 's' : ''} processed
                </Badge>
              )}
            </div>

            <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-legal-border">
              <FileDropzone
                onFileProcessed={handleFileProcessed}
                onFilesProcessed={handleAllFilesProcessed}
                onError={handleError}
                maxFiles={10}
                maxFileSize={25 * 1024 * 1024}
              />
            </div>
          </div>

          {/* Hash Display Section */}
          {hasCompletedFiles && (
            <>
              <Separator className="bg-legal-border h-px" />

              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-legal-dark-text">
                    Step 3: Document Hashes
                  </h2>
                  <p className="text-legal-secondary">
                    Review and manage your document hashes
                  </p>
                </div>

                {/* File Selector for Multiple Files */}
                {completedFiles.length > 1 && (
                  <Card className="legal-card">
                    <CardContent className="p-6 lg:p-8">
                      <div className="space-y-4">
                        <h3 className="font-medium text-legal-dark-text text-lg">Select a file to view details:</h3>
                        <div className="grid gap-3">
                          {completedFiles.map((file) => (
                            <Button
                              key={file.id}
                              variant={selectedFile?.id === file.id ? "default" : "outline"}
                              className="justify-start h-auto p-4 text-left"
                              onClick={() => setSelectedFile(file)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="text-left">
                                  <div className="font-medium">{file.file.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {file.hash?.slice(0, 16)}...
                                  </div>
                                </div>
                                {file.hash && notarizedHashes.has(file.hash) && (
                                  <Badge className="bg-green-100 text-green-800 ml-3 px-3 py-1">
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
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <HashDisplay
                        hash={selectedFile.hash}
                        fileName={selectedFile.file.name}
                        fileSize={selectedFile.file.size}
                        processingTime={selectedFile.processingTime}
                        ipfsCID={selectedFile.ipfsCID}
                        ipfsUrl={selectedFile.ipfsUrl}
                      />
                    </div>

                    {/* Blockchain Notarization */}
                    {isConnected && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-xl lg:text-2xl font-semibold text-legal-dark-text">
                            Step 4: Blockchain Notarization
                          </h3>
                          <p className="text-legal-secondary">
                            Permanently record your document hash on the blockchain
                          </p>
                        </div>

                        {isSelectedFileNotarized ? (
                          <Card className="legal-card border-green-200 bg-green-50">
                            <CardContent className="p-6 lg:p-8">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-green-800 text-lg">Successfully Notarized!</h4>
                                  <p className="text-sm text-green-600 leading-relaxed">
                                    This document has been permanently recorded on the blockchain.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-legal-border">
                            <TransactionStatus
                              fileHash={selectedFile.hash}
                              fileName={selectedFile.file.name}
                              onTransactionComplete={handleTransactionComplete}
                            />
                          </div>
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
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl lg:text-3xl">How Document Notarization Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-medium text-legal-dark-text text-lg">File Hashing</h4>
                  <p className="text-sm text-legal-secondary leading-relaxed">
                    SHA-256 algorithm creates a unique fingerprint of your document.
                    Even tiny changes result in completely different hashes.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-legal-dark-text text-lg">Blockchain Storage</h4>
                  <p className="text-sm text-legal-secondary leading-relaxed">
                    Hashes are stored on Base blockchain, creating an immutable,
                    timestamped record that proves document existence.
                  </p>
                </div>
              </div>

              {/* Process Steps */}
              <div className="p-6 lg:p-8 bg-legal-beige/30 rounded-xl">
                <h4 className="font-medium text-legal-dark-text text-lg mb-4">Complete Process:</h4>
                <div className="space-y-3 text-sm text-legal-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-legal-accent rounded-full flex-shrink-0"></div>
                    <span className="leading-relaxed">Upload document → Generate SHA-256 hash locally</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-legal-accent rounded-full flex-shrink-0"></div>
                    <span className="leading-relaxed">Connect wallet → Estimate gas costs for transaction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-legal-accent rounded-full flex-shrink-0"></div>
                    <span className="leading-relaxed">Submit transaction → Store hash on Base blockchain</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-legal-accent rounded-full flex-shrink-0"></div>
                    <span className="leading-relaxed">Receive confirmation → Permanent proof established</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-legal-border h-px" />

          {/* Document Verification Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-semibold text-legal-dark-text">
                Document Verification
              </h2>
              <p className="text-legal-secondary text-lg">
                Verify if a document has been previously notarized on the blockchain by checking its hash.
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-legal-border">
              <DocumentVerifier />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

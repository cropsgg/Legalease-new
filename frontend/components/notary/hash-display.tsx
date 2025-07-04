'use client'

import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface HashDisplayProps {
  hash: string
  fileName: string
  fileSize: number
  processingTime?: number
  ipfsCID?: string
  ipfsUrl?: string
  className?: string
  variant?: 'default' | 'compact'
}

export function HashDisplay({
  hash,
  fileName,
  fileSize,
  processingTime,
  ipfsCID,
  ipfsUrl,
  className,
  variant = 'default',
}: HashDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [ipfsCopied, setIpfsCopied] = useState(false)

  const copyToClipboard = async (text: string, type: 'hash' | 'ipfs') => {
    try {
      await navigator.clipboard.writeText(text)
      
      if (type === 'hash') {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Hash copied to clipboard')
      } else {
        setIpfsCopied(true)
        setTimeout(() => setIpfsCopied(false), 2000)
        toast.success('IPFS CID copied to clipboard')
      }
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (variant === 'compact') {
    return (
      <div className={cn('p-3 border border-legal-border rounded-lg bg-legal-beige/30', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Hash className="h-4 w-4 text-legal-secondary" />
            <span className="font-mono text-sm text-legal-dark-text truncate">
              {hash}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(hash, 'hash')}
            className="text-legal-secondary hover:text-legal-dark-text"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn('legal-card', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Document Hash Generated
        </CardTitle>
        <CardDescription>
          SHA-256 hash for file: {fileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Information */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-legal-beige/50 rounded-lg">
          <div>
            <span className="text-sm font-medium text-legal-secondary">File Size</span>
            <div className="text-sm text-legal-dark-text">{formatFileSize(fileSize)}</div>
          </div>
          {processingTime && (
            <div>
              <span className="text-sm font-medium text-legal-secondary">Processing Time</span>
              <div className="text-sm text-legal-dark-text">{processingTime.toFixed(0)}ms</div>
            </div>
          )}
        </div>

        {/* Hash Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-legal-secondary">SHA-256 Hash</span>
            <Badge variant="outline" className="text-xs">
              64 characters
            </Badge>
          </div>
          <div className="flex items-center gap-2 p-3 bg-legal-beige rounded-lg border">
            <code className="flex-1 text-sm font-mono text-legal-dark-text break-all">
              {hash}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(hash, 'hash')}
              className="text-legal-secondary hover:text-legal-dark-text shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(hash, 'hash')}
            className="flex-1"
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Hash'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

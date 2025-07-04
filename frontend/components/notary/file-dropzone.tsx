'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, X, Hash, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFileHasher, type ProcessedFile } from '@/hooks/use-file-hasher'
import { formatFileSize } from '@/lib/file-utils/file-validator'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  onFilesProcessed?: (files: ProcessedFile[]) => void
  onFileProcessed?: (file: ProcessedFile) => void
  onError?: (error: string) => void
  enableIPFS?: boolean
  maxFiles?: number
  maxFileSize?: number
  disabled?: boolean
  className?: string
}

export function FileDropzone({
  onFilesProcessed,
  onFileProcessed,
  onError,
  enableIPFS = false,
  maxFiles = 10,
  maxFileSize = 25 * 1024 * 1024, // 25MB
  disabled = false,
  className,
}: FileDropzoneProps) {
  const {
    files,
    stats,
    isProcessing,
    processFiles,
    clearFiles,
    removeFile,
    canAddFiles,
    hasErrors,
    isComplete,
  } = useFileHasher({
    enableIPFS,
    maxFiles,
    maxFileSize,
    onFileProcessed: onFileProcessed,
    onAllFilesProcessed: onFilesProcessed,
    onError: onError,
  })

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
      ).join('\n')
      onError?.(errors)
      return
    }

    if (acceptedFiles.length > 0) {
      processFiles(acceptedFiles)
    }
  }, [processFiles, onError])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    disabled: disabled || isProcessing || !canAddFiles,
    maxFiles: maxFiles - files.length,
    maxSize: maxFileSize,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
  })

  const getDropzoneStatus = () => {
    if (isDragReject) return 'reject'
    if (isDragAccept) return 'accept'
    if (isDragActive) return 'active'
    return 'idle'
  }

  const dropzoneStatus = getDropzoneStatus()

  return (
    <div className={cn('space-y-6', className)}>
      {/* File Upload Area */}
      <Card className="legal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Document Upload & Hashing
          </CardTitle>
          <CardDescription>
            Drag and drop files to generate SHA-256 hashes for blockchain notarization
            {enableIPFS && ' with optional IPFS backup'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
              'hover:bg-legal-beige/50 focus:outline-none focus:ring-2 focus:ring-legal-brown focus:ring-offset-2',
              {
                'border-legal-brown bg-legal-beige/30': dropzoneStatus === 'idle',
                'border-blue-500 bg-blue-50 text-blue-700': dropzoneStatus === 'active',
                'border-green-500 bg-green-50 text-green-700': dropzoneStatus === 'accept',
                'border-red-500 bg-red-50 text-red-700': dropzoneStatus === 'reject',
                'opacity-50 cursor-not-allowed': disabled || isProcessing || !canAddFiles,
              }
            )}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className={cn(
                  'h-12 w-12',
                  {
                    'text-legal-secondary': dropzoneStatus === 'idle',
                    'text-blue-500': dropzoneStatus === 'active',
                    'text-green-500': dropzoneStatus === 'accept',
                    'text-red-500': dropzoneStatus === 'reject',
                  }
                )} />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-legal-dark-text">
                  {isDragActive
                    ? 'Drop files here...'
                    : 'Drag & drop files here, or click to select'
                  }
                </h3>
                <p className="text-sm text-legal-secondary mt-2">
                  Supports PDF, DOC, DOCX, TXT, JPG, PNG, WEBP
                </p>
                <p className="text-xs text-legal-secondary mt-1">
                  Max {maxFiles} files, {formatFileSize(maxFileSize)} each
                </p>
              </div>

              {!canAddFiles && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Maximum number of files ({maxFiles}) reached
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-legal-beige rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Processing files...</span>
              </div>
              <Progress 
                value={(stats.completedFiles + stats.errorFiles) / stats.totalFiles * 100} 
                className="h-2"
              />
              <p className="text-xs text-legal-secondary mt-1">
                {stats.completedFiles + stats.errorFiles} of {stats.totalFiles} files processed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="legal-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Uploaded Files ({files.length})</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFiles}
                disabled={isProcessing}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  onRemove={() => removeFile(file.id)}
                  disabled={isProcessing}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {stats.totalFiles > 0 && (
        <Card className="legal-card">
          <CardHeader>
            <CardTitle>Processing Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-legal-dark-text">{stats.totalFiles}</div>
                <div className="text-sm text-legal-secondary">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedFiles}</div>
                <div className="text-sm text-legal-secondary">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.errorFiles}</div>
                <div className="text-sm text-legal-secondary">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-legal-accent">
                  {formatFileSize(stats.totalSize)}
                </div>
                <div className="text-sm text-legal-secondary">Total Size</div>
              </div>
            </div>
            
            {isComplete && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    All files processed successfully! Average processing time: {stats.averageProcessingTime.toFixed(0)}ms
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Individual file item component
interface FileItemProps {
  file: ProcessedFile
  onRemove: () => void
  disabled: boolean
}

function FileItem({ file, onRemove, disabled }: FileItemProps) {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'pending':
        return <FileText className="h-4 w-4 text-legal-secondary" />
      case 'hashing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = () => {
    const variants = {
      pending: 'secondary',
      hashing: 'default',
      uploading: 'default',
      completed: 'default',
      error: 'destructive',
    } as const

    return (
      <Badge variant={variants[file.status]} className="text-xs">
        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 border border-legal-border rounded-lg hover:bg-legal-beige/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-legal-dark-text truncate">
              {file.file.name}
            </span>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-legal-secondary">
              {formatFileSize(file.file.size)}
            </span>
            {file.processingTime && (
              <span className="text-xs text-legal-secondary">
                {file.processingTime.toFixed(0)}ms
              </span>
            )}
            {file.hash && (
              <span className="text-xs font-mono text-legal-accent truncate max-w-32">
                {file.hash.slice(0, 10)}...{file.hash.slice(-8)}
              </span>
            )}
          </div>
          {file.error && (
            <div className="text-xs text-red-600 mt-1">{file.error}</div>
          )}
          {file.ipfsCID && (
            <div className="text-xs text-purple-600 mt-1">
              IPFS: {file.ipfsCID.slice(0, 10)}...
            </div>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={disabled}
        className="text-legal-secondary hover:text-red-600 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
} 
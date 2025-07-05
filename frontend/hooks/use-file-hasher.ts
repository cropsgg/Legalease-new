'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { validateFiles, createFileId, formatFileSize, type FileValidationResult } from '@/lib/file-utils/file-validator'
import { uploadToIPFS, type IPFSUploadResult, ipfsConfig } from '@/lib/file-utils/ipfs-utils'
import type { HashWorkerMessage, HashWorkerResponse } from '@/lib/workers/hash-worker'

export interface ProcessedFile {
  id: string
  file: File
  hash?: string
  ipfsCID?: string
  ipfsUrl?: string
  status: 'pending' | 'hashing' | 'uploading' | 'completed' | 'error'
  validation: FileValidationResult
  processingTime?: number
  error?: string
  progress?: number
}

export interface FileHasherStats {
  totalFiles: number
  completedFiles: number
  errorFiles: number
  totalSize: number
  totalProcessingTime: number
  averageFileSize: number
  averageProcessingTime: number
}

export interface UseFileHasherOptions {
  enableIPFS: boolean
  maxFiles: number
  maxFileSize: number
  enableWebWorkers: boolean
  onFileProcessed?: (file: ProcessedFile) => void
  onAllFilesProcessed?: (files: ProcessedFile[]) => void
  onError?: (error: string, file?: ProcessedFile) => void
}

const DEFAULT_OPTIONS: UseFileHasherOptions = {
  enableIPFS: false,
  maxFiles: 10,
  maxFileSize: 25 * 1024 * 1024, // 25MB
  enableWebWorkers: true,
  onFileProcessed: undefined,
  onAllFilesProcessed: undefined,
  onError: undefined,
}

export function useFileHasher(options: Partial<UseFileHasherOptions> = {}) {
  // Memoize options to prevent infinite re-renders
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [
    options.enableIPFS,
    options.maxFiles,
    options.maxFileSize,
    options.enableWebWorkers,
    options.onFileProcessed,
    options.onAllFilesProcessed,
    options.onError,
  ])

  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<FileHasherStats>({
    totalFiles: 0,
    completedFiles: 0,
    errorFiles: 0,
    totalSize: 0,
    totalProcessingTime: 0,
    averageFileSize: 0,
    averageProcessingTime: 0,
  })

  const workersRef = useRef<Worker[]>([])
  const processingQueueRef = useRef<ProcessedFile[]>([])

  // Initialize Web Workers
  const initializeWorkers = useCallback(() => {
    if (!opts.enableWebWorkers || typeof Worker === 'undefined') {
      return
    }

    // Create workers (typically 2-4 workers for parallel processing)
    const workerCount = Math.min(4, navigator.hardwareConcurrency || 2)

    for (let i = 0; i < workerCount; i++) {
      try {
        const worker = new Worker(
          new URL('../lib/workers/hash-worker.ts', import.meta.url),
          { type: 'module' }
        )

        worker.onmessage = handleWorkerMessage
        worker.onerror = (error) => {
          console.error('Worker error:', error)
          opts.onError?.('Web Worker error occurred')
        }

        workersRef.current.push(worker)
      } catch (error) {
        console.warn('Failed to create Web Worker:', error)
      }
    }
  }, [opts.enableWebWorkers, opts.onError])

  // Clean up workers
  const cleanupWorkers = useCallback(() => {
    workersRef.current.forEach(worker => worker.terminate())
    workersRef.current = []
  }, [])

  // Handle worker messages
  const handleWorkerMessage = useCallback((event: MessageEvent<HashWorkerResponse>) => {
    const response = event.data

    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file.id === response.id) {
          if (response.success) {
            const updatedFile = {
              ...file,
              hash: response.hash,
              status: opts.enableIPFS ? 'uploading' as const : 'completed' as const,
              processingTime: response.processingTime,
            }

            // If IPFS is enabled, start IPFS upload
            if (opts.enableIPFS) {
              handleIPFSUpload(updatedFile)
            } else {
              opts.onFileProcessed?.(updatedFile)
            }

            return updatedFile
          } else {
            const errorFile = {
              ...file,
              status: 'error' as const,
              error: response.error || 'Hashing failed',
              processingTime: response.processingTime,
            }

            opts.onError?.(response.error || 'Hashing failed', errorFile)
            return errorFile
          }
        }
        return file
      })
    )
  }, [opts.enableIPFS, opts.onFileProcessed, opts.onError])

  // Handle IPFS upload
  const handleIPFSUpload = useCallback(async (file: ProcessedFile) => {
    try {
      const ipfsResult = await uploadToIPFS(file.file, ipfsConfig)

      setFiles(prevFiles =>
        prevFiles.map(f => {
          if (f.id === file.id) {
            const updatedFile = {
              ...f,
              status: 'completed' as const,
              ipfsCID: ipfsResult.cid,
              ipfsUrl: ipfsResult.url,
            }

            opts.onFileProcessed?.(updatedFile)
            return updatedFile
          }
          return f
        })
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'IPFS upload failed'

      setFiles(prevFiles =>
        prevFiles.map(f => {
          if (f.id === file.id) {
            const errorFile = {
              ...f,
              status: 'error' as const,
              error: errorMessage,
            }

            opts.onError?.(errorMessage, errorFile)
            return errorFile
          }
          return f
        })
      )
    }
  }, [opts.onFileProcessed, opts.onError])

  // Hash file using Web Crypto API (fallback when Web Workers are not available)
  const hashFileDirectly = useCallback(async (file: File): Promise<string> => {
    const startTime = performance.now()

    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const processingTime = performance.now() - startTime
    console.log(`Direct hash completed in ${processingTime.toFixed(2)}ms`)

    return `0x${hashHex}`
  }, [])

  // Process files using Web Workers or direct hashing
  const processFiles = useCallback(async (inputFiles: File[]) => {
    if (inputFiles.length === 0) return

    setIsProcessing(true)

    // Validate files
    const validation = validateFiles(inputFiles, {
      maxSizeBytes: opts.maxFileSize,
      maxFiles: opts.maxFiles,
      allowedTypes: [],
      allowedExtensions: [],
      requireValidExtension: false,
    })

    if (!validation.overallValid) {
      const errorMessage = [
        ...validation.globalErrors,
        ...validation.results.flatMap(r => r.errors)
      ].join(', ')

      opts.onError?.(errorMessage)
      setIsProcessing(false)
      return
    }

    // Create processed file objects
    const processedFiles: ProcessedFile[] = inputFiles.map((file, index) => ({
      id: createFileId(file),
      file,
      status: 'pending',
      validation: validation.results[index],
    }))

    setFiles(processedFiles)

    // Process files
    if (opts.enableWebWorkers && workersRef.current.length > 0) {
      // Use Web Workers for parallel processing
      processedFiles.forEach((processedFile, index) => {
        const worker = workersRef.current[index % workersRef.current.length]

        setFiles(prev =>
          prev.map(f => f.id === processedFile.id ? { ...f, status: 'hashing' } : f)
        )

        const message: HashWorkerMessage = {
          id: processedFile.id,
          file: processedFile.file.arrayBuffer() as any, // This will be converted
          fileName: processedFile.file.name,
          fileSize: processedFile.file.size,
        }

        // Convert file to ArrayBuffer before sending to worker
        processedFile.file.arrayBuffer().then(buffer => {
          worker.postMessage({ ...message, file: buffer })
        })
      })
    } else {
      // Fallback to direct processing
      for (const processedFile of processedFiles) {
        try {
          setFiles(prev =>
            prev.map(f => f.id === processedFile.id ? { ...f, status: 'hashing' } : f)
          )

          const hash = await hashFileDirectly(processedFile.file)

          setFiles(prev =>
            prev.map(f => {
              if (f.id === processedFile.id) {
                const updatedFile = {
                  ...f,
                  hash,
                  status: opts.enableIPFS ? 'uploading' as const : 'completed' as const,
                }

                if (!opts.enableIPFS) {
                  opts.onFileProcessed?.(updatedFile)
                }

                return updatedFile
              }
              return f
            })
          )

          // Handle IPFS upload if enabled
          if (opts.enableIPFS) {
            const currentFile = processedFiles.find(f => f.id === processedFile.id)
            if (currentFile) {
              await handleIPFSUpload({ ...currentFile, hash })
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Processing failed'

          setFiles(prev =>
            prev.map(f => {
              if (f.id === processedFile.id) {
                const errorFile = {
                  ...f,
                  status: 'error' as const,
                  error: errorMessage,
                }

                opts.onError?.(errorMessage, errorFile)
                return errorFile
              }
              return f
            })
          )
        }
      }
    }

    setIsProcessing(false)
  }, [opts.maxFileSize, opts.maxFiles, opts.enableWebWorkers, opts.enableIPFS, opts.onError, opts.onFileProcessed, hashFileDirectly, handleIPFSUpload])

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles([])
    setStats({
      totalFiles: 0,
      completedFiles: 0,
      errorFiles: 0,
      totalSize: 0,
      totalProcessingTime: 0,
      averageFileSize: 0,
      averageProcessingTime: 0,
    })
  }, [])

  // Remove specific file
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }, [])

  // Update stats when files change
  useEffect(() => {
    const totalFiles = files.length
    const completedFiles = files.filter(f => f.status === 'completed').length
    const errorFiles = files.filter(f => f.status === 'error').length
    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0)
    const totalProcessingTime = files.reduce((sum, f) => sum + (f.processingTime || 0), 0)

    setStats({
      totalFiles,
      completedFiles,
      errorFiles,
      totalSize,
      totalProcessingTime,
      averageFileSize: totalFiles > 0 ? totalSize / totalFiles : 0,
      averageProcessingTime: completedFiles > 0 ? totalProcessingTime / completedFiles : 0,
    })

    // Check if all files are processed
    if (totalFiles > 0 && completedFiles + errorFiles === totalFiles) {
      opts.onAllFilesProcessed?.(files)
    }
  }, [files, opts.onAllFilesProcessed])

  // Initialize workers on mount
  useEffect(() => {
    initializeWorkers()
    return cleanupWorkers
  }, [initializeWorkers, cleanupWorkers])

  return {
    files,
    stats,
    isProcessing,
    processFiles,
    clearFiles,
    removeFile,
    // Utility functions
    canAddFiles: files.length < opts.maxFiles,
    hasErrors: stats.errorFiles > 0,
    isComplete: stats.totalFiles > 0 && stats.completedFiles + stats.errorFiles === stats.totalFiles,
    // Configuration
    options: opts,
  }
}

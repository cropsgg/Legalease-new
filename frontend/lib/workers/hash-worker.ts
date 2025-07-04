// Web Worker for SHA-256 file hashing
// This runs in a separate thread to avoid blocking the main UI

export interface HashWorkerMessage {
  id: string
  file: ArrayBuffer
  fileName: string
  fileSize: number
}

export interface HashWorkerResponse {
  id: string
  hash: string
  fileName: string
  fileSize: number
  processingTime: number
  success: boolean
  error?: string
}

// Detect if we're in a Web Worker context
const isWebWorker = typeof self !== 'undefined' && 
  typeof self.postMessage === 'function' && 
  typeof self.onmessage !== 'undefined'

if (isWebWorker) {
  // We're in a Web Worker context
  self.onmessage = async (event: MessageEvent<HashWorkerMessage>) => {
    const { id, file, fileName, fileSize } = event.data
    const startTime = performance.now()

    try {
      // Generate SHA-256 hash using Web Crypto API
      const hashBuffer = await crypto.subtle.digest('SHA-256', file)
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      const processingTime = performance.now() - startTime

      const response: HashWorkerResponse = {
        id,
        hash: `0x${hashHex}`,
        fileName,
        fileSize,
        processingTime,
        success: true,
      }

      self.postMessage(response)
    } catch (error) {
      const processingTime = performance.now() - startTime
      
      const response: HashWorkerResponse = {
        id,
        hash: '',
        fileName,
        fileSize,
        processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }

      self.postMessage(response)
    }
  }

  // Handle worker errors
  self.onerror = (error) => {
    console.error('Hash Worker Error:', error)
  }
} 
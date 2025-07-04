// IPFS utilities for optional file backup
// This is a placeholder implementation that can be replaced with a proper IPFS client

export interface IPFSUploadResult {
  success: boolean
  cid?: string
  url?: string
  error?: string
  uploadTime?: number
}

export interface IPFSConfig {
  enabled: boolean
  gateway: string
  apiEndpoint?: string
  authToken?: string
}

// Default IPFS configuration
export const DEFAULT_IPFS_CONFIG: IPFSConfig = {
  enabled: false, // Disabled by default
  gateway: 'https://ipfs.io/ipfs/',
  apiEndpoint: 'https://api.web3.storage',
}

/**
 * Uploads a file to IPFS
 * This is a placeholder implementation - replace with actual IPFS client
 */
export async function uploadToIPFS(
  file: File,
  config: IPFSConfig = DEFAULT_IPFS_CONFIG
): Promise<IPFSUploadResult> {
  const startTime = performance.now()

  try {
    // Check if IPFS is enabled
    if (!config.enabled) {
      return {
        success: false,
        error: 'IPFS upload is disabled',
      }
    }

    // Check if auth token is available
    if (!config.authToken) {
      return {
        success: false,
        error: 'IPFS auth token not configured',
      }
    }

    // Simulate IPFS upload (replace with actual implementation)
    console.log('IPFS Upload (Simulated):', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })

    // For now, generate a mock CID
    // In real implementation, this would upload to IPFS and return actual CID
    const mockCID = generateMockCID(file)
    const uploadTime = performance.now() - startTime

    return {
      success: true,
      cid: mockCID,
      url: `${config.gateway}${mockCID}`,
      uploadTime,
    }
  } catch (error) {
    const uploadTime = performance.now() - startTime
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown IPFS upload error',
      uploadTime,
    }
  }
}

/**
 * Uploads multiple files to IPFS
 */
export async function uploadMultipleToIPFS(
  files: File[],
  config: IPFSConfig = DEFAULT_IPFS_CONFIG
): Promise<IPFSUploadResult[]> {
  // Upload files in parallel
  const uploadPromises = files.map(file => uploadToIPFS(file, config))
  return Promise.all(uploadPromises)
}

/**
 * Checks if IPFS is properly configured
 */
export function isIPFSConfigured(config: IPFSConfig): boolean {
  return config.enabled && !!config.authToken && !!config.gateway
}

/**
 * Validates IPFS CID format
 */
export function isValidCID(cid: string): boolean {
  // Basic CID validation (simplified)
  // Real implementation should use proper CID validation library
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/i.test(cid) || 
         /^baf[a-z0-9]{56}$/i.test(cid) ||
         /^bafy[a-z0-9]{56}$/i.test(cid)
}

/**
 * Gets IPFS URL from CID
 */
export function getIPFSUrl(cid: string, gateway: string = DEFAULT_IPFS_CONFIG.gateway): string {
  return `${gateway}${cid}`
}

/**
 * Extracts CID from IPFS URL
 */
export function extractCIDFromUrl(url: string): string | null {
  const match = url.match(/\/ipfs\/([^\/\?]+)/)
  return match ? match[1] : null
}

/**
 * Creates metadata object for IPFS storage
 */
export function createIPFSMetadata(file: File, options: { 
  description?: string
  tags?: string[]
  uploadedBy?: string
}): object {
  return {
    name: file.name,
    description: options.description || `Legal document: ${file.name}`,
    image: null, // Not applicable for documents
    attributes: [
      {
        trait_type: 'File Size',
        value: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      },
      {
        trait_type: 'File Type',
        value: file.type || 'unknown',
      },
      {
        trait_type: 'Upload Date',
        value: new Date().toISOString(),
      },
      ...(options.tags || []).map(tag => ({
        trait_type: 'Tag',
        value: tag,
      })),
    ],
    properties: {
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type,
      lastModified: file.lastModified,
      uploadedBy: options.uploadedBy,
      uploadTimestamp: Date.now(),
    },
  }
}

/**
 * Generates a mock CID for testing purposes
 * Replace with actual IPFS upload in production
 */
function generateMockCID(file: File): string {
  // Generate a deterministic mock CID based on file properties
  const hash = hashString(`${file.name}-${file.size}-${file.lastModified}`)
  return `Qm${hash.padEnd(44, '0').slice(0, 44)}`
}

/**
 * Simple hash function for mock CID generation
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Configuration helper to get IPFS config from environment
 */
export function getIPFSConfigFromEnv(): IPFSConfig {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return DEFAULT_IPFS_CONFIG
  }

  return {
    enabled: process.env.NEXT_PUBLIC_IPFS_ENABLED === 'true',
    gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || DEFAULT_IPFS_CONFIG.gateway,
    apiEndpoint: process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT,
    authToken: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  }
}

// Export for easy access
export const ipfsConfig = getIPFSConfigFromEnv() 
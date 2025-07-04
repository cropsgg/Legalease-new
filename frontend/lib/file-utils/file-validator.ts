// File validation utilities for document notarization

export interface FileValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  fileInfo: {
    name: string
    size: number
    type: string
    lastModified: number
  }
}

export interface FileValidationConfig {
  maxSizeBytes: number
  allowedTypes: string[]
  allowedExtensions: string[]
  maxFiles: number
  requireValidExtension: boolean
}

// Default configuration for legal document validation
export const DEFAULT_FILE_CONFIG: FileValidationConfig = {
  maxSizeBytes: 25 * 1024 * 1024, // 25MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp',
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.webp'],
  maxFiles: 10,
  requireValidExtension: true,
}

/**
 * Validates a single file against the configuration
 */
export function validateFile(
  file: File,
  config: FileValidationConfig = DEFAULT_FILE_CONFIG
): FileValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const fileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }

  // Check file size
  if (file.size > config.maxSizeBytes) {
    errors.push(
      `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(config.maxSizeBytes)})`
    )
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty')
  }

  // Check file type
  if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
    if (file.type) {
      errors.push(`File type "${file.type}" is not allowed`)
    } else {
      warnings.push('File type could not be determined')
    }
  }

  // Check file extension
  if (config.requireValidExtension) {
    const extension = getFileExtension(file.name)
    if (!extension) {
      errors.push('File has no extension')
    } else if (!config.allowedExtensions.includes(extension.toLowerCase())) {
      errors.push(`File extension "${extension}" is not allowed`)
    }
  }

  // Check for suspicious file names
  if (hasSuspiciousFileName(file.name)) {
    warnings.push('File name contains suspicious characters')
  }

  // Large file warning
  if (file.size > 10 * 1024 * 1024) { // 10MB
    warnings.push('Large file may take longer to process')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fileInfo,
  }
}

/**
 * Validates multiple files
 */
export function validateFiles(
  files: File[],
  config: FileValidationConfig = DEFAULT_FILE_CONFIG
): {
  overallValid: boolean
  results: FileValidationResult[]
  globalErrors: string[]
} {
  const globalErrors: string[] = []
  
  // Check total number of files
  if (files.length > config.maxFiles) {
    globalErrors.push(`Too many files selected. Maximum allowed: ${config.maxFiles}`)
  }

  // Check for duplicate file names
  const fileNames = files.map(f => f.name)
  const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index)
  if (duplicates.length > 0) {
    globalErrors.push(`Duplicate file names detected: ${[...new Set(duplicates)].join(', ')}`)
  }

  // Validate each file
  const results = files.map(file => validateFile(file, config))

  const overallValid = globalErrors.length === 0 && results.every(result => result.valid)

  return {
    overallValid,
    results,
    globalErrors,
  }
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.')
  return lastDot > 0 ? fileName.slice(lastDot) : ''
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Checks for suspicious file names that might indicate security issues
 */
export function hasSuspiciousFileName(fileName: string): boolean {
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|app)$/i, // Executable extensions
    /[<>:"|?*]/, // Invalid filename characters
    /\.\.|\/|\\/, // Path traversal attempts
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Windows reserved names
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(fileName))
}

/**
 * Checks if a file type is supported for blockchain notarization
 */
export function isSupportedForNotarization(file: File): boolean {
  const notarizationTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ]
  
  return notarizationTypes.includes(file.type)
}

/**
 * Estimates processing time based on file size
 */
export function estimateProcessingTime(fileSizeBytes: number): number {
  // Rough estimation: 1MB = 100ms processing time
  const mbSize = fileSizeBytes / (1024 * 1024)
  return Math.max(100, mbSize * 100) // Minimum 100ms
}

/**
 * Creates a unique identifier for a file based on its properties
 */
export function createFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`.replace(/[^a-zA-Z0-9]/g, '-')
} 
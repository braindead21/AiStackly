/**
 * File Processing Utilities
 * Handles file uploads, reading, and conversion for AI tools
 */

// Supported file types
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  TEXT: ['text/plain', 'text/csv', 'text/html', 'text/markdown'],
  CODE: ['text/javascript', 'text/typescript', 'application/json', 'text/x-python', 'text/x-java'],
};

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Check if file type is supported
 */
export function isSupportedFileType(fileType: string): boolean {
  return Object.values(FILE_TYPES).flat().includes(fileType);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Convert file to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Read text content from file
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

/**
 * Extract text from PDF (basic text extraction)
 * Note: For production, use a library like pdf-parse or pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // For now, return a message that PDF text extraction requires server-side processing
  const text = await readFileAsText(file);
  
  // Basic PDF text extraction (this is a simplified version)
  // In production, you'd use pdf-parse or similar library on the server
  if (text.includes('%PDF')) {
    return `[PDF File: ${file.name}]\nNote: For best results with PDF files, please copy and paste the text content directly.`;
  }
  
  return text;
}

/**
 * Process uploaded file based on type
 */
export async function processFile(file: File): Promise<{
  type: 'image' | 'text' | 'document';
  content: string;
  base64?: string;
  filename: string;
  size: number;
  mimeType: string;
}> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Validate file type
  if (!isSupportedFileType(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const result = {
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    type: 'text' as 'image' | 'text' | 'document',
    content: '',
    base64: undefined as string | undefined,
  };

  // Process based on file type
  if (FILE_TYPES.IMAGES.includes(file.type)) {
    result.type = 'image';
    result.base64 = await fileToBase64(file);
    result.content = `[Image uploaded: ${file.name}]`;
  } else if (FILE_TYPES.TEXT.includes(file.type) || FILE_TYPES.CODE.includes(file.type)) {
    result.type = 'text';
    result.content = await readFileAsText(file);
  } else if (FILE_TYPES.DOCUMENTS.includes(file.type)) {
    result.type = 'document';
    if (file.type === 'application/pdf') {
      result.content = await extractTextFromPDF(file);
    } else {
      // For Word documents, prompt user to copy text
      result.content = `[Document: ${file.name}]\nNote: For Word documents, please copy and paste the text content for best results.`;
    }
  }

  return result;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size (${formatFileSize(file.size)}) exceeds maximum limit of ${formatFileSize(MAX_FILE_SIZE)}` 
    };
  }

  if (!isSupportedFileType(file.type)) {
    return { 
      valid: false, 
      error: `Unsupported file type: ${file.type}. Please upload images, PDFs, Word documents, or text files.` 
    };
  }

  return { valid: true };
}

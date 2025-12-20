"use client";

import { useState, useRef } from "react";
import { ToolConfig } from "@/config/tools";
import { callTool } from "@/lib/api/tools";
import { processFile, validateFile, formatFileSize } from "@/lib/file-processor";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";

export default function ToolForm({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<{ promptTokens: number; completionTokens: number; totalTokens: number } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageTool = tool.id === "ai-image-describer";

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setUploadedFile(file);
    setError("");

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && !uploadedFile && !imageUrl.trim()) {
      setError("Please enter text, upload a file, or provide an image URL");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");
    setUsage(null);

    try {
      let requestData: any = {
        input: input.trim() || "Process this file",
      };

      // Process uploaded file
      if (uploadedFile) {
        const processedFile = await processFile(uploadedFile);
        
        if (processedFile.type === 'image') {
          // For images, send base64 data
          requestData.imageUrl = processedFile.base64;
          requestData.fileName = processedFile.filename;
          // Combine user input with image context
          if (!input.trim()) {
            requestData.input = `Analyze this image (${processedFile.filename})`;
          }
        } else {
          // For text/documents, prepend file content to input
          const fileContent = processedFile.content;
          requestData.input = input.trim() 
            ? `${input.trim()}\n\n--- File Content (${processedFile.filename}) ---\n${fileContent}`
            : fileContent;
          requestData.fileName = processedFile.filename;
          requestData.fileType = processedFile.type;
        }
      } else if (isImageTool && imageUrl.trim()) {
        // Legacy image URL support
        requestData.imageUrl = imageUrl.trim();
      }

      const response = await callTool(tool.id, requestData);

      setLoading(false);

      if (response.success && (response.result || response.output)) {
        setOutput(response.result || response.output || "");
        setUsage(response.usage || null);
      } else {
        setError(response.error || "Failed to process request");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An error occurred while processing your request");
    }
  }

  // Get file icon based on type
  const getFileIcon = () => {
    if (!uploadedFile) return <File className="w-8 h-8" />;
    if (uploadedFile.type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              📁 Upload File (Optional)
            </label>
            <span className="text-xs text-gray-500">
              Images, PDFs, Word, Text files (Max 10MB)
            </span>
          </div>

          {!uploadedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.csv,.md,.html,.js,.ts,.py,.java,.json"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-300 mb-2">
                Drag and drop your file here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-400 hover:text-indigo-300 font-medium underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Supports: Images (JPG, PNG, GIF), Documents (PDF, Word), Code & Text files
              </p>
            </div>
          ) : (
            <div className="border border-gray-600 rounded-lg p-4 bg-gray-800/50">
              <div className="flex items-start gap-4">
                {/* File Preview */}
                <div className="flex-shrink-0">
                  {filePreview ? (
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded border border-gray-600"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-700 rounded border border-gray-600">
                      {getFileIcon()}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
                  </p>
                  <p className="text-xs text-green-400 mt-2">
                    ✓ File attached and ready to process
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={removeFile}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legacy Image URL Input (for AI Image Describer) */}
        {isImageTool && !uploadedFile && (
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
              🔗 Or paste Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Text Input */}
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">
            {uploadedFile ? '💬 Instructions for the AI (Tell it what to do with your file)' : 'Input'}
          </label>
          <textarea
            id="input"
            placeholder={uploadedFile 
              ? "Example: 'Generate an engaging caption' or 'Summarize the key points' or 'Explain this code step by step'" 
              : tool.placeholder
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          {uploadedFile && (
            <p className="text-xs text-gray-400 mt-2">
              💡 Tip: Be specific about what you want the AI to do with your file for best results
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (!input.trim() && !uploadedFile && !imageUrl.trim())}
          className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing...
            </span>
          ) : (
            tool.buttonText
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Output Display */}
      {output && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">✨ Result</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                alert('Copied to clipboard!');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg transition-colors"
            >
              📋 Copy
            </button>
          </div>
          <div className="p-6 bg-gray-800/50 border border-gray-600 rounded-lg">
            <div className="whitespace-pre-wrap text-gray-100 leading-relaxed">
              {output}
            </div>
          </div>

          {/* Usage Stats */}
          {usage && (
            <div className="flex gap-4 text-xs text-gray-400">
              <span>🔤 Tokens: {usage.totalTokens}</span>
              <span>📝 Prompt: {usage.promptTokens}</span>
              <span>💬 Response: {usage.completionTokens}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
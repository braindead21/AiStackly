"use client";

import { useState, useRef } from "react";
import { ToolConfig } from "@/config/tools";
import { processFile, validateFile, formatFileSize } from "@/lib/file-processor";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";

export default function ToolForm({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploadedFile(file);

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

  async function handleSubmit() {
    if (!input.trim() && !uploadedFile) {
      alert("Please enter text or upload a file");
      return;
    }

    setLoading(true);
    try {
      let requestBody: any = { input: input.trim() };

      // Process uploaded file
      if (uploadedFile) {
        const processedFile = await processFile(uploadedFile);
        
        if (processedFile.type === 'image') {
          // For images, send base64 data
          requestBody.imageUrl = processedFile.base64;
          requestBody.fileName = processedFile.filename;
          // Combine user input with image context
          if (!input.trim()) {
            requestBody.input = `Analyze this image (${processedFile.filename})`;
          }
        } else {
          // For text/documents, prepend file content to input
          const fileContent = processedFile.content;
          requestBody.input = input.trim() 
            ? `${input.trim()}\n\n--- File Content (${processedFile.filename}) ---\n${fileContent}`
            : fileContent;
          requestBody.fileName = processedFile.filename;
          requestBody.fileType = processedFile.type;
        }
      }

      const res = await fetch(`/api/tools/${tool.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      
      if (data.success === false) {
        alert(data.error || "An error occurred");
      } else {
        setOutput(data.output);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred while processing your request");
    } finally {
      setLoading(false);
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
      {/* File Upload Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload File (Optional)
          </label>
          <span className="text-xs text-gray-500">
            Images, PDFs, Word, Text files (Max 10MB)
          </span>
        </div>

        {!uploadedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop your file here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Supports: Images (JPG, PNG, GIF), Documents (PDF, Word), Text files
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-start gap-4">
              {/* File Preview */}
              <div className="flex-shrink-0">
                {filePreview ? (
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded border"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded border">
                    {getFileIcon()}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
                </p>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={removeFile}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {uploadedFile ? 'Additional Instructions (Optional)' : 'Text Input'}
        </label>
        <textarea
          placeholder={uploadedFile ? "Add any specific instructions or context..." : tool.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || (!input.trim() && !uploadedFile)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {loading ? "Processing..." : tool.buttonText}
      </button>

      {output && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Result</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                alert('Copied to clipboard!');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Copy
            </button>
          </div>
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

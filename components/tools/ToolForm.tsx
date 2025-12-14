"use client";

import { useState } from "react";
import { ToolConfig } from "@/config/tools";
import { callTool } from "@/lib/api/tools";

export default function ToolForm({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<{ promptTokens: number; completionTokens: number; totalTokens: number } | null>(null);

  const isImageTool = tool.id === "ai-image-describer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setOutput("");
    setUsage(null);

    const response = await callTool(tool.id, {
      input: input.trim(),
      imageUrl: isImageTool && imageUrl.trim() ? imageUrl.trim() : undefined,
    });

    setLoading(false);

    if (response.success && response.result) {
      setOutput(response.result);
      setUsage(response.usage || null);
    } else {
      setError(response.error || "Failed to process request");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {isImageTool && (
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {imageUrl && (
              <div className="mt-3">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isImageTool ? "Additional Instructions" : "Input"}
          </label>
          <textarea
            id="input"
            placeholder={tool.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Processing...
            </span>
          ) : (
            tool.buttonText
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {output && (
        <div className="space-y-3">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium mb-2">Result</p>
            <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
              {output}
            </div>
          </div>

          {usage && (
            <div className="text-sm text-gray-600 dark:text-gray-400 flex gap-4">
              <span>Tokens: {usage.totalTokens}</span>
              <span>Prompt: {usage.promptTokens}</span>
              <span>Completion: {usage.completionTokens}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/**
 * API service for AI tools
 */

export interface ToolRequest {
  input: string;
  imageUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface ToolResponse {
  success: boolean;
  result?: string;
  output?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Call an AI tool
 */
export async function callTool(toolId: string, request: ToolRequest): Promise<ToolResponse> {
  try {
    const response = await fetch(`/api/tools/${toolId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      result: data.result || data.output,
      output: data.output || data.result,
      usage: data.usage,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to call AI tool',
    };
  }
}

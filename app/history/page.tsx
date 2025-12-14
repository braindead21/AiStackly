"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

interface SavedOutput {
  _id: string;
  toolId: string;
  toolName: string;
  input: string;
  imageUrl?: string;
  result: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [outputs, setOutputs] = useState<SavedOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTool, setSelectedTool] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchHistory();
    }
  }, [session, selectedTool]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const url = selectedTool === "all" 
        ? "/api/history" 
        : `/api/history?toolId=${selectedTool}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setOutputs(data.outputs);
      } else {
        setError(data.error || "Failed to fetch history");
      }
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const deleteOutput = async (id: string) => {
    if (!confirm("Are you sure you want to delete this output?")) return;

    try {
      const res = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        setOutputs(outputs.filter(o => o._id !== id));
      } else {
        alert(data.error || "Failed to delete output");
      }
    } catch (err) {
      alert("Failed to delete output");
    }
  };

  const downloadOutput = (output: SavedOutput, format: "txt" | "json") => {
    const content = format === "txt" 
      ? `Tool: ${output.toolName}\nInput: ${output.input}\n${output.imageUrl ? `Image: ${output.imageUrl}\n` : ''}\nResult:\n${output.result}\n\nTokens Used: ${output.tokensUsed.total}\nDate: ${new Date(output.createdAt).toLocaleString()}`
      : JSON.stringify(output, null, 2);
    
    const blob = new Blob([content], { type: format === "txt" ? "text/plain" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.toolId}-${new Date(output.createdAt).getTime()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueTools = Array.from(new Set(outputs.map(o => o.toolId)));

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] pt-24 flex items-center justify-center">
          <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 relative"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] pt-24 pb-12">
        <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Saved Outputs</h1>
            <p className="text-gray-300">View and manage your AI tool outputs</p>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all" className="bg-gray-800 text-white">All Tools</option>
              {uniqueTools.map(toolId => (
                <option key={toolId} value={toolId} className="bg-gray-800 text-white">
                  {outputs.find(o => o.toolId === toolId)?.toolName}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Outputs List */}
          {outputs.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-300 text-lg">No saved outputs yet</p>
              <p className="text-gray-400 mt-2">Start using AI tools to save your outputs</p>
            </div>
          ) : (
            <div className="space-y-6">
              {outputs.map((output) => (
                <div key={output._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{output.toolName}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(output.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadOutput(output, "txt")}
                        className="px-3 py-1 text-sm bg-indigo-500/20 text-indigo-100 rounded hover:bg-indigo-500/30 transition"
                      >
                        TXT
                      </button>
                      <button
                        onClick={() => downloadOutput(output, "json")}
                        className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-100 rounded hover:bg-emerald-500/30 transition"
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => deleteOutput(output._id)}
                        className="px-3 py-1 text-sm bg-red-500/20 text-red-100 rounded hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-slate-200 mb-1">Input:</div>
                      <div className="text-slate-100 bg-white/5 border border-white/10 p-3 rounded">
                        {output.input}
                      </div>
                    </div>

                    {output.imageUrl && (
                      <div>
                        <div className="text-sm font-medium text-slate-200 mb-1">Image:</div>
                        <img 
                          src={output.imageUrl} 
                          alt="Input" 
                          className="max-w-xs rounded border border-white/10"
                        />
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-slate-200 mb-1">Result:</div>
                      <div className="text-slate-100 bg-white/5 border border-white/10 p-3 rounded whitespace-pre-wrap">
                        {output.result}
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-300/80">
                      <span>Tokens: {output.tokensUsed.total}</span>
                      <span>•</span>
                      <span>Prompt: {output.tokensUsed.prompt}</span>
                      <span>•</span>
                      <span>Completion: {output.tokensUsed.completion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

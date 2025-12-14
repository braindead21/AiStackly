"use client";

import { useState } from "react";
import { ToolConfig } from "@/config/tools";

export default function ToolForm({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch(`/api/tools/${tool.id}`, {
      method: "POST",
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    setOutput(data.output);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <textarea
        placeholder={tool.placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Processing..." : tool.buttonText}
      </button>

      {output && (
        <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}

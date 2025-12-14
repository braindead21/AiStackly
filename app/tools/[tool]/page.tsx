import { getToolConfig } from "@/config/tools";
import ToolForm from "@/components/tools/ToolForm";
import Navbar from "@/components/layout/Navbar";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  const tool = getToolConfig(toolId);

  if (!tool) {
    return <div className="p-10 text-red-600">Invalid tool.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] p-10 pt-24">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
      <div className="relative max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">{tool.title}</h1>
        <p className="text-gray-300">{tool.description}</p>

      <ToolForm tool={tool} />
      </div>
    </div>
    </>
  );
}

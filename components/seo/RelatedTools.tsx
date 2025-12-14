import Link from "next/link";
import { ToolConfig } from "@/config/tools";

interface RelatedToolsProps {
  tools: ToolConfig[];
  title?: string;
}

export default function RelatedTools({ tools, title = "Related Tools" }: RelatedToolsProps) {
  if (tools.length === 0) return null;
  
  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.id}`}
            className="group p-6 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className="text-2xl">{getCategoryIcon(tool.category)}</div>
              <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                {tool.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {tool.description}
            </p>
            <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center">
              Try it now 
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function getCategoryIcon(category?: string): string {
  const icons: Record<string, string> = {
    "Social Media": "📱",
    "SEO & Marketing": "📈",
    "Content Writing": "✍️",
    "Development": "💻",
    "E-commerce": "🛒",
    "Career": "💼",
    "Communication": "✉️",
    "Productivity": "⚡",
    "AI Vision": "👁️",
    "Writing": "📝",
    "Sales": "💰",
    "Advertising": "📢"
  };
  return icons[category || ""] || "🔧";
}

"use client";

import Link from "next/link";
import { tools, getAllCategories } from "@/config/tools";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Navbar from "@/components/layout/Navbar";

export default function ToolsPage() {
  const categories = getAllCategories();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";

  const filteredTools = useMemo(() => {
    let filtered = tools;
    
    // Filter by category first if specified
    if (categoryFilter.trim()) {
      filtered = filtered.filter(tool => tool.category === categoryFilter);
    }
    
    // Then filter by search query if specified
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, categoryFilter]);

  const displayCategories = useMemo(() => {
    if (searchQuery.trim() || categoryFilter.trim()) {
      // When filtering, only show categories that have matching tools
      return categories.filter(category => 
        filteredTools.some(tool => tool.category === category)
      );
    }
    return categories;
  }, [categories, filteredTools, searchQuery, categoryFilter]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] pt-16">
        <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-white">
          {categoryFilter 
            ? categoryFilter
            : searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : "AI Tools Collection"
          }
        </h1>
        <p className="text-lg text-gray-300 mb-12">
          {categoryFilter
            ? `${filteredTools.length} ${filteredTools.length === 1 ? 'tool' : 'tools'} in ${categoryFilter}`
            : searchQuery 
              ? `Found ${filteredTools.length} ${filteredTools.length === 1 ? 'tool' : 'tools'} matching your search`
              : `Explore our collection of ${tools.length} free AI-powered tools to boost your productivity.`
          }
        </p>

        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              {categoryFilter 
                ? `No tools found in "${categoryFilter}" category`
                : `No tools found matching "${searchQuery}"`
              }
            </p>
            <Link href="/tools" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              View all tools
            </Link>
          </div>
        ) : (
          displayCategories.map((category) => {
            const categoryTools = filteredTools.filter(t => t.category === category);
          
            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <Link
                      href={`/tools/${tool.id}`}
                      key={tool.id}
                      className="border border-gray-700 p-6 rounded-xl shadow hover:shadow-lg hover:border-indigo-500 hover:shadow-indigo-500/20 transition-all bg-gray-800/50 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          {tool.title}
                        </h3>
                        {tool.modelType === "vision" && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                            Vision
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        {tool.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
      </div>
    </>
  );
}

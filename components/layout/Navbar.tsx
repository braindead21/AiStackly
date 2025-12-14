"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import { tools } from "@/config/tools";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof tools>([]);
  const searchRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      const query = value.toLowerCase();
      const filtered = tools.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query)
      ).slice(0, 5); // Show max 5 suggestions
      
      setFilteredSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
      setFilteredSuggestions([]);
    }
  };

  const handleToolClick = (toolId: string) => {
    router.push(`/tools/${toolId}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#0a0e1a]/90 backdrop-blur-2xl border-b border-white/5 fixed w-full z-50 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <h1 className="text-white font-bold text-xl tracking-tight">
                AiStackly
              </h1>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0 && filteredSuggestions.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-xl px-5 py-3 text-sm focus:outline-none focus:bg-white/10 focus:border-indigo-400/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Dropdown Suggestions */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {filteredSuggestions.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className="w-full text-left px-5 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm truncate">{tool.title}</div>
                          <div className="text-gray-400 text-xs mt-1 line-clamp-1">{tool.description}</div>
                        </div>
                        <div className="text-xs text-indigo-400 whitespace-nowrap">{tool.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right: Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/5">Home</Link>
            <Link href="/tools" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/5">Tools</Link>
            <div className="ml-2">
              <AuthButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0a0e1a]/95 backdrop-blur-2xl border-t border-white/5">
          <div className="px-6 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-xl px-5 py-3 text-sm focus:outline-none focus:bg-white/10 focus:border-indigo-400/50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Mobile Dropdown Suggestions */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {filteredSuggestions.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        handleToolClick(tool.id);
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="text-white font-medium text-sm">{tool.title}</div>
                      <div className="text-gray-400 text-xs mt-1 line-clamp-1">{tool.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </form>
            
            <Link href="/" className="block text-gray-300 hover:text-white font-medium px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/tools" className="block text-gray-300 hover:text-white font-medium px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setOpen(false)}>Tools</Link>
            <div className="pt-3 border-t border-white/5">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
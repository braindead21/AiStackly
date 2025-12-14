"use client";

import * as React from "react";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    if (!query) return;
    window.location.href = `/tools?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="mt-6 flex justify-center">
      <input
        type="text"
        placeholder="Search AI Tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-xl px-6 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
      <button
        onClick={handleSearch}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-r-lg font-medium transition"
      >
        Search
      </button>
    </div>
  );
}
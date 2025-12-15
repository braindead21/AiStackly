"use client";

import * as React from "react";
import Link from "next/link";
import { trackToolClick } from "@/lib/analytics";

interface ToolCardProps {
  name: string;
  description: string;
  category: string;
  link: string;
}

export default function ToolCard({ name, description, category, link }: ToolCardProps) {
  const handleClick = () => {
    trackToolClick(link, name);
  };

  return (
    <Link href={link} onClick={handleClick}>
      <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">{category}</span>
        </div>
        <p className="text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

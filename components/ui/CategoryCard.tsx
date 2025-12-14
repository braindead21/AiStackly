import * as React from "react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
}

export default function CategoryCard({ title, description, icon }: CategoryCardProps) {
  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
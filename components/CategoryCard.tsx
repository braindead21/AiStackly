import * as React from "react";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
}

export default function CategoryCard({ title, description, icon, link }: CategoryCardProps) {
  const CardBody = (
    <div className="w-full rounded-2xl p-6 min-h-[180px] flex flex-col items-center justify-center gap-3 hover:scale-[1.02] transition-transform cursor-pointer bg-gradient-to-br from-[#0f1729]/80 via-[#0c1324]/80 to-[#0a1020]/80 border border-white/10 shadow-lg shadow-indigo-500/10 backdrop-blur">
      {icon && <div className="text-indigo-200 text-4xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-300/80 text-center">{description}</p>
    </div>
  );

  if (!link) {
    return CardBody;
  }

  return <Link href={link}>{CardBody}</Link>;
}

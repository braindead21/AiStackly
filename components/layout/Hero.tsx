import * as React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#0a0e1a] pt-32 pb-0 text-center overflow-hidden">
      {/* Gradient overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141b2d] via-[#0a0e1a] to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          Instant AI Tools for Everyone
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Generate captions, emails, resumes, summaries, and more with a single click. Free.<br/>
          No signup required.
        </p>

        {/* CTA Button */}
        <Link href="/tools">
          <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold px-10 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105">
            Explore Tools
          </button>
        </Link>

        {/* Optional small subtext */}
        <p className="text-gray-400 mt-6 text-sm">
          Trusted by 1,000+ students & creators
        </p>
      </div>
    </section>
  );
}